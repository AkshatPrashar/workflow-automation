import imaplib
import smtplib
import email
from email.header import decode_header
from email.mime.text import MIMEText
import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.email import Email
from app.repositories.email import EmailRepository

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.mock_mode = settings.MOCK_EMAIL_INBOX

    async def fetch_and_store_unread_emails(self, db: AsyncSession) -> List[Email]:
        """
        Fetches unread emails from IMAP or generates mock emails,
        stores them in the database with status 'Pending', and returns them.
        """
        emails_data = []

        if self.mock_mode:
            logger.info("Operating in MOCK email inbox mode. Generating dummy unread emails.")
            emails_data = self._generate_mock_emails()
        else:
            logger.info("Connecting to live IMAP server to fetch unread emails.")
            emails_data = self._fetch_imap_emails()

        email_repo = EmailRepository(db)
        stored_emails = []

        for item in emails_data:
            # Check if this email was already fetched (basic duplicate check by subject and sender)
            # In a full production app, we would check Message-ID header
            existing = await email_repo.get_emails(category=None, priority=None, status=None, limit=50)
            is_duplicate = False
            for old_mail in existing:
                if old_mail.sender == item["sender"] and old_mail.subject == item["subject"] and old_mail.body == item["body"]:
                    is_duplicate = True
                    break
            
            if not is_duplicate:
                new_email = await email_repo.create({
                    "sender": item["sender"],
                    "subject": item["subject"],
                    "body": item["body"],
                    "status": "Pending"
                })
                stored_emails.append(new_email)
        
        await db.commit()
        return stored_emails

    async def send_approved_reply(self, db: AsyncSession, email_id: int) -> bool:
        """
        Sends the approved draft reply via SMTP and updates status to 'Sent'.
        """
        email_repo = EmailRepository(db)
        email_record = await email_repo.get(email_id)
        
        if not email_record:
            logger.error(f"Email with id {email_id} not found in database.")
            return False
            
        if email_record.status != "Approved":
            logger.error(f"Email with id {email_id} is in status '{email_record.status}', not 'Approved'.")
            return False

        if not email_record.draft_reply:
            logger.error(f"Email with id {email_id} does not have a draft reply to send.")
            return False

        if self.mock_mode:
            logger.info(f"[MOCK SMTP] Successfully sent reply to {email_record.sender}")
            await email_repo.update(email_record, {"status": "Sent"})
            await db.commit()
            return True
            
        try:
            # Create email message
            msg = MIMEText(email_record.draft_reply)
            msg['Subject'] = f"Re: {email_record.subject}"
            msg['From'] = settings.SMTP_EMAIL
            msg['To'] = email_record.sender

            # Connect to SMTP server
            # Standard TLS connection
            server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
            server.starttls()
            server.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)
            server.send_mail(settings.SMTP_EMAIL, [email_record.sender], msg.as_string())
            server.quit()
            
            logger.info(f"Successfully sent real SMTP reply to {email_record.sender}")
            await email_repo.update(email_record, {"status": "Sent"})
            await db.commit()
            return True
        except Exception as e:
            logger.error(f"Failed to send SMTP reply: {e}")
            await email_repo.update(email_record, {"status": "Failed"})
            await db.commit()
            return False

    def _fetch_imap_emails(self) -> List[Dict[str, str]]:
        """Connects to real IMAP server and retrieves unread emails."""
        emails_list = []
        try:
            # Connect to IMAP
            mail = imaplib.IMAP4_SSL(settings.IMAP_SERVER, settings.IMAP_PORT)
            mail.login(settings.IMAP_EMAIL, settings.IMAP_PASSWORD)
            mail.select("inbox")

            # Search for unread emails (status: UNSEEN)
            status, messages = mail.search(None, 'UNSEEN')
            if status != "OK":
                logger.warning("No new unread emails found or search failed.")
                return []

            # Get the list of message IDs
            msg_ids = messages[0].split()
            # Fetch up to 10 unread emails to prevent overloading
            for msg_id in msg_ids[-10:]:
                res, msg_data = mail.fetch(msg_id, '(RFC822)')
                for response_part in msg_data:
                    if isinstance(response_part, tuple):
                        msg = email.message_from_bytes(response_part[1])
                        
                        # Decode subject
                        subject, encoding = decode_header(msg["Subject"])[0]
                        if isinstance(subject, bytes):
                            subject = subject.decode(encoding or "utf-8", errors="ignore")
                        
                        # Decode sender
                        sender, encoding = decode_header(msg["From"])[0]
                        if isinstance(sender, bytes):
                            sender = sender.decode(encoding or "utf-8", errors="ignore")

                        # Get body
                        body = ""
                        if msg.is_multipart():
                            for part in msg.walk():
                                content_type = part.get_content_type()
                                content_disposition = str(part.get("Content-Disposition"))
                                if content_type == "text/plain" and "attachment" not in content_disposition:
                                    payload = part.get_payload(decode=True)
                                    body = payload.decode(errors="ignore") if payload else ""
                                    break
                        else:
                            payload = msg.get_payload(decode=True)
                            body = payload.decode(errors="ignore") if payload else ""

                        emails_list.append({
                            "sender": sender,
                            "subject": subject,
                            "body": body.strip()
                        })
            mail.close()
            mail.logout()
        except Exception as e:
            logger.error(f"Error fetching emails from IMAP: {e}")
        
        return emails_list

    def _generate_mock_emails(self) -> List[Dict[str, str]]:
        """Generates mock emails for testing"""
        return [
            {
                "sender": "client-billing@company.com",
                "subject": "Invoice status query - P-4509",
                "body": "Hello team, I hope you are doing well. Could you please send us the status update on Invoice P-4509? Our accounts department is waiting to make the final payment. Thanks, billing team."
            },
            {
                "sender": "support-ticket@customer.com",
                "subject": "URGENT: Database login is broken",
                "body": "Hi, I am unable to login to the database server. It keeps returning connection timeout. Please look into this immediately as our production environment is completely down! ASAP!"
            },
            {
                "sender": "careers@hrportal.com",
                "subject": "Candidate Resume: Alice Green for Backend Dev",
                "body": "Hi Team, Attached is the resume for Alice Green, who is applying for the Backend Engineer position. She has strong Python and FastAPI experience. Let's schedule an interview next week."
            }
        ]

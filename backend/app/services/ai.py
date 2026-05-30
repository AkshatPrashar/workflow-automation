import json
import logging
from typing import List, Dict, Any, Optional
from openai import OpenAI
from app.config import settings

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.model = settings.OPENAI_MODEL
        # Initialize client if API key is provided, otherwise we'll run in mock fallback mode
        if self.api_key and not self.api_key.startswith("your_openai"):
            self.client = OpenAI(api_key=self.api_key)
            self.is_mock = False
        else:
            self.client = None
            self.is_mock = True
            logger.warning("No valid OpenAI API key found. AI Service will operate in MOCK fallback mode.")

    def _call_openai(self, system_prompt: str, user_prompt: str, json_mode: bool = False) -> str:
        if self.is_mock or not self.client:
            return self._get_mock_response(system_prompt, user_prompt, json_mode)

        try:
            response_format = {"type": "json_object"} if json_mode else {"type": "text"}
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format=response_format,
                temperature=0.3
            )
            content = response.choices[0].message.content
            return content.strip() if content else ""
        except Exception as e:
            logger.error(f"Error calling OpenAI API: {e}. Falling back to mock data.")
            return self._get_mock_response(system_prompt, user_prompt, json_mode)

    def categorize_email(self, body: str) -> str:
        system_prompt = (
            "You are an email triage assistant. "
            "Categorize the email body into exactly one of these categories: "
            "Support, Sales, HR, Finance, Internal, Other. "
            "Respond with only the category word and nothing else."
        )
        category = self._call_openai(system_prompt, body)
        # Validate that category is one of the valid options, if not default to 'Other'
        valid_categories = {"Support", "Sales", "HR", "Finance", "Internal", "Other"}
        if category in valid_categories:
            return category
        
        # Clean up any potential surrounding punctuation/whitespace
        cleaned = category.title().strip()
        if cleaned in valid_categories:
            return cleaned
        return "Other"

    def prioritize_email(self, body: str) -> str:
        system_prompt = (
            "You are an email urgency classifier. "
            "Classify the priority of the email into exactly one of: "
            "High, Medium, Low. "
            "Respond with only the priority word and nothing else."
        )
        priority = self._call_openai(system_prompt, body)
        valid_priorities = {"High", "Medium", "Low"}
        if priority in valid_priorities:
            return priority
        
        cleaned = priority.title().strip()
        if cleaned in valid_priorities:
            return cleaned
        return "Medium"

    def generate_reply(self, body: str) -> str:
        system_prompt = (
            "You are an automated corporate assistant. "
            "Generate a professional, friendly, and helpful draft reply "
            "to the email body. Acknowledge their message, keep it brief, "
            "and suggest next steps. Do not include template variables like [My Name], "
            "use 'AI Assistant' or leave a generic professional signature."
        )
        return self._call_openai(system_prompt, body)

    def summarize_meeting(self, transcript: str) -> str:
        system_prompt = (
            "You are an expert meeting recorder. "
            "Summarize the provided meeting transcript. "
            "Provide a high-quality Markdown summary including: "
            "1. Meeting Objective / Summary\n"
            "2. Key Discussions & Decisions\n"
            "3. Key Takeaways"
        )
        return self._call_openai(system_prompt, transcript)

    def extract_action_items(self, transcript: str) -> List[Dict[str, Any]]:
        system_prompt = (
            "You are a project manager. Analyze the transcript and extract action items. "
            "Return a JSON object containing a key 'tasks' which is a list of tasks. "
            "Each task must have:\n"
            "- 'task_name': clear description of what needs to be done\n"
            "- 'owner': name of the person responsible (or null if not specified)\n"
            "- 'deadline': deadline date in YYYY-MM-DD format (or null if not mentioned or suggested)\n\n"
            "Ensure the output is valid JSON matching this schema: "
            '{"tasks": [{"task_name": "Review contract", "owner": "John", "deadline": "2026-06-15"}]}'
        )
        raw_json = self._call_openai(system_prompt, transcript, json_mode=True)
        try:
            data = json.loads(raw_json)
            tasks = data.get("tasks", [])
            if isinstance(tasks, list):
                return tasks
            return []
        except Exception as e:
            logger.error(f"Failed to parse tasks JSON: {e}")
            return []

    def _get_mock_response(self, system_prompt: str, user_prompt: str, json_mode: bool) -> str:
        """Fallback mock responses for offline development / testing without API Key"""
        user_prompt_lower = user_prompt.lower()
        
        # 1. Categorize Email Mock
        if "categories:" in system_prompt:
            if "pricing" in user_prompt_lower or "quote" in user_prompt_lower or "buy" in user_prompt_lower:
                return "Sales"
            elif "password" in user_prompt_lower or "bug" in user_prompt_lower or "error" in user_prompt_lower or "login" in user_prompt_lower:
                return "Support"
            elif "resume" in user_prompt_lower or "interview" in user_prompt_lower or "job" in user_prompt_lower:
                return "HR"
            elif "invoice" in user_prompt_lower or "billing" in user_prompt_lower or "payment" in user_prompt_lower:
                return "Finance"
            elif "lunch" in user_prompt_lower or "standup" in user_prompt_lower or "meeting" in user_prompt_lower:
                return "Internal"
            return "Other"

        # 2. Prioritize Email Mock
        if "urgency classifier" in system_prompt:
            if "urgent" in user_prompt_lower or "asap" in user_prompt_lower or "broken" in user_prompt_lower or "critical" in user_prompt_lower:
                return "High"
            elif "important" in user_prompt_lower or "soon" in user_prompt_lower:
                return "Medium"
            return "Low"

        # 3. Generate Draft Reply Mock
        if "automated corporate assistant" in system_prompt:
            return (
                "Hello,\n\n"
                "Thank you for reaching out. We have received your request regarding this matter. "
                "Our team is currently reviewing the details and will get back to you shortly with next steps.\n\n"
                "If you have any additional details to add in the meantime, feel free to reply to this thread.\n\n"
                "Best regards,\n"
                "AI Automation Assistant"
            )

        # 4. Summarize Meeting Mock
        if "meeting recorder" in system_prompt:
            return (
                "# Meeting Summary\n\n"
                "## Objective\n"
                "The team met to coordinate progress on the Q3 roadmap, refine project priorities, and assign immediate owners for pending deliverables.\n\n"
                "## Key Discussions & Decisions\n"
                "- **Infrastructure upgrade**: The team agreed that the Redis and Postgres migrations need to be finalized by early next week to prevent load issues.\n"
                "- **Task Ownership**: Alice is taking over API documentation, Bob will lead the integration test suite, and Charlie will manage SMTP server configuration.\n\n"
                "## Key Takeaways\n"
                "- Development environment is stable, but monitoring needs improvement.\n"
                "- Next sync scheduled for next Thursday."
            )

        # 5. Extract Action Items Mock
        if "project manager" in system_prompt or json_mode:
            # Look for tasks inside transcript
            tasks_list = []
            if "alice" in user_prompt_lower:
                tasks_list.append({
                    "task_name": "Draft API documentation",
                    "owner": "Alice",
                    "deadline": "2026-06-05"
                })
            if "bob" in user_prompt_lower:
                tasks_list.append({
                    "task_name": "Implement integration test suite",
                    "owner": "Bob",
                    "deadline": "2026-06-10"
                })
            if "charlie" in user_prompt_lower:
                tasks_list.append({
                    "task_name": "Configure SMTP production server credentials",
                    "owner": "Charlie",
                    "deadline": "2026-06-02"
                })
            
            if not tasks_list:
                tasks_list = [
                    {
                        "task_name": "Review general project goals",
                        "owner": "Team",
                        "deadline": "2026-06-15"
                    }
                ]
            return json.dumps({"tasks": tasks_list})

        return "Default Mock Response"

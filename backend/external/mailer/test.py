import os
import sys
import django
from pathlib import Path
from dotenv import load_dotenv

# Add the parent directory to path so we can import Django settings
backend_path = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(backend_path))

# Load environment variables from .env file
env_file = backend_path / '.env'
if env_file.exists():
    load_dotenv(env_file)

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

# Now import our EmailSender
from external.mailer.mailer import EmailSender

def test_password_reset_email():
    """Send a test password reset email"""
    email_sender = EmailSender()
    recipient = "rmyrmel@harwood1.com"
    reset_link = "https://example.com/reset-password/?token=test_token_123456789"
    
    print(f"Sending test password reset email to {recipient}...")
    success = email_sender.send_password_reset_email(
        to_email=recipient,
        reset_link=reset_link,
        user_name="Ryan"
    )
    
    if success:
        print("Test email sent successfully!")
    else:
        print("Failed to send test email")

if __name__ == "__main__":
    test_password_reset_email()

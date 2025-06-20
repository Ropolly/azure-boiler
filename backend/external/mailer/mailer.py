import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from jinja2 import Environment, FileSystemLoader

class EmailSender:
    def __init__(self):
        self.email_host = os.environ.get('EMAIL_HOST')
        self.email_port = int(os.environ.get('EMAIL_PORT', 587))
        self.email_user = os.environ.get('EMAIL_HOST_USER')
        self.email_password = os.environ.get('EMAIL_HOST_PASSWORD')
        self.use_tls = os.environ.get('EMAIL_USE_TLS', 'True').lower() == 'true'
        self.default_from_email = os.environ.get('DEFAULT_FROM_EMAIL')
        
        # Set up Jinja2 environment for email templates
        templates_dir = Path(__file__).parent / 'templates'
        self.env = Environment(loader=FileSystemLoader(templates_dir))
        
    def _render_template(self, template_name, context):
        """Render a template with the given context"""
        template = self.env.get_template(template_name)
        return template.render(**context)
    
    def send_email(self, to_email, subject, template_name, context):
        """
        Send an email using the specified template and context
        
        Args:
            to_email (str or list): Recipient email(s)
            subject (str): Email subject
            template_name (str): Name of the template file in the templates directory
            context (dict): Data to populate the template
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        if isinstance(to_email, str):
            to_email = [to_email]
        
        # Check if we have credentials
        if not all([self.email_host, self.email_user, self.email_password]):
            print("Missing email credentials in environment variables")
            return False
            
        try:
            # Render template
            html_content = self._render_template(template_name, context)
        
            # Create message container
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.default_from_email or self.email_user
            msg['To'] = ', '.join(to_email)
            
            # Attach parts to message
            part = MIMEText(html_content, 'html')
            msg.attach(part)
            
            # Connect to mail server and send
            with smtplib.SMTP(self.email_host, self.email_port) as server:
                server.ehlo()
                
                if self.use_tls:
                    server.starttls()
                    server.ehlo()
                    
                # Log in to the server
                server.login(self.email_user, self.email_password)
                
                # Send the email
                server.sendmail(
                    msg['From'], 
                    to_email, 
                    msg.as_string()
                )
                
            return True
        except Exception as e:
            print(f"Failed to send email: {e}")
            return False

    def send_password_reset_email(self, to_email, reset_link, user_name=None):
        """
        Send a password reset email
        
        Args:
            to_email (str): Recipient email
            reset_link (str): Password reset link
            user_name (str, optional): User's name
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        context = {
            'reset_link': reset_link,
            'user_name': user_name or 'User'
        }
        
        return self.send_email(
            to_email=to_email,
            subject="Password Reset Request",
            template_name="password_reset.html",
            context=context
        )

# cPanel Environment Configuration
import os
import sys

# Force UTF-8 encoding for production (fixes UnicodeEncodeError)
import locale
try:
    locale.setlocale(locale.LC_ALL, 'C.UTF-8')
except locale.Error:
    try:
        locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')
    except locale.Error:
        pass  # Continue with default if locale setting fails

# Set environment encoding
os.environ.setdefault('LANG', 'en_US.UTF-8')
os.environ.setdefault('LC_ALL', 'en_US.UTF-8')
os.environ.setdefault('PYTHONIOENCODING', 'utf-8')

# Add your project to Python path
project_home = os.path.dirname(os.path.abspath(__file__))
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'altivomart_backend.settings')

# Import Django and configure
import django
from django.core.wsgi import get_wsgi_application

django.setup()
application = get_wsgi_application()

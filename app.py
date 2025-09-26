# cPanel Environment Configuration
import os
import sys

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

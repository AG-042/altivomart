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

# Add your project directory to the sys.path
sys.path.insert(0, os.path.dirname(__file__))

from altivomart_backend.wsgi import application

# cPanel expects this
app = application

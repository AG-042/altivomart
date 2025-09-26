import os
import sys

# Add your project directory to the sys.path
sys.path.insert(0, os.path.dirname(__file__))

from altivomart_backend.wsgi import application

# cPanel expects this
app = application

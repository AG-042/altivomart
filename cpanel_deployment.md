# cPanel Deployment Instructions for Altivomart Django Backend

## Prerequisites
- cPanel hosting account with Python support
- SSH access (if available)
- Domain name configured

## Files for cPanel Deployment

### 1. Upload Files
Upload these files to your cPanel public_html or subdomain folder:
- passenger_wsgi.py (main WSGI file for cPanel)
- app.py (alternative WSGI configuration)
- All Django project files
- requirements.txt

### 2. Python App Setup in cPanel
1. Go to cPanel → "Setup Python App"
2. Create new Python application:
   - Python Version: 3.8+ (whatever cPanel supports)
   - Application Root: /public_html (or your subdomain folder)
   - Application URL: your domain or subdomain
   - Application Entry Point: passenger_wsgi.py
   - Application Startup File: passenger_wsgi.py

### 3. Install Dependencies
In cPanel Python app terminal or SSH:
```bash
pip install -r requirements.txt
```

### 4. Environment Variables
Set these in cPanel Python app environment or in a .env file:
```
SECRET_KEY=your-50-character-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=mysql://username:password@localhost/database_name
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://your-frontend-url.com
```

### 5. Database Setup
- Create MySQL database in cPanel
- Update DATABASE_URL with your cPanel database credentials
- Run migrations via SSH or cPanel terminal:
```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

### 6. Static Files
- Ensure STATIC_ROOT points to a web-accessible directory
- Run collectstatic command
- Configure cPanel to serve static files from /static/ URL

### 7. Media Files
- Create media directory in public_html
- Ensure proper permissions (755 for directories, 644 for files)
- Update MEDIA_URL and MEDIA_ROOT in settings

### 8. Frontend Configuration
Update your Next.js frontend .env file:
```
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

## Common cPanel Issues & Solutions

### Issue: Python App not starting
- Check passenger_wsgi.py is in root directory
- Verify Python version compatibility
- Check error logs in cPanel

### Issue: Database connection
- Ensure DATABASE_URL format is correct for MySQL
- Check database user has proper permissions
- Verify hostname (usually localhost for cPanel)

### Issue: Static files not serving
- Run collectstatic command
- Check STATIC_ROOT path
- Ensure web server can access static directory

### Issue: CORS errors
- Add your frontend domain to CORS_ALLOWED_ORIGINS
- Check CSRF_TRUSTED_ORIGINS includes both domains

## Final Steps
1. Test API endpoints: https://yourdomain.com/api/products/
2. Verify admin panel: https://yourdomain.com/admin/
3. Check static files loading
4. Test CORS with frontend

## Directory Structure on cPanel
```
public_html/
├── passenger_wsgi.py
├── app.py
├── manage.py
├── requirements.txt
├── altivomart_backend/
├── products/
├── orders/
├── notifications/
├── media/
├── static/
└── staticfiles/
```

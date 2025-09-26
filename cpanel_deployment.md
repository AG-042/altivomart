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
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://your-frontend-url.com
```

### 5. Database Setup
The application uses SQLite database (db.sqlite3 file) - no additional database setup needed in cPanel.

**Initial Deployment:**
Your first deployment includes a pre-populated database with sample products.

**Subsequent Deployments:**
⚠️ **Important**: The database file is excluded from future commits to prevent overwriting production data.

Run these commands via SSH or cPanel terminal:
```bash
python manage.py migrate  # Apply any new migrations
python manage.py collectstatic --noinput
python manage.py check_media  # Verify media files are working
```

**Database Backup Recommendation:**
Always backup your `db.sqlite3` file before deploying updates:
```bash
cp db.sqlite3 db.sqlite3.backup.$(date +%Y%m%d_%H%M%S)
```

### 6. Static and Media Files Setup

#### Static Files (CSS, JS, Admin files)
1. Static files are handled by WhiteNoise automatically
2. The `staticfiles/` folder will be created after running collectstatic
3. No additional cPanel configuration needed

#### Media Files (Product images, uploads)
1. Your `media/` folder with product images is included in the deployment
2. Django serves media files automatically through `/media/` URL
3. Images will be accessible at: `https://yourdomain.com/media/products/image.jpg`

#### File Permissions on cPanel
Set proper permissions after uploading:
```bash
chmod -R 755 media/
chmod -R 644 media/products/*
chmod -R 755 staticfiles/
```

#### Image Loading in Frontend
Your frontend should access images like this:
```javascript
// In your React components
const imageUrl = `${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}/media/products/image.jpg`;
```

### 7. Frontend Configuration
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
- SQLite database (db.sqlite3) is included in initial deployment
- No additional database setup required
- Ensure db.sqlite3 has proper file permissions (644 or 664)

### Database Management in Production
- **Backup regularly**: `cp db.sqlite3 db.sqlite3.backup.$(date +%Y%m%d)`
- **Updates preserve data**: Future code updates won't overwrite your database
- **Manual migrations**: Run `python manage.py migrate` after code updates
- **Admin access**: Use Django admin at `https://yourdomain.com/admin/`

### Issue: Static files not serving
- Run collectstatic command: `python manage.py collectstatic --noinput`
- Check STATIC_ROOT path in settings.py
- Ensure WhiteNoise is installed and configured

### Issue: Images not loading
- **Check file permissions**: `chmod 755 media/` and `chmod 644 media/products/*`
- **Verify media URL**: Images should be at `https://yourdomain.com/media/products/filename.jpg`
- **Frontend environment**: Update `NEXT_PUBLIC_API_ORIGIN=https://yourdomain.com` in frontend .env
- **Django URLs**: Ensure media URLs are configured in urls.py
- **File upload**: Make sure media files are uploaded to cPanel with your project

### Issue: 404 errors for media files
- Check if media folder exists in your cPanel file manager
- Verify Django is serving media URLs (check urls.py configuration)
- Test direct access: `https://yourdomain.com/media/products/test-image.jpg`

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

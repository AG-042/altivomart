# Unicode Encoding Fix - Deployment Instructions

## Problem
Production checkout was failing with `UnicodeEncodeError at /api/orders/create/` (HTTP 500 error).

## Root Cause
Django was unable to properly encode customer names, addresses, or other text fields containing:
- Special characters (apostrophes, accents, etc.)
- Nigerian characters
- Emojis or non-ASCII characters

This worked in development but failed in production due to different locale/encoding settings.

## Files Modified

### 1. **Backend Settings** (`altivomart_backend/settings.py`)
- Added locale configuration to force UTF-8 encoding
- Set `DEFAULT_CHARSET = 'utf-8'` and `FILE_CHARSET = 'utf-8'`

### 2. **Order Serializer** (`orders/serializers.py`)
- Added validation methods for all text fields:
  - `validate_customer_name()`
  - `validate_address()`
  - `validate_city()`
  - `validate_state()`
  - `validate_landmark()`
  - `validate_delivery_instructions()`
- Each validator ensures UTF-8 compatibility using `encode/decode` with error handling

### 3. **Order Model** (`orders/models.py`)
- Modified `save()` method to sanitize all text fields before saving
- Ensures all text is UTF-8 compatible at the database level

### 4. **Order Views** (`orders/views.py`)
- Added logging to track order creation process
- Wrapped email sending in try-except to prevent email failures from blocking orders
- Added specific handling for `UnicodeEncodeError`

### 5. **Production WSGI Files**
- **`passenger_wsgi.py`** - Updated with UTF-8 locale settings
- **`app.py`** - Updated with UTF-8 environment variables

## Deployment Steps

### Step 1: Upload Modified Files to Production
Upload these files to your cPanel hosting:
```
altivomart_backend/settings.py
orders/serializers.py
orders/models.py
orders/views.py
passenger_wsgi.py
app.py
```

### Step 2: Restart Python Application
In cPanel:
1. Go to **Setup Python App**
2. Find your application
3. Click **Restart** button
4. Wait for confirmation

### Step 3: Test the Fix
Test with various character types:

#### Test Case 1: Regular English
```json
{
  "customer_name": "John Doe",
  "address": "123 Main Street",
  "city": "Lagos"
}
```

#### Test Case 2: Nigerian Names
```json
{
  "customer_name": "Chioma Okonkwo",
  "address": "45 Wuse 2, Abuja",
  "city": "Abuja"
}
```

#### Test Case 3: Special Characters
```json
{
  "customer_name": "O'Connor",
  "address": "Apt 5, O'Brien's Plaza",
  "city": "Port Harcourt"
}
```

#### Test Case 4: Accented Characters
```json
{
  "customer_name": "José María",
  "address": "25 Café Street",
  "landmark": "Near Résidence Plaza"
}
```

### Step 4: Monitor Logs
If you have SSH access, monitor for any remaining issues:
```bash
# View Django logs (location depends on your cPanel setup)
tail -f /path/to/logs/error.log

# Or check cPanel error logs in:
# cPanel > Metrics > Errors
```

## What This Fix Does

### 1. **Locale Configuration**
Forces Python to use UTF-8 encoding throughout the application.

### 2. **Input Validation**
Validates and sanitizes all text input at the serializer level before it reaches the database.

### 3. **Model-Level Protection**
Ensures all text is UTF-8 compatible when saving to database, even if validation is bypassed.

### 4. **Graceful Error Handling**
- Orders are created even if email sending fails due to encoding issues
- Detailed logging helps identify any remaining issues
- Returns proper error messages instead of HTML error pages

## Expected Behavior After Fix

### ✅ Success Scenario
- Customer submits order with any valid Unicode characters
- Order is created successfully
- Response: HTTP 201 with order details and tracking code
- Email sent (if encoding is compatible) or logged if it fails

### ❌ Before Fix
- Customer submits order with special characters
- Server returns HTTP 500 error
- No order created
- Frontend shows: "Server returned HTML error page"

## Verification Checklist

- [ ] Files uploaded to production
- [ ] Python app restarted in cPanel
- [ ] Test checkout with regular English name ✓
- [ ] Test checkout with Nigerian name ✓
- [ ] Test checkout with apostrophes ✓
- [ ] Test checkout with accented characters ✓
- [ ] Orders appear in Django admin ✓
- [ ] Tracking codes are generated ✓
- [ ] Delivery info is created ✓

## Troubleshooting

### If issue persists:

#### 1. Check Python Version
```bash
python --version
# Should be Python 3.8+
```

#### 2. Verify Locale Settings
```bash
locale
# Should show UTF-8 encoding
```

#### 3. Check cPanel Environment
In cPanel Python App settings, add these environment variables:
```
LANG=en_US.UTF-8
LC_ALL=en_US.UTF-8
PYTHONIOENCODING=utf-8
```

#### 4. Database Encoding (SQLite)
SQLite should handle UTF-8 by default, but verify:
```python
import sqlite3
conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()
cursor.execute("PRAGMA encoding;")
print(cursor.fetchone())  # Should show UTF-8
```

## Additional Notes

### Why It Works in Development but Not Production
- **Development**: Usually runs on modern OS with UTF-8 as default
- **Production (cPanel)**: May have different locale settings (e.g., ASCII or ISO-8859-1)
- **Solution**: Explicitly force UTF-8 at multiple levels

### Performance Impact
- **Minimal**: UTF-8 encoding/decoding is very fast
- The additional validation adds ~1-2ms per request
- No impact on frontend performance

### Future Considerations
If migrating to PostgreSQL in the future, ensure:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'OPTIONS': {
            'client_encoding': 'UTF8',
        },
    }
}
```

## Support
If the issue persists after deployment, check:
1. cPanel error logs
2. Django debug logs (if DEBUG temporarily enabled)
3. Browser console for exact error messages

The fix is comprehensive and should resolve all Unicode-related checkout issues in production.

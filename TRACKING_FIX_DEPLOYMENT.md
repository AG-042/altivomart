# Order Tracking Fix - Deployment Guide

## Problem Fixed
Customers received tracking codes (e.g., `U1SSJ8FGHY`) in their order confirmation emails, but the tracking page only accepted numeric Order IDs. This made it impossible for customers to track their orders using the code they received.

## What Was Fixed

### Backend (`orders/urls.py`)
- ✅ Added `track/<str:code>/` endpoint to accept tracking codes
- ✅ Uses existing `track_by_code` view function
- ✅ Backward compatible - still accepts numeric Order IDs

### Frontend (`order-tracking.tsx`)
- ✅ Input now accepts both tracking codes and order IDs
- ✅ Automatically detects if input is a code (string) or ID (number)
- ✅ Updated label: "Tracking Code or Order ID"
- ✅ Updated placeholder: "e.g., U1SSJ8FGHY or 14"
- ✅ Smart routing to appropriate endpoint

## How It Works Now

### Customer Journey:
1. Customer places order
2. Receives email with tracking code: `U1SSJ8FGHY`
3. Goes to tracking page
4. Enters `U1SSJ8FGHY` in the input
5. ✅ System detects it's a code (not a number)
6. ✅ Calls `/api/orders/track/U1SSJ8FGHY/`
7. ✅ Backend finds order and returns full details
8. ✅ Customer sees order status and delivery info

### For Admin/Testing (Order ID):
1. Enter numeric ID like `14`
2. System detects it's an ID
3. Calls `/api/orders/14/`
4. Returns order details

## Deployment Steps on Production

### 1. Connect to Server
```bash
ssh fgprhjmg@server113.web-hosting.com
```

### 2. Navigate to Project
```bash
cd /home/fgprhjmg/altivomart
source /home/fgprhjmg/virtualenv/altivomart/3.10/bin/activate
```

### 3. Pull Latest Changes
```bash
git stash  # Save any local changes
git pull origin main
```

You should see:
```
Updating 61c1707..ee73264
Fast-forward
 orders/urls.py                                      | 1 +
 altivomart_frontend/src/components/order-tracking.tsx | 69 +++++++++++++++------
 2 files changed, 47 insertions(+), 22 deletions(-)
```

### 4. Restart Application
```bash
touch tmp/restart.txt
```

Or via cPanel:
1. Go to **Setup Python App**
2. Find `altivomart`
3. Click **Restart**

## Testing After Deployment

### Test 1: Track with Tracking Code
```
1. Go to https://altivomart.com/track
2. Enter: U1SSJ8FGHY (or any tracking code from a real order)
3. Click "Track Order"
4. ✅ Should show order details and delivery status
```

### Test 2: Track with Order ID (backward compatibility)
```
1. Go to https://altivomart.com/track
2. Enter: 14 (or any numeric order ID)
3. Click "Track Order"
4. ✅ Should show order details and delivery status
```

### Test 3: Track from Email Link
```
1. Click tracking link in order confirmation email
2. Should auto-populate tracking code
3. ✅ Should automatically load order details
```

## API Endpoints Now Available

### Public Endpoints:
- `POST /api/orders/create/` - Create new order
- `GET /api/orders/<id>/` - Get order by ID
- `GET /api/orders/<id>/track/` - Track delivery by Order ID
- `GET /api/orders/track/<code>/` ⭐ NEW - Track by tracking code

### Example Usage:
```bash
# Track by code
curl https://altivomart.com/api/orders/track/U1SSJ8FGHY/

# Returns:
{
  "order_id": 14,
  "tracking_code": "U1SSJ8FGHY",
  "customer_name": "Chiagozie",
  "status": "pending",
  "delivery_status": "assigned",
  "estimated_delivery": "2025-10-16",
  "delivery_notes": "...",
  ...
}
```

## What Customers Will Notice

### Before Fix:
- ❌ Email says "Track with code: U1SSJ8FGHY"
- ❌ Tracking page says "Enter Order ID"
- ❌ Customer confused - can't use the code
- ❌ Has to contact support to get Order ID

### After Fix:
- ✅ Email says "Track with code: U1SSJ8FGHY"
- ✅ Tracking page says "Tracking Code or Order ID"
- ✅ Customer enters U1SSJ8FGHY
- ✅ Instantly sees their order status
- ✅ No support needed

## Files Changed

### Backend:
- `orders/urls.py` - Added tracking code endpoint

### Frontend:
- `altivomart_frontend/src/components/order-tracking.tsx` - Smart detection logic

## Verification Checklist

After deployment, verify:

- [ ] Pull successful on production server
- [ ] Application restarted
- [ ] Can track using tracking code (e.g., U1SSJ8FGHY)
- [ ] Can still track using order ID (e.g., 14)
- [ ] Email tracking links work
- [ ] No errors in server logs
- [ ] Both endpoints return correct data

## Rollback Plan (if needed)

If something goes wrong:

```bash
cd /home/fgprhjmg/altivomart
git log -2  # See last 2 commits
git revert HEAD  # Undo last commit
touch tmp/restart.txt  # Restart app
```

## Support

If tracking still doesn't work after deployment:

1. Check server logs:
   ```bash
   tail -f /home/fgprhjmg/altivomart/stderr.log
   ```

2. Test the API directly:
   ```bash
   curl https://altivomart.com/api/orders/track/U1SSJ8FGHY/
   ```

3. Check for orders with tracking codes:
   ```bash
   python manage.py shell
   >>> from orders.models import Order
   >>> Order.objects.exclude(tracking_code__isnull=True).values('id', 'tracking_code')[:5]
   ```

## Additional Notes

- **No database changes** - This is purely code/routing changes
- **No migrations needed** - Tracking codes already exist in database
- **100% backward compatible** - Old order ID tracking still works
- **Immediate effect** - Works as soon as app is restarted

---

**Commit Hash:** `ee73264`  
**Files Changed:** 2  
**Lines Changed:** +47, -22  
**Deploy Time:** ~2 minutes  
**Downtime:** None (just restart)

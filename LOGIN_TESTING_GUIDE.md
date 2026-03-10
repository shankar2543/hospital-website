# Login/Authentication Testing Guide

## What Changed

1. **Enhanced Logging**: Both login pages (`/` and `/login`) now have detailed console logs showing:
   - When login attempt starts
   - Parse initialization status
   - Login success with user ID, email, name, and role
   - localStorage being set with user data
   - Redirect timing

2. **Success Message**: Users now see "Login successful! Redirecting to dashboard..." before being redirected

3. **Back4App Validation**: Parse.User.logIn() properly validates credentials against Back4App and returns user object if valid

4. **Improved Timeouts**: 1-second delay before redirect to ensure all operations complete

5. **Debug Page**: New `/debug` page shows:
   - Current Parse user session
   - localStorage data
   - Parse configuration status

## Testing Steps

### 1. Verify Signup Still Works
- Go to `http://localhost:3000/signup`
- Fill in form:
  - Name: Test User
  - Gender: Any
  - Email: test@example.com
  - Password: TestPass123
- Should see "Account created successfully!"
- User is now in Back4App

### 2. Test Login (Home Page)
- Go to `http://localhost:3000` (or `http://localhost:3000/login`)
- Enter credentials from signup:
  - Email: test@example.com
  - Password: TestPass123
- Should see:
  1. "Signing in..." button (loading state)
  2. "Login successful! Redirecting to dashboard..." message
  3. Redirect to `/admin/dashboard` (always redirects to admin)

### 3. Check Browser Console
- Press F12 to open Developer Tools
- Go to Console tab
- Look for logs:
  ```
  === LOGIN ATTEMPT ===
  Email: test@example.com
  Parse initialized: YES
  Back4App server: https://parseapi.back4app.com
  Calling Parse.User.logIn...
  === LOGIN SUCCESS ===
  User ID: [some_id]
  Email: test@example.com
  Name: Test User
  Role: patient
  User data stored in localStorage
  Redirecting to admin dashboard...
  ```

### 4. Verify localStorage After Login
- In browser Console, type: `localStorage`
- Should see:
  - `currentUser`: {"id":"...","email":"...","name":"...","role":"..."}
  - `userRole`: "patient"
  - `userName`: "Test User"
  - `userEmail`: "test@example.com"

### 5. Check Debug Page
- Go to `http://localhost:3000/debug`
- Should show:
  - **Parse Current User**: Your user object (not "No Parse user found")
  - **Parse User Attributes**: ID, Email, Name, Role
  - **LocalStorage Data**: All user data from localStorage
  - **Parse Configuration**: App ID and Server URL

### 6. Test Invalid Login
- Go to `http://localhost:3000`
- Enter wrong email or password
- Should see error: "Invalid credentials. Please check your email and password."
- Check console for detailed error logs

## Common Issues & Solutions

### Issue: "Network error" message
**Solution**: 
- Check internet connection
- Verify Back4App credentials in `.env.local`
- Check if Back4App service is up

### Issue: "User not found" message
**Solution**:
- Make sure you signed up first at `/signup`
- Check that email matches exactly (including case)

### Issue: Not redirecting to dashboard
**Solution**:
- Check browser console (F12) for error logs
- Visit `/debug` page to see if user is logged in
- Clear localStorage and try again: `localStorage.clear()`

### Issue: Multiple users registered during testing
**Solution**:
- Use different email addresses for each test
- Or use Back4App dashboard to delete test users

## Back4App Validation Flow

1. User enters email and password
2. Parse.User.logIn(email, password) calls Back4App API
3. Back4App validates credentials against stored user records
4. If valid: Returns user object → stored in localStorage → redirect to dashboard
5. If invalid: Throws error → caught and displayed to user

## Files Modified

- `/pages/index.js` - Home login page with enhanced logging
- `/pages/login.js` - Alternative login page with role-based redirect
- `/pages/debug.js` - NEW - Debug page for session verification
- `/lib/parseConfig.js` - Parse initialization (no changes needed)
- `.env.local` - Back4App credentials (already configured)

## Next Steps if Still Not Working

1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Try logging in
4. Look for the ParseAPI request to `parseapi.back4app.com`
5. Check if it returns 200 (success) or 401 (unauthorized)
6. Share the error details from console

If Parse.User.logIn() is failing, it will show:
- `Error code: 101` → Invalid login credentials (user not found or wrong password)
- `Error code: $other` → Network or server error

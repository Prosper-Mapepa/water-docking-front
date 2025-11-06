# Backend Environment Variables Setup

## Required Environment Variables for Railway/Production

Based on the backend requirements, you need the following environment variables:

### Database Configuration

**Option 1: Using individual database variables (recommended)**
```
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
DB_DATABASE=water_docking
```

**Option 2: Using DATABASE_URL connection string**
If Railway provides `DATABASE_URL`, make sure it's in PostgreSQL format:
```
DATABASE_URL=postgresql://username:password@host:port/database
```

### Application Configuration

```
PORT=3001
NODE_ENV=production
```

### Authentication

```
JWT_SECRET=your-secure-random-secret-key-here
```

### Database Migrations (CRITICAL for creating tables)

```
RUN_MIGRATIONS=true
```

**Important:** If `RUN_MIGRATIONS` is not set to `true` (or `1`), the database tables will NOT be created automatically.

### CORS Configuration (CRITICAL for frontend to work)

**⚠️ IMPORTANT:** The backend MUST be configured to allow CORS requests from your Netlify frontend domain.

**Option 1: Environment Variable (if backend supports it)**
```
FRONTEND_URL=https://water-docking-app.netlify.app
CORS_ORIGIN=https://water-docking-app.netlify.app
# Or for multiple origins:
ALLOWED_ORIGINS=https://water-docking-app.netlify.app,http://localhost:3000
```

**Option 2: Backend Code Configuration**
If your backend uses NestJS, you need to configure CORS in the main application file (usually `main.ts`):

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'https://water-docking-app.netlify.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

**For development, also allow localhost:**
```typescript
const allowedOrigins = [
  'https://water-docking-app.netlify.app',
  'http://localhost:3000',
  'http://localhost:3001',
];

app.enableCors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### Optional (if using file uploads)

```
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

## Quick Checklist

Make sure you have all of these set in Railway:

- ✅ `DATABASE_URL` OR individual `DB_*` variables (DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE)
- ✅ `JWT_SECRET` (a secure random string)
- ✅ `RUN_MIGRATIONS=true` ⚠️ **THIS IS CRITICAL - Without this, tables won't be created!**
- ✅ `PORT=3001` (or whatever port Railway assigns)
- ✅ `NODE_ENV=production`
- ✅ **CORS Configuration** ⚠️ **CRITICAL - Frontend won't work without this!**
  - Either set `FRONTEND_URL` or `CORS_ORIGIN` environment variable
  - OR configure CORS in backend code to allow `https://water-docking-app.netlify.app`

## Troubleshooting "No Tables" Issue

1. **Check RUN_MIGRATIONS**: Set it to `true` or `1`
2. **Verify DATABASE_URL format**: Should be `postgresql://user:password@host:port/dbname`
3. **Check database connection**: Ensure the database credentials are correct
4. **Restart the backend**: After setting `RUN_MIGRATIONS=true`, restart your Railway service

## Testing Database Connection

Once variables are set, check the backend logs in Railway to see if:
- Database connection is successful
- Migrations are running
- Tables are being created

## Troubleshooting CORS Errors

**Error:** `Access to fetch at '...' from origin 'https://water-docking-app.netlify.app' has been blocked by CORS policy`

**Solution:**
1. **Check CORS configuration in backend:**
   - Verify that `https://water-docking-app.netlify.app` is in the allowed origins list
   - Make sure CORS is enabled in the backend application

2. **Check environment variables:**
   - If using `FRONTEND_URL` or `CORS_ORIGIN`, ensure it's set to `https://water-docking-app.netlify.app`
   - Restart the backend service after adding/updating CORS variables

3. **Verify backend code:**
   - Check `main.ts` (or equivalent) in your backend
   - Ensure `app.enableCors()` is called with the correct configuration
   - Make sure the Netlify URL is included in the allowed origins

4. **Test CORS:**
   - Open browser developer tools on your Netlify site
   - Try making a request to the backend
   - Check the Network tab for CORS-related headers in the response
   - Look for `Access-Control-Allow-Origin` header in the response

5. **Common CORS requirements:**
   - `Access-Control-Allow-Origin` header must include your frontend URL
   - `Access-Control-Allow-Credentials: true` if using cookies/auth tokens
   - `Access-Control-Allow-Methods` should include the HTTP methods you use
   - `Access-Control-Allow-Headers` should include `Content-Type` and `Authorization`

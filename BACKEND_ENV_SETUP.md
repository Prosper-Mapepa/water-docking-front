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

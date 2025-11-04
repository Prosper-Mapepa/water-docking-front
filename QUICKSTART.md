# 🚀 Quick Start Guide

This guide will help you get the Water Docking Management System up and running in minutes.

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js v18+ installed (`node --version`)
- ✅ PostgreSQL v14+ installed and running
- ✅ npm or yarn package manager

## Step-by-Step Setup

### 1. Database Setup (2 minutes)

```bash
# Start PostgreSQL service (if not running)
# macOS:
brew services start postgresql

# Create database
createdb water_docking

# Verify database is created
psql -l | grep water_docking
```

### 2. Backend Setup (3 minutes)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=water_docking

PORT=3001
NODE_ENV=development

MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
EOF

# Important: Update the DB_PASSWORD in .env with your actual PostgreSQL password

# Start the backend server
npm run start:dev
```

**Expected Output:**
```
🚀 Application is running on: http://localhost:3001
📚 Swagger documentation: http://localhost:3001/api
```

### 3. Frontend Setup (2 minutes)

Open a **new terminal window** and run:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local

# Start the frontend server
npm run dev
```

**Expected Output:**
```
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

### 4. Access the Application

Open your browser and navigate to:
- **Frontend Application**: http://localhost:3000
- **API Documentation**: http://localhost:3001/api

## 🎯 First Steps in the Application

### 1. Create Your First Customer
1. Click on "Customers" in the sidebar
2. Click "Add Customer" button
3. Fill in customer details:
   - First Name: John
   - Last Name: Doe
   - Email: john.doe@example.com
   - Phone: +1234567890
   - Membership Tier: BASIC
4. Click "Create"

### 2. Add an Asset
1. Click on "Assets" in the sidebar
2. Click "Add Asset"
3. Fill in asset details:
   - Name: Main Dock A
   - Type: DOCK
   - Identifier: DOCK-001
   - Location: North Marina
   - Status: OPERATIONAL
4. Click "Create"

### 3. Schedule Maintenance
1. Click on "Maintenance" in the sidebar
2. Click "Schedule Maintenance"
3. Select the asset you created
4. Fill in maintenance details:
   - Type: ROUTINE
   - Title: Quarterly Inspection
   - Description: Inspect all cleats and bolts
   - Scheduled Date: Select a future date
5. Upload photos (optional)
6. Click "Create"

### 4. View Analytics
1. Click on "Analytics" in the sidebar
2. View:
   - Revenue overview
   - Customer insights
   - Membership distribution
   - Maintenance spending trends

## 🔧 Troubleshooting

### Backend Won't Start

**Issue**: Database connection error
```bash
# Solution: Check if PostgreSQL is running
brew services list | grep postgresql

# Restart PostgreSQL if needed
brew services restart postgresql

# Verify credentials in backend/.env
```

**Issue**: Port 3001 already in use
```bash
# Solution: Find and kill the process
lsof -ti:3001 | xargs kill -9

# Or change PORT in backend/.env to a different port
```

### Frontend Won't Start

**Issue**: Port 3000 already in use
```bash
# Solution: The system will automatically try port 3001
# Or manually specify a different port:
PORT=3002 npm run dev
```

**Issue**: Cannot connect to backend API
```bash
# Solution: Verify backend is running and check .env.local
cat frontend/.env.local
# Should show: NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Database Issues

**Issue**: Database doesn't exist
```bash
# Create the database
createdb water_docking

# If you get permission errors:
createdb -U postgres water_docking
```

**Issue**: Can't connect to database
```bash
# Check PostgreSQL is running
pg_isready

# Connect to PostgreSQL to verify credentials
psql -U postgres
```

## 📊 Sample Data

To quickly test the system, you can use the Swagger UI at http://localhost:3001/api:

1. Expand "Customers" section
2. Try out "POST /customers"
3. Use this sample data:

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+1987654321",
  "membershipTier": "SILVER",
  "preferences": {
    "dockSize": "large",
    "powerRequirements": "50A"
  }
}
```

## 🎓 Next Steps

1. **Explore Features**: Try creating visits, service requests, and feedback
2. **Upload Photos**: Test the photo upload feature in maintenance records
3. **Check Analytics**: Add more data and see the analytics update in real-time
4. **Read Documentation**: Check out the Swagger API docs for all available endpoints
5. **Customize**: Modify the code to fit your specific business needs

## 📞 Getting Help

- Check the main README.md for detailed documentation
- Review API documentation at http://localhost:3001/api
- Check backend logs in the terminal for error messages
- Review frontend console in browser DevTools

## 🎉 Success!

If you can see the dashboard with stats and navigate through different pages, you're all set! The system is ready to manage your water docking business.

Happy docking! ⚓











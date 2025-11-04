# Water Docking Management System - Frontend

A modern, responsive Next.js frontend for the Water Docking Management System with comprehensive CRM and maintenance management features.

## Features

### Dashboard
- Real-time business overview with key metrics
- Active visits and dock occupancy tracking
- Quick action buttons for common tasks
- Visual statistics and charts

### Customer Relationship Management (CRM)
- **Customer Database**: Complete customer profiles with contact information
- **Membership Tiers**: BASIC, SILVER, GOLD, PLATINUM with automatic upgrades
- **Loyalty Points**: Track and reward customer loyalty
- **Visit History**: Complete history of customer visits and services used
- **Service Requests**: Track and manage all customer service requests
- **Feedback Management**: Collect, review, and analyze customer feedback

### Maintenance & Asset Management
- **Asset Tracking**: Manage docks, power stations, and equipment
- **Maintenance Scheduling**: Schedule routine, preventive, and emergency maintenance
- **Photo Upload**: Document maintenance issues with photo uploads
- **Work Tracking**: Record work performed, parts replaced, and labor hours
- **Cost Tracking**: Monitor actual vs. estimated costs
- **Status Management**: Track maintenance from scheduled to completed

### Analytics & Reporting
- Revenue analytics and trends
- Customer insights and top customers
- Membership distribution visualizations
- Maintenance cost tracking and predictions
- Interactive charts and graphs

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **Forms**: React Hook Form
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## Installation

```bash
# Install dependencies
npm install

# Set environment variables
# Create a .env.local file with:
# NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Running the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── customers/       # Customer management
│   ├── visits/          # Visit tracking
│   ├── service-requests/# Service requests
│   ├── feedback/        # Feedback management
│   ├── assets/          # Asset management
│   ├── maintenance/     # Maintenance management
│   ├── analytics/       # Analytics and reports
│   └── page.tsx         # Dashboard
├── components/          # React components
│   ├── Layout/          # Layout components
│   ├── Customers/       # Customer-related components
│   └── Maintenance/     # Maintenance-related components
├── lib/                 # Utility functions
│   ├── api.ts          # API client and functions
│   └── utils.ts        # Helper functions
└── globals.css         # Global styles
```

## Key Features

### Modern UI/UX
- Clean, professional design with Tailwind CSS
- Responsive layout that works on all devices
- Intuitive navigation with sidebar menu
- Real-time notifications with toast messages

### Data Management
- Create, read, update, and delete operations for all entities
- Search and filter functionality
- Modal forms for data entry
- Table views with sorting and pagination

### File Upload
- Multi-photo upload for maintenance records
- Preview uploaded images
- Remove individual photos
- Automatic file compression and optimization

### Analytics
- Interactive charts and visualizations
- Revenue tracking and analysis
- Customer insights and behavior patterns
- Maintenance cost predictions

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## API Integration

The frontend communicates with the NestJS backend API. Make sure the backend is running before starting the frontend application.

All API calls are centralized in `src/lib/api.ts` for easy maintenance and updates.

## Development

### Adding New Pages
1. Create a new folder in `src/app/`
2. Add a `page.tsx` file
3. Update the navigation in `src/components/Layout/Sidebar.tsx`

### Adding New Components
1. Create component in appropriate folder under `src/components/`
2. Export from component file
3. Import and use in pages

### Styling
- Use Tailwind CSS utility classes
- Custom components defined in `globals.css`
- Maintain consistent spacing and colors

## Deployment to Netlify

### Prerequisites
1. A GitHub/GitLab/Bitbucket repository with your code
2. A Netlify account (sign up at https://app.netlify.com)
3. Your backend API deployed and accessible via a live URL

### Step 1: Install Netlify Next.js Plugin

The project includes the Netlify Next.js plugin in the configuration. Make sure it's installed:

```bash
npm install --save-dev @netlify/plugin-nextjs
```

### Step 2: Deploy to Netlify

1. **Connect your repository to Netlify:**
   - Log in to your Netlify account
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider and select this repository

2. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next` (automatically handled by the plugin)

3. **Set environment variables:**
   - Go to Site settings → Environment variables
   - Add the following variable:
     - `NEXT_PUBLIC_API_URL` = `https://water-docking-api-production.up.railway.app`

4. **Deploy:**
   - Click "Deploy site"
   - Netlify will build and deploy your application
   - Once deployed, you'll receive a URL like `https://your-site.netlify.app`

### Step 3: Update Backend URL

**Important:** The backend URL is configured. Make sure the environment variable is set in Netlify:

1. Go to Site settings → Environment variables
2. Set `NEXT_PUBLIC_API_URL` = `https://water-docking-api-production.up.railway.app`
3. Trigger a new deployment (Netlify will automatically redeploy on git push, or you can manually trigger a redeploy)

### Environment Variables for Production

Set the following in Netlify's environment variables:

```env
NEXT_PUBLIC_API_URL=https://water-docking-api-production.up.railway.app
```

### Continuous Deployment

Netlify will automatically deploy your site when you push to your main branch. After setting the environment variable with your backend URL, all subsequent deployments will use the production API.

## License

MIT











# Getting Started with Crypto Beats

## Quick Start Guide

This guide will help you get the Crypto Beats platform up and running locally.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- PostgreSQL database (or use Neon for serverless)
- Git

## Step 1: Clone & Install

\`\`\`bash
# Install backend dependencies
npm install

# Install Prisma CLI
npm install -D prisma @prisma/cli
\`\`\`

## Step 2: Set Up Database

1. **Create a PostgreSQL database** on Neon or locally:
   \`\`\`bash
   # If using Neon, get your connection string from dashboard
   \`\`\`

2. **Configure environment variables:**
   \`\`\`bash
   cp .env.example .env
   \`\`\`

3. **Update `.env` with your database URL:**
   \`\`\`
   DATABASE_URL=postgresql://user:password@localhost:5432/crypto_beats
   JWT_SECRET=dev-secret-key-change-in-production
   \`\`\`

4. **Run database migrations:**
   \`\`\`bash
   npm run prisma:migrate
   # or
   npx prisma migrate dev --name init
   \`\`\`

5. **Generate Prisma client:**
   \`\`\`bash
   npm run prisma:generate
   \`\`\`

## Step 3: Start Backend

\`\`\`bash
npm run dev
\`\`\`

The API server will run at `http://localhost:3000`

Test it:
\`\`\`bash
curl http://localhost:3000/api/tracks
\`\`\`

## Step 4: Set Up Expo Frontend

\`\`\`bash
cd expo
npm install

# Create .env.local (if needed)
# EXPO_PUBLIC_API_URL=http://localhost:3000/api
\`\`\`

## Step 5: Run Mobile App

\`\`\`bash
# Start Expo
npm start

# In terminal:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator  
# - Press 'w' for web version
\`\`\`

## Testing the App

### 1. Create an Account
- Open the app and select "Sign Up"
- Choose "Listener" or "Artist"
- Fill in email, username, password
- Tap "Sign Up"

### 2. Browse Music (Listener)
- After login, view music feed
- Filter by genre
- Tap play button to view track details

### 3. Upload Music (Artist)
- Switch to Artist mode
- Go to Artist tab
- Tap "Upload New Track"
- Fill in title and genre
- Track appears in your uploads

### 4. Social Features
- Like/favorite tracks
- Comment on tracks
- Follow other artists

## API Testing with cURL

### Sign Up
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "userType": "LISTENER"
  }'
\`\`\`

### Login
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
\`\`\`

### Get Tracks
\`\`\`bash
curl http://localhost:3000/api/tracks
\`\`\`

### Upload Track (replace TOKEN with your JWT)
\`\`\`bash
curl -X POST http://localhost:3000/api/tracks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "My Track",
    "description": "My first track",
    "audioUrl": "https://...",
    "coverUrl": "https://...",
    "duration": 240,
    "genre": "Electronic"
  }'
\`\`\`

## Troubleshooting

### Database Connection Error
\`\`\`
error: connect ECONNREFUSED 127.0.0.1:5432
\`\`\`
**Solution:** Make sure PostgreSQL is running. For Neon, verify DATABASE_URL is correct.

### Port 3000 Already in Use
\`\`\`bash
# Find process on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
\`\`\`

### Expo Connection Issues
- Make sure backend is running
- Check `EXPO_PUBLIC_API_URL` in `.env.local`
- Use your machine's IP instead of localhost on physical device

### Database Migration Errors
\`\`\`bash
# Reset (caution - deletes data!)
npx prisma migrate reset

# Check schema
npx prisma db push
\`\`\`

## File Structure

\`\`\`
/
├── app/
│   ├── api/              # Next.js API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── tracks/       # Track management
│   ├── page.tsx          # Main page
│   └── layout.tsx        # Root layout
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # DB migrations
├── lib/
│   ├── auth.ts           # Auth utilities
│   └── middleware.ts     # Request middleware
├── expo/
│   ├── app.tsx           # Expo entry point
│   ├── screens/          # App screens
│   ├── utils/            # Utilities
│   └── types/            # TypeScript types
└── scripts/
    └── init-db.sql       # Database initialization
\`\`\`

## Next Steps

1. **Implement Web Dashboard** - Create a Next.js admin/artist dashboard
2. **Add Stripe Integration** - Set up payments
3. **Deploy to Production**:
   - Backend: `vercel deploy`
   - Mobile: `eas build && eas submit`
4. **Add More Features**:
   - Real-time notifications
   - Playlists
   - Recommendations
   - Livestreaming

## Support

For issues, check:
- Database connectivity
- Environment variables
- API endpoint URLs
- Network connectivity (for mobile)
- CORS settings

See README.md for full documentation.

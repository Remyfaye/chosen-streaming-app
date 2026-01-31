# Crypto Beats - Music Streaming Platform

A full-stack music streaming and social media platform built with Next.js backend and React Native/Expo mobile frontend. Features crypto-themed design, artist monetization, and music discovery.

## Architecture

### Backend (Next.js)
- RESTful API with authentication
- PostgreSQL database with Prisma ORM
- User management (Listeners & Artists)
- Track upload and streaming
- Social features (favorites, comments, follows)
- Payment integration ready

### Frontend (React Native/Expo)
- iOS and Android native apps
- Authentication screens
- Music discovery and playback
- Artist dashboard
- Social interaction

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon)
- Environment variables configured

### Backend Setup

1. **Install dependencies:**
\`\`\`bash
npm install
npm install -D prisma @prisma/cli
\`\`\`

2. **Set up environment variables (.env):**
\`\`\`
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your-secret-key-here
NEXT_PUBLIC_API_URL=http://localhost:3000
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
\`\`\`

3. **Initialize database:**
\`\`\`bash
npx prisma migrate dev --name init
# This runs the migration from scripts/init-db.sql
\`\`\`

4. **Generate Prisma client:**
\`\`\`bash
npm run prisma:generate
\`\`\`

5. **Start development server:**
\`\`\`bash
npm run dev
\`\`\`

The API will be available at `http://localhost:3000/api`

### Mobile App Setup (Expo)

1. **Navigate to Expo folder:**
\`\`\`bash
cd expo
\`\`\`

2. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

3. **Configure API URL (.env.local):**
\`\`\`
EXPO_PUBLIC_API_URL=http://your-backend-url/api
\`\`\`

4. **Start Expo:**
\`\`\`bash
npm start
\`\`\`

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user

### Tracks
- `GET /api/tracks` - Discover tracks (with optional genre filter)
- `POST /api/tracks` - Upload track (artist only)
- `GET /api/tracks/[id]` - Get track details
- `DELETE /api/tracks/[id]` - Delete track

### Users
- `GET /api/users/[username]` - Get user profile
- `PUT /api/users/[username]` - Update profile

### Social
- `POST /api/tracks/[trackId]/favorite` - Add to favorites
- `DELETE /api/tracks/[trackId]/favorite` - Remove from favorites
- `POST /api/tracks/[trackId]/comments` - Post comment

## Database Schema

### Core Tables
- **User**: Account information
- **ArtistProfile**: Artist-specific data
- **ListenerProfile**: Listener premium status
- **Track**: Music files and metadata
- **Favorite**: Liked tracks
- **Play**: Stream tracking
- **Comment**: Social interaction
- **Follow**: Follow relationships
- **Earning**: Artist payouts

## Authentication

Uses JWT tokens with 30-day expiration. Include token in Authorization header:
\`\`\`
Authorization: Bearer {token}
\`\`\`

## File Storage

Audio files stored via Vercel Blob:
- Support for MP3, WAV, FLAC formats
- Cover images stored as JPG/PNG
- Public URLs for streaming

## Key Features

✨ **User Management**
- Listener and Artist accounts
- Profile customization
- Follow system

🎵 **Music Platform**
- Track upload and metadata
- Genre-based discovery
- Stream counting

💰 **Monetization**
- Artist earnings tracking
- Stream-based payouts
- Premium subscriptions (Stripe ready)

👥 **Social Features**
- Comments on tracks
- Favorite/like system
- Following artists

## Deployment

### Backend to Vercel
\`\`\`bash
vercel deploy
\`\`\`

### Mobile to App Store/Play Store
\`\`\`bash
eas build --platform ios
eas build --platform android
eas submit --platform ios
eas submit --platform android
\`\`\`

## Development Notes

- All API routes require proper error handling
- Implement rate limiting in production
- Use environment variables for sensitive data
- Enable CORS for mobile apps
- Test authentication thoroughly

## Future Enhancements

- Real-time notifications
- Algorithmic recommendations
- Playlist creation
- Spotify/Apple Music integration
- Advanced analytics for artists
- Livestream capabilities
- Web player

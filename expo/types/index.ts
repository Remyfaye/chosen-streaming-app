// User types
export interface User {
  id: string
  email: string
  username: string
  name?: string
  avatar?: string
  bio?: string
  userType: 'LISTENER' | 'ARTIST' | 'ADMIN'
  createdAt: string
}

export interface ArtistProfile {
  id: string
  userId: string
  totalStreams: number
  totalEarnings: number
  isVerified: boolean
  verificationUrl?: string
}

export interface ListenerProfile {
  id: string
  userId: string
  isPremium: boolean
  premiumUntil?: string
}

// Track types
export interface Track {
  id: string
  title: string
  description?: string
  artistId: string
  artist: {
    id: string
    username: string
    avatar?: string
    name?: string
  }
  audioUrl: string
  coverUrl?: string
  duration: number
  genre: string
  streams: number
  createdAt: string
  updatedAt: string
}

export interface TrackDetail extends Track {
  comments: Comment[]
  _count: {
    comments: number
    favorites: number
    plays: number
  }
}

// Comment types
export interface Comment {
  id: string
  content: string
  userId: string
  trackId: string
  user: {
    id: string
    username: string
    avatar?: string
  }
  createdAt: string
}

// Interaction types
export interface Favorite {
  id: string
  userId: string
  trackId: string
  createdAt: string
}

export interface Play {
  id: string
  userId: string
  trackId: string
  duration: number
  createdAt: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}

// Auth types
export interface AuthToken {
  token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  username: string
  password: string
  userType: 'LISTENER' | 'ARTIST'
}

// Stats types
export interface ArtistStats {
  totalUploads: number
  totalStreams: number
  totalEarnings: number
  topTracks: Track[]
  followers: number
}

export interface ListenerStats {
  totalFavorites: number
  totalPlays: number
  totalArtistsFollowed: number
  premiumStatus: boolean
}

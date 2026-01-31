# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a Bearer token:
```
Authorization: Bearer {token}
```

---

## Auth Endpoints

### Sign Up
```
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "userType": "LISTENER" | "ARTIST"
}

Response: 201
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "username",
    "userType": "LISTENER"
  }
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "username",
    "userType": "LISTENER",
    "avatar": "url_or_null",
    "name": "full_name_or_null"
  }
}
```

---

## Track Endpoints

### Get Tracks (Discovery)
```
GET /tracks?genre=Hip-Hop&limit=20&offset=0

Response: 200
{
  "tracks": [
    {
      "id": "track_id",
      "title": "Track Title",
      "description": "Track description",
      "duration": 240,
      "genre": "Hip-Hop",
      "streams": 1000,
      "audioUrl": "https://...",
      "coverUrl": "https://...",
      "artist": {
        "id": "artist_id",
        "username": "artist_name",
        "avatar": "url_or_null",
        "name": "Artist Full Name"
      },
      "createdAt": "2024-01-31T..."
    }
  ],
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

### Upload Track (Protected)
```
POST /tracks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My Track",
  "description": "Track description",
  "audioUrl": "https://blob.vercelusercontent.com/...",
  "coverUrl": "https://blob.vercelusercontent.com/...",
  "duration": 240,
  "genre": "Electronic"
}

Response: 201
{
  "id": "track_id",
  "title": "My Track",
  "description": "Track description",
  "duration": 240,
  "genre": "Electronic",
  "streams": 0,
  "artist": {
    "id": "artist_id",
    "username": "artist_name",
    "avatar": "url_or_null"
  }
}
```

### Get Track Details
```
GET /tracks/{id}

Response: 200
{
  "id": "track_id",
  "title": "Track Title",
  "duration": 240,
  "genre": "Hip-Hop",
  "streams": 1000,
  "audioUrl": "https://...",
  "coverUrl": "https://...",
  "artist": {
    "id": "artist_id",
    "username": "artist_name",
    "avatar": "url_or_null",
    "name": "Artist Full Name",
    "bio": "About artist"
  },
  "comments": [
    {
      "id": "comment_id",
      "content": "Great track!",
      "user": {
        "id": "user_id",
        "username": "listener",
        "avatar": "url_or_null"
      },
      "createdAt": "2024-01-31T..."
    }
  ],
  "_count": {
    "comments": 5,
    "favorites": 42,
    "plays": 1000
  }
}
```

### Delete Track (Protected)
```
DELETE /tracks/{id}
Authorization: Bearer {token}

Response: 200
{
  "message": "Track deleted"
}
```

---

## User Endpoints

### Get User Profile
```
GET /users/{username}

Response: 200
{
  "id": "user_id",
  "username": "username",
  "name": "Full Name",
  "avatar": "url_or_null",
  "bio": "User bio",
  "userType": "ARTIST",
  "createdAt": "2024-01-31T...",
  "_count": {
    "followers": 150,
    "following": 50,
    "uploads": 10
  },
  "artistProfile": {
    "totalStreams": 50000,
    "totalEarnings": 250.00,
    "isVerified": true
  }
}
```

### Update Profile (Protected)
```
PUT /users/{username}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Full Name",
  "bio": "Updated bio",
  "avatar": "https://..."
}

Response: 200
{
  "id": "user_id",
  "username": "username",
  "name": "New Full Name",
  "avatar": "https://...",
  "bio": "Updated bio"
}
```

---

## Interaction Endpoints

### Add to Favorites (Protected)
```
POST /tracks/{trackId}/favorite
Authorization: Bearer {token}

Response: 201
{
  "id": "favorite_id",
  "userId": "user_id",
  "trackId": "track_id",
  "createdAt": "2024-01-31T..."
}
```

### Remove from Favorites (Protected)
```
DELETE /tracks/{trackId}/favorite
Authorization: Bearer {token}

Response: 200
{
  "message": "Removed from favorites"
}
```

### Post Comment (Protected)
```
POST /tracks/{trackId}/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Great track!"
}

Response: 201
{
  "id": "comment_id",
  "content": "Great track!",
  "userId": "user_id",
  "trackId": "track_id",
  "user": {
    "id": "user_id",
    "username": "listener",
    "avatar": "url_or_null"
  },
  "createdAt": "2024-01-31T..."
}
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 - Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 403 - Forbidden
```json
{
  "error": "Unauthorized"
}
```

### 404 - Not Found
```json
{
  "error": "Track not found"
}
```

### 500 - Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Query Parameters

### Tracks Discovery
- `genre` (string) - Filter by genre
- `limit` (number, default: 20) - Results per page
- `offset` (number, default: 0) - Pagination offset

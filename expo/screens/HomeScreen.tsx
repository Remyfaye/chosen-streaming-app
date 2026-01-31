'use client';

import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api'

interface Track {
  id: string
  title: string
  artist: {
    username: string
    avatar?: string
  }
  coverUrl?: string
  genre: string
  duration: number
  streams: number
}

export default function HomeScreen({ token, user }: { token: string; user: any }) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

  const genres = ['Hip-Hop', 'Electronic', 'Pop', 'Rock', 'R&B', 'Jazz', 'Crypto']

  useEffect(() => {
    fetchTracks()
  }, [selectedGenre])

  const fetchTracks = async () => {
    setLoading(true)
    try {
      const url = selectedGenre ? `${API_URL}/tracks?genre=${selectedGenre}` : `${API_URL}/tracks`
      const response = await axios.get(url)
      setTracks(response.data.tracks)
    } catch (error) {
      console.error('Error fetching tracks:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderTrackCard = ({ item }: { item: Track }) => (
    <TouchableOpacity style={styles.trackCard}>
      {item.coverUrl && <Image source={{ uri: item.coverUrl }} style={styles.trackImage} />}
      {!item.coverUrl && (
        <View style={[styles.trackImage, styles.placeholderImage]}>
          <Ionicons name="musical-notes" size={40} color="#00FF00" />
        </View>
      )}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{item.title}</Text>
        <Text style={styles.trackArtist}>@{item.artist.username}</Text>
        <View style={styles.trackMeta}>
          <Text style={styles.genre}>{item.genre}</Text>
          <Text style={styles.streams}>{item.streams.toLocaleString()} plays</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <Ionicons name="play-circle" size={48} color="#00FF00" />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, {user.username}! 🎵</Text>
        <Text style={styles.headerSubtitle}>Discover amazing crypto-backed music</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genreScroll}>
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre}
            style={[styles.genreChip, selectedGenre === genre && styles.genreChipActive]}
            onPress={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
          >
            <Text style={[styles.genreChipText, selectedGenre === genre && styles.genreChipTextActive]}>{genre}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#00FF00" style={styles.loader} />
      ) : (
        <FlatList
          data={tracks}
          renderItem={renderTrackCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.tracksList}
        />
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#00FF00',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00FF00',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  genreScroll: {
    padding: 15,
    marginBottom: 10,
  },
  genreChip: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#00FF00',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  genreChipActive: {
    backgroundColor: '#00FF00',
  },
  genreChipText: {
    color: '#00FF00',
    fontSize: 13,
    fontWeight: '600',
  },
  genreChipTextActive: {
    color: '#000',
  },
  tracksList: {
    padding: 15,
  },
  trackCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1a1a1a',
    flexDirection: 'row',
  },
  trackImage: {
    width: 100,
    height: 100,
    backgroundColor: '#1a1a1a',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 12,
    color: '#00FF00',
    marginBottom: 8,
  },
  trackMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genre: {
    fontSize: 11,
    color: '#666',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  streams: {
    fontSize: 11,
    color: '#999',
  },
  playButton: {
    padding: 15,
    justifyContent: 'center',
  },
  loader: {
    marginTop: 50,
  },
})

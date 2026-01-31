'use client';

import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Alert, ActivityIndicator } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api'

interface Upload {
  id: string
  title: string
  genre: string
  streams: number
  createdAt: string
}

export default function ArtistScreen({ token, user }: { token: string; user: any }) {
  const [uploads, setUploads] = useState<Upload[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleSelectAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
      })

      if (result.assets && result.assets[0]) {
        Alert.alert('Audio Selected', `File: ${result.assets[0].name}`)
        // In real app, would upload to Vercel Blob
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select audio')
    }
  }

  const handleSelectCover = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      if (!result.canceled) {
        Alert.alert('Image Selected', 'Cover image selected')
        // In real app, would upload to Vercel Blob
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image')
    }
  }

  const handleUploadTrack = async () => {
    Alert.prompt(
      'New Track',
      'Enter track title',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Upload',
          onPress: async (title) => {
            if (!title) return

            Alert.prompt(
              'Select Genre',
              'Enter genre',
              [
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                {
                  text: 'Next',
                  onPress: async (genre) => {
                    if (!genre) return

                    setUploading(true)
                    try {
                      // Demo: simulate upload
                      const newTrack: Upload = {
                        id: Math.random().toString(),
                        title,
                        genre,
                        streams: 0,
                        createdAt: new Date().toISOString(),
                      }
                      setUploads([newTrack, ...uploads])
                      Alert.alert('Success', 'Track uploaded!')
                    } catch (error) {
                      Alert.alert('Error', 'Failed to upload track')
                    } finally {
                      setUploading(false)
                    }
                  },
                },
              ]
            )
          },
        },
      ]
    )
  }

  const renderUploadCard = ({ item }: { item: Upload }) => (
    <TouchableOpacity style={styles.uploadCard}>
      <View style={styles.uploadImage}>
        <Ionicons name="musical-notes" size={30} color="#00FF00" />
      </View>
      <View style={styles.uploadInfo}>
        <Text style={styles.uploadTitle}>{item.title}</Text>
        <Text style={styles.uploadGenre}>{item.genre}</Text>
        <Text style={styles.uploadStreams}>{item.streams.toLocaleString()} streams</Text>
      </View>
      <TouchableOpacity>
        <Ionicons name="ellipsis-vertical" size={24} color="#00FF00" />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Artist Dashboard</Text>
        <Text style={styles.subtitle}>Manage your music & earnings</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Total Uploads</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Total Streams</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>$0.00</Text>
          <Text style={styles.statLabel}>Earnings</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.uploadButton} onPress={handleUploadTrack} disabled={uploading}>
        <Ionicons name="cloud-upload" size={24} color="#000" />
        <Text style={styles.uploadButtonText}>{uploading ? 'Uploading...' : 'Upload New Track'}</Text>
      </TouchableOpacity>

      <Text style={styles.uploadedTitle}>Your Uploads</Text>
      <FlatList
        data={uploads}
        renderItem={renderUploadCard}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="musical-notes" size={48} color="#333" />
            <Text style={styles.emptyText}>No uploads yet</Text>
            <Text style={styles.emptySubtext}>Start by uploading your first track!</Text>
          </View>
        }
        scrollEnabled={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 15,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00FF00',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#00FF00',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00FF00',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
  },
  uploadButton: {
    backgroundColor: '#00FF00',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  uploadButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  uploadedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  uploadCard: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  uploadImage: {
    width: 60,
    height: 60,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  uploadInfo: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  uploadGenre: {
    fontSize: 12,
    color: '#00FF00',
    marginBottom: 3,
  },
  uploadStreams: {
    fontSize: 11,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#666',
  },
})

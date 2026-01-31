'use client';

import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import axios from 'axios'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api'

export default function LoginScreen({ onLoginSuccess }: { onLoginSuccess: (token: string, user: any) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [username, setUsername] = useState('')
  const [userType, setUserType] = useState<'LISTENER' | 'ARTIST'>('LISTENER')

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      })

      onLoginSuccess(response.data.token, response.data.user)
    } catch (error: any) {
      Alert.alert('Login Error', error.response?.data?.error || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async () => {
    if (!email || !password || !username) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        username,
        password,
        userType,
      })

      onLoginSuccess(response.data.token, response.data.user)
    } catch (error: any) {
      Alert.alert('Signup Error', error.response?.data?.error || 'Failed to signup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crypto Beats</Text>
      <Text style={styles.subtitle}>{isSignup ? 'Create Account' : 'Welcome Back'}</Text>

      {isSignup && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
          />
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, userType === 'LISTENER' && styles.typeButtonActive]}
              onPress={() => setUserType('LISTENER')}
            >
              <Text style={styles.typeButtonText}>Listener</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, userType === 'ARTIST' && styles.typeButtonActive]}
              onPress={() => setUserType('ARTIST')}
            >
              <Text style={styles.typeButtonText}>Artist</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={isSignup ? handleSignup : handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
        <Text style={styles.toggleText}>{isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00FF00',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#00FF00',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#00FF00',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#00FF00',
  },
  typeButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#00FF00',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  toggleText: {
    color: '#00FF00',
    textAlign: 'center',
    fontSize: 14,
  },
})

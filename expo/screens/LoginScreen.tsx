'use client'

import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import axios from 'axios'
import { ChosenLogoHorizontal } from './OnboardingScreen'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api'

export default function LoginScreen({ onLoginSuccess }: { onLoginSuccess: (token: string, user: any) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [userType, setUserType] = useState<'LISTENER' | 'ARTIST'>('LISTENER')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const shakeAnim = React.useRef(new Animated.Value(0)).current

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start()
  }

  const getDetailedErrorMessage = (error: any): string => {
    if (!error) return 'An error occurred. Please try again.'

    if (error.response?.status === 401) {
      return 'Invalid email or password. Please check and try again.'
    }

    if (error.response?.status === 400) {
      const errorData = error.response.data
      if (errorData.error?.includes('already exists')) {
        return 'This email is already registered. Please log in or use a different email.'
      }
      if (errorData.error?.includes('invalid')) {
        return 'Please check your email format and try again.'
      }
      if (errorData.error?.includes('required')) {
        return 'Please fill in all required fields.'
      }
      return errorData.error || 'Invalid input. Please check your details.'
    }

    if (error.response?.status === 409) {
      return 'This username is already taken. Please choose a different one.'
    }

    if (error.response?.status === 500) {
      return 'Server error. Please try again later.'
    }

    if (error.code === 'ECONNABORTED') {
      return 'Connection timeout. Please check your internet and try again.'
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return 'Unable to connect to server. Please check your internet connection.'
    }

    return error.response?.data?.error || error.message || 'An error occurred. Please try again.'
  }

  const handleLogin = async () => {
    setError('')

    if (!email.trim()) {
      setError('Email is required')
      triggerShake()
      return
    }

    if (!password) {
      setError('Password is required')
      triggerShake()
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      triggerShake()
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { email: email.trim(), password },
        { timeout: 10000 }
      )

      if (response.data.token && response.data.user) {
        setEmail('')
        setPassword('')
        onLoginSuccess(response.data.token, response.data.user)
      }
    } catch (error: any) {
      const detailedError = getDetailedErrorMessage(error)
      setError(detailedError)
      triggerShake()
      console.error('[v0] Login error:', detailedError)
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async () => {
    setError('')

    if (!username.trim()) {
      setError('Username is required')
      triggerShake()
      return
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      triggerShake()
      return
    }

    if (!email.trim()) {
      setError('Email is required')
      triggerShake()
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      triggerShake()
      return
    }

    if (!password) {
      setError('Password is required')
      triggerShake()
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      triggerShake()
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        `${API_URL}/auth/signup`,
        {
          email: email.trim(),
          username: username.trim(),
          password,
          userType,
        },
        { timeout: 10000 }
      )

      if (response.data.token && response.data.user) {
        setEmail('')
        setPassword('')
        setUsername('')
        onLoginSuccess(response.data.token, response.data.user)
      }
    } catch (error: any) {
      const detailedError = getDetailedErrorMessage(error)
      setError(detailedError)
      triggerShake()
      console.error('[v0] Signup error:', detailedError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <ChosenLogoHorizontal size="large" />
          <Text style={styles.tagline}>{isSignup ? 'Join the movement' : 'Welcome back'}</Text>
        </View>

        {/* Error Message */}
        {error ? (
          <Animated.View
            style={[
              styles.errorContainer,
              {
                transform: [{ translateX: shakeAnim }],
              },
            ]}
          >
            <MaterialCommunityIcons name="alert-circle" size={18} color="#FF6B6B" />
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        ) : null}

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Signup Fields */}
          {isSignup && (
            <>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Choose your username"
                  placeholderTextColor="#555"
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text)
                    setError('')
                  }}
                  editable={!loading}
                />
              </View>

              <View style={styles.typeSelector}>
                <Text style={styles.label}>Account Type</Text>
                <View style={styles.typeButtonsGroup}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      userType === 'LISTENER' && styles.typeButtonActive,
                    ]}
                    onPress={() => setUserType('LISTENER')}
                    disabled={loading}
                  >
                    <MaterialCommunityIcons
                      name="music"
                      size={20}
                      color={userType === 'LISTENER' ? '#000' : '#00FF00'}
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        userType === 'LISTENER' && styles.typeButtonTextActive,
                      ]}
                    >
                      Listener
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      userType === 'ARTIST' && styles.typeButtonActive,
                    ]}
                    onPress={() => setUserType('ARTIST')}
                    disabled={loading}
                  >
                    <MaterialCommunityIcons
                      name="music-box"
                      size={20}
                      color={userType === 'ARTIST' ? '#000' : '#00FF00'}
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        userType === 'ARTIST' && styles.typeButtonTextActive,
                      ]}
                    >
                      Artist
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor="#555"
              value={email}
              onChangeText={(text) => {
                setEmail(text)
                setError('')
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInputWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder={isSignup ? 'At least 6 characters' : 'Enter your password'}
                placeholderTextColor="#555"
                value={password}
                onChangeText={(text) => {
                  setPassword(text)
                  setError('')
                }}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
                style={styles.eyeButton}
              >
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#00FF00"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Primary Button */}
        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.buttonLoading]}
          onPress={isSignup ? handleSignup : handleLogin}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Loading...' : isSignup ? 'Create Account' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        {/* Toggle Mode */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>
            {isSignup ? "Already have an account? " : "Don't have an account? "}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setIsSignup(!isSignup)
              setError('')
              setEmail('')
              setPassword('')
              setUsername('')
            }}
            disabled={loading}
          >
            <Text style={styles.toggleLink}>{isSignup ? 'Sign In' : 'Sign Up'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 48,
    gap: 12,
  },
  tagline: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  formContainer: {
    marginBottom: 28,
    gap: 18,
  },
  inputWrapper: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 10,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  typeSelector: {
    gap: 8,
  },
  typeButtonsGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#111',
    borderWidth: 1.5,
    borderColor: '#222',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: '#00FF00',
    borderColor: '#00FF00',
  },
  typeButtonText: {
    color: '#888',
    fontWeight: '600',
    fontSize: 13,
  },
  typeButtonTextActive: {
    color: '#000',
  },
  primaryButton: {
    backgroundColor: '#00FF00',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonLoading: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  toggleText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  toggleLink: {
    color: '#00FF00',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.3,
  },
})

import * as SecureStore from 'expo-secure-store'

// Securely store auth tokens
export const storeAuthToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync('authToken', token)
  } catch (error) {
    console.error('Error storing token:', error)
  }
}

export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync('authToken')
  } catch (error) {
    console.error('Error retrieving token:', error)
    return null
  }
}

export const removeAuthToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync('authToken')
  } catch (error) {
    console.error('Error removing token:', error)
  }
}

// Format duration in seconds to MM:SS
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Format large numbers for display
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate username
export const isValidUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username)
}

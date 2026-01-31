import axios, { AxiosInstance } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api'

let apiClient: AxiosInstance | null = null

export const getApiClient = async (): Promise<AxiosInstance> => {
  if (apiClient) {
    return apiClient
  }

  const token = await AsyncStorage.getItem('authToken')

  apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })

  // Add response interceptor for token refresh
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem('authToken')
        await AsyncStorage.removeItem('user')
      }
      return Promise.reject(error)
    }
  )

  return apiClient
}

export const resetApiClient = () => {
  apiClient = null
}

'use client';

import React, { useState, useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'

import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import ArtistScreen from './screens/ArtistScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function HomeTabs({ token, user }: { token: string; user: any }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#00FF00',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#00FF00',
        tabBarInactiveTintColor: '#666',
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home'
          if (route.name === 'Discover') {
            iconName = 'search'
          } else if (route.name === 'Artist') {
            iconName = 'musical-notes'
          } else if (route.name === 'Profile') {
            iconName = 'person'
          }
          return <Ionicons name={iconName as any} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen
        name="Home"
        options={{ title: 'Home' }}
        children={() => <HomeScreen token={token} user={user} />}
      />
      <Tab.Screen
        name="Discover"
        options={{ title: 'Discover' }}
        children={() => <HomeScreen token={token} user={user} />}
      />
      {user.userType === 'ARTIST' && (
        <Tab.Screen
          name="Artist"
          options={{ title: 'Artist' }}
          children={() => <ArtistScreen token={token} user={user} />}
        />
      )}
      <Tab.Screen
        name="Profile"
        options={{ title: 'Profile' }}
        children={() => <HomeScreen token={token} user={user} />}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkStoredAuth()
  }, [])

  const checkStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken')
      const storedUser = await AsyncStorage.getItem('user')

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Error checking stored auth:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSuccess = async (newToken: string, newUser: any) => {
    try {
      await AsyncStorage.setItem('authToken', newToken)
      await AsyncStorage.setItem('user', JSON.stringify(newUser))
      setToken(newToken)
      setUser(newUser)
    } catch (error) {
      console.error('Error saving auth:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken')
      await AsyncStorage.removeItem('user')
      setToken(null)
      setUser(null)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#00FF00" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="App">
            {() => <HomeTabs token={token} user={user} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Login">
            {() => <LoginScreen onLoginSuccess={handleLoginSuccess} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

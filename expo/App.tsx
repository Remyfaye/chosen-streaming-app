'use client';

import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import ArtistScreen from './screens/ArtistScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  React.useEffect(() => {
    bootstrapAsync()
  }, [])

  const bootstrapAsync = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('userToken')
      if (savedToken) {
        setToken(savedToken)
        setIsLoggedIn(true)
      }
    } catch (e) {
      console.log('Failed to restore token')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginSuccess = async (newToken: string, newUser: any) => {
    setToken(newToken)
    setUser(newUser)
    setIsLoggedIn(true)
    await AsyncStorage.setItem('userToken', newToken)
    await AsyncStorage.setItem('userData', JSON.stringify(newUser))
  }

  const handleLogout = async () => {
    setToken(null)
    setUser(null)
    setIsLoggedIn(false)
    await AsyncStorage.removeItem('userToken')
    await AsyncStorage.removeItem('userData')
  }

  if (isLoading) {
    return null
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = 'music'
              if (route.name === 'Home') {
                iconName = focused ? 'music' : 'music'
              } else if (route.name === 'Artist') {
                iconName = focused ? 'upload' : 'upload'
              }
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />
            },
            tabBarActiveTintColor: '#00FF00',
            tabBarInactiveTintColor: '#666',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTintColor: '#00FF00',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen
            name="Home"
            options={{ title: 'Discover' }}
            children={() => <HomeScreen token={token} user={user} />}
          />
          <Tab.Screen
            name="Artist"
            options={{ title: 'My Music' }}
            children={() => <ArtistScreen token={token} user={user} />}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Login"
            children={() => <LoginScreen onLoginSuccess={handleLoginSuccess} />}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  )
}

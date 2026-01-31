"use client";

import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingScreen from "./screens/OnboardingScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import ArtistScreen from "./screens/ArtistScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const savedToken = await AsyncStorage.getItem("userToken");
      const seenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");

      console.log(
        "[v0] Bootstrap - Token:",
        !!savedToken,
        "Onboarding seen:",
        seenOnboarding
      );

      // Only mark onboarding as seen if it's explicitly set to true
      if (seenOnboarding === "true") {
        setHasSeenOnboarding(true);
      }

      if (savedToken) {
        setToken(savedToken);
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.log("[v0] Failed to restore session:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    console.log("[v0] Onboarding completed");
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    setHasSeenOnboarding(true);
  };

  const handleLoginSuccess = async (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    setIsLoggedIn(true);
    await AsyncStorage.setItem("userToken", newToken);
    await AsyncStorage.setItem("userData", JSON.stringify(newUser));
  };

  const handleLogout = async () => {
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
  };

  if (isLoading) {
    return null;
  }

  console.log(
    "[v0] App state - isLoggedIn:",
    isLoggedIn,
    "hasSeenOnboarding:",
    hasSeenOnboarding
  );

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = 'music';
              if (route.name === 'Home') {
                iconName = focused ? 'music' : 'music';
              } else if (route.name === 'Artist') {
                iconName = focused ? 'upload' : 'upload';
              }
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#00FF00',
            tabBarInactiveTintColor: '#666',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#16213E',
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
      ) : !hasSeenOnboarding ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" children={() => <OnboardingScreen onComplete={handleOnboardingComplete} />} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Signup"
            children={() => <LoginScreen onLoginSuccess={handleLoginSuccess} isSignupMode={true} />}
          />
          <Stack.Screen
            name="Login"
            children={() => <LoginScreen onLoginSuccess={handleLoginSuccess} />}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

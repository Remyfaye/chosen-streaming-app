'use client'

import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  Animated,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')

interface OnboardingScreenProps {
  onComplete: () => void
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const fadeAnim = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()
  }, [currentStep])

  const steps = [
    {
      title: 'Welcome to CHOSEN',
      subtitle: 'Where Music Meets Crypto',
      description: 'Discover the future of streaming. Stream music, earn rewards, and own your listening experience.',
      icon: 'headphones',
      color: '#00FF00',
    },
    {
      title: 'Earn as You Listen',
      subtitle: 'Stream to Earn',
      description:
        'Every song you play earns you crypto rewards. Turn your passion for music into real value.',
      icon: 'bitcoin',
      color: '#FFD700',
    },
    {
      title: 'Support Artists Directly',
      subtitle: 'Artist Powered',
      description:
        "Your streams go directly to artists you love. No middleman, just pure music and rewards.",
      icon: 'music',
      color: '#00FF00',
    },
    {
      title: 'Join the Revolution',
      subtitle: 'Get Started Now',
      description:
        'Create your account and start earning immediately. Your music journey awaits.',
      icon: 'rocket',
      color: '#FFD700',
    },
  ]

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      fadeAnim.setValue(0)
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      fadeAnim.setValue(0)
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <View style={styles.container}>
      {/* Animated Background Glow */}
      <View style={styles.glowContainer}>
        <View style={[styles.glow, { backgroundColor: step.color, opacity: 0.1 }]} />
        <View style={[styles.glow, { backgroundColor: step.color, opacity: 0.05 }]} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} scrollEnabled={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>CHOSEN</Text>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        {/* Icon Animation */}
        <Animated.View style={[styles.iconContainer, { opacity: fadeAnim }]}>
          <View style={[styles.iconBackground, { borderColor: step.color }]}>
            <MaterialCommunityIcons name={step.icon as any} size={80} color={step.color} />
          </View>
        </Animated.View>

        {/* Text Content */}
        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <Text style={[styles.title, { color: step.color }]}>{step.title}</Text>
          <Text style={styles.subtitle}>{step.subtitle}</Text>
          <Text style={styles.description}>{step.description}</Text>
        </Animated.View>

        {/* Decorative Elements */}
        <View style={styles.decorativeContainer}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentStep && styles.dotActive,
                { backgroundColor: i === currentStep ? step.color : '#333' },
              ]}
            />
          ))}
          {[3].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentStep && styles.dotActive,
                { backgroundColor: i === currentStep ? step.color : '#333' },
              ]}
            />
          ))}
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handlePrev}
          style={[styles.button, styles.secondaryButton]}
          disabled={currentStep === 0}
        >
          <MaterialCommunityIcons name="chevron-left" size={24} color={currentStep === 0 ? '#666' : '#00FF00'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          style={[styles.button, styles.primaryButton, { backgroundColor: step.color }]}
        >
          <Text style={[styles.buttonText, { color: step.color === '#FFD700' ? '#000' : '#000' }]}>
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <MaterialCommunityIcons
            name={currentStep === steps.length - 1 ? 'arrow-right' : 'chevron-right'}
            size={24}
            color={step.color === '#FFD700' ? '#000' : '#000'}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  glowContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  glow: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 0.8,
    borderRadius: width,
    top: height * 0.2,
    left: -width * 0.25,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#00FF00',
    letterSpacing: 3,
    textShadowColor: '#00FF00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00FF00',
  },
  skipText: {
    color: '#00FF00',
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#222',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 40,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00FF00',
    borderRadius: 2,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  iconBackground: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 0, 0.05)',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 8,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 255, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 22,
    marginHorizontal: 10,
  },
  decorativeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
  },
  dotActive: {
    width: 28,
    height: 8,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    zIndex: 1,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
  },
  primaryButton: {
    borderColor: 'transparent',
    flex: 2,
  },
  secondaryButton: {
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 16,
  },
})

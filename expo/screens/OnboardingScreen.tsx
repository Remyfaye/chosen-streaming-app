'use client'

import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')

interface OnboardingScreenProps {
  onComplete: () => void
}

// Horizontal Chosen Logo Component with simple headset
export function ChosenLogoHorizontal({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const sizeConfig = {
    small: { headsetSize: 28, textSize: 18, gap: 8 },
    medium: { headsetSize: 40, textSize: 24, gap: 12 },
    large: { headsetSize: 56, textSize: 32, gap: 16 },
  }
  const config = sizeConfig[size]

  return (
    <View style={styles.logoHorizontal}>
      {/* Headset Icon - Simple Design */}
      <View style={[styles.headsetIcon, { width: config.headsetSize, height: config.headsetSize }]}>
        <MaterialCommunityIcons name="headphones" size={config.headsetSize * 0.8} color="#00FF00" />
      </View>
      {/* "Chosen" Text */}
      <Text style={[styles.logoText, { fontSize: config.textSize }]}>Chosen</Text>
    </View>
  )
}

// Playful illustration components for each onboarding step
function StreamingIllustration() {
  return (
    <View style={styles.illustration}>
      <View style={styles.musicNotes}>
        <MaterialCommunityIcons name="music" size={60} color="#00FF00" style={{ opacity: 0.7 }} />
      </View>
      <View style={styles.pulseCircle}>
        <View style={[styles.pulseRing, { borderColor: '#00FF00', opacity: 0.8 }]} />
        <View style={[styles.pulseRing, { borderColor: '#FFD700', opacity: 0.5 }]} />
      </View>
    </View>
  )
}

function PremiumIllustration() {
  return (
    <View style={styles.illustration}>
      <View style={styles.premiumContainer}>
        <MaterialCommunityIcons name="crown" size={70} color="#FFD700" style={{ opacity: 0.8 }} />
        <View style={styles.starBurst}>
          <MaterialCommunityIcons name="star" size={35} color="#00FF00" style={{ opacity: 0.6 }} />
          <MaterialCommunityIcons name="star" size={35} color="#FFD700" style={{ opacity: 0.6, marginTop: 20 }} />
        </View>
      </View>
    </View>
  )
}

function ArtistIllustration() {
  return (
    <View style={styles.illustration}>
      <View style={styles.heartContainer}>
        <MaterialCommunityIcons name="heart-multiple" size={80} color="#FF69B4" style={{ opacity: 0.8 }} />
        <View style={styles.artistIcon}>
          <MaterialCommunityIcons name="music-box" size={40} color="#00FF00" />
        </View>
      </View>
    </View>
  )
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const fadeAnim = React.useRef(new Animated.Value(0)).current
  const slideAnim = React.useRef(new Animated.Value(50)).current

  React.useEffect(() => {
    fadeAnim.setValue(0)
    slideAnim.setValue(50)

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()
  }, [currentStep])

  const steps = [
    {
      title: 'Welcome to Chosen',
      description: 'Stream unlimited music and discover your next favorite artist.',
      highlight: 'Music redefined',
      component: StreamingIllustration,
      bgColor: '#16213E',
    },
    {
      title: 'Unlock Premium',
      description: 'Go premium for ad-free listening, offline downloads, and exclusive content.',
      highlight: 'Premium features',
      component: PremiumIllustration,
      bgColor: '#16213E',
    },
    {
      title: 'Support Artists Directly',
      description: 'Your streams go straight to creators. No middlemen, just pure connection.',
      highlight: 'Direct support',
      component: ArtistIllustration,
      bgColor: '#16213E',
    },
  ]

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100
  const IllustrationComponent = step.component

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: step.bgColor }]}>
      <ScrollView scrollEnabled={false} style={styles.content}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <ChosenLogoHorizontal size="medium" />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        {/* Illustration Section */}
        <Animated.View
          style={[
            styles.illustrationSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <IllustrationComponent />
        </Animated.View>

        {/* Text Content */}
        <Animated.View
          style={[
            styles.textSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.highlight}>{step.highlight}</Text>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.description}>{step.description}</Text>
        </Animated.View>

        {/* Step Indicators */}
        <View style={styles.stepsContainer}>
          {steps.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.stepIndicator,
                index === currentStep && styles.stepIndicatorActive,
              ]}
              onPress={() => setCurrentStep(index)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handlePrev}
          disabled={currentStep === 0}
          style={[styles.secondaryButton, currentStep === 0 && styles.buttonDisabled]}
        >
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>
            {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
          <MaterialCommunityIcons
            name={currentStep === steps.length - 1 ? 'arrow-right' : 'chevron-right'}
            size={20}
            color="#000"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logoHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headsetIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  progressContainer: {
    height: 3,
    backgroundColor: '#333',
    borderRadius: 1.5,
    overflow: 'hidden',
    marginBottom: 60,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00FF00',
    borderRadius: 1.5,
  },
  illustrationSection: {
    alignItems: 'center',
    marginBottom: 60,
    minHeight: 140,
  },
  illustration: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  musicNotes: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pulseCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  pulseRing: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 50,
  },
  premiumContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  starBurst: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 30,
  },
  heartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  artistIcon: {
    position: 'absolute',
    backgroundColor: '#16213E',
    borderRadius: 50,
    padding: 10,
  },
  coinStack: {
    alignItems: 'center',
    gap: 15,
  },
  coin: {
    alignItems: 'center',
  },
  textSection: {
    marginBottom: 80,
  },
  highlight: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
    letterSpacing: 1.2,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: '#aaa',
    lineHeight: 26,
    fontWeight: '400',
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 40,
  },
  stepIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#333',
    opacity: 0.5,
  },
  stepIndicatorActive: {
    backgroundColor: '#00FF00',
    width: 24,
    opacity: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  primaryButton: {
    flex: 1.5,
    backgroundColor: '#00FF00',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#444',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
})

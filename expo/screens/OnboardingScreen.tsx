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
import Svg, { Circle, Path, Line, G } from 'react-native-svg'

const { width, height } = Dimensions.get('window')

interface OnboardingScreenProps {
  onComplete: () => void
}

// Creative headset logo component
function ChosenLogo() {
  return (
    <Svg width={90} height={90} viewBox="0 0 100 100">
      <G>
        {/* Left ear cup outer */}
        <Circle cx="22" cy="42" r="16" fill="none" stroke="#00FF00" strokeWidth="2.5" />
        {/* Left ear cup inner accent */}
        <Circle cx="22" cy="42" r="11" fill="none" stroke="#00FF00" strokeWidth="1" opacity="0.5" />
        
        {/* Right ear cup outer */}
        <Circle cx="78" cy="42" r="16" fill="none" stroke="#00FF00" strokeWidth="2.5" />
        {/* Right ear cup inner accent */}
        <Circle cx="78" cy="42" r="11" fill="none" stroke="#00FF00" strokeWidth="1" opacity="0.5" />
        
        {/* Headband arc left */}
        <Path d="M 22 26 Q 15 12 50 10" fill="none" stroke="#00FF00" strokeWidth="2.5" strokeLinecap="round" />
        {/* Headband arc right */}
        <Path d="M 50 10 Q 85 12 78 26" fill="none" stroke="#00FF00" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Center connector with gold accent */}
        <Line x1="50" y1="10" x2="50" y2="24" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
        
        {/* Left connection bracket */}
        <Line x1="22" y1="26" x2="22" y2="32" stroke="#00FF00" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        {/* Right connection bracket */}
        <Line x1="78" y1="26" x2="78" y2="32" stroke="#00FF00" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        
        {/* Microphone boom - curved */}
        <Path d="M 32 56 Q 38 70 42 82" fill="none" stroke="#00FF00" strokeWidth="2" strokeLinecap="round" />
        {/* Mic capsule - gold circle */}
        <Circle cx="42" cy="85" r="2.5" fill="#FFD700" />
        {/* Mic mesh detail */}
        <Circle cx="42" cy="85" r="4" fill="none" stroke="#FFD700" strokeWidth="0.8" opacity="0.6" />
        
        {/* Speaker driver detail - left */}
        <Circle cx="22" cy="42" r="7" fill="none" stroke="#00FF00" strokeWidth="0.8" opacity="0.4" />
        {/* Speaker driver detail - right */}
        <Circle cx="78" cy="42" r="7" fill="none" stroke="#00FF00" strokeWidth="0.8" opacity="0.4" />
        
        {/* Sound waves accent */}
        <Path d="M 50 50 Q 60 45 65 42" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
        <Path d="M 50 56 Q 58 52 62 50" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
      </G>
    </Svg>
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
      description: 'Stream music. Earn rewards. Own your experience.',
      icon: 'music-box-multiple-outline',
      highlight: 'Music redefined',
    },
    {
      title: 'Earn While You Listen',
      description: 'Every song is an opportunity. Get rewarded instantly for what you love.',
      icon: 'lightning-bolt',
      highlight: 'Passive income',
    },
    {
      title: 'Support Artists Directly',
      description: 'Your streams go straight to creators. No middlemen, just pure connection.',
      icon: 'heart-multiple-outline',
      highlight: 'Direct support',
    },
  ]

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

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
    <View style={styles.container}>
      <ScrollView scrollEnabled={false} style={styles.content}>
        {/* Logo and Header */}
        <View style={styles.header}>
          {currentStep === 0 && (
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              <ChosenLogo />
            </Animated.View>
          )}
          <Text style={styles.logo}>Chosen</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        {/* Icon Section */}
        <Animated.View
          style={[
            styles.iconSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons
              name={step.icon as any}
              size={88}
              color="#00FF00"
            />
          </View>
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
    backgroundColor: '#000',
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
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 2,
  },
  progressContainer: {
    height: 3,
    backgroundColor: '#222',
    borderRadius: 1.5,
    overflow: 'hidden',
    marginBottom: 60,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00FF00',
    borderRadius: 1.5,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 60,
    minHeight: 140,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 255, 0, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 0, 0.2)',
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
    borderColor: '#333',
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

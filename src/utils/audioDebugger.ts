// Audio Debugging and Diagnostic Utility

import { supabase } from '../lib/supabase'

export interface AudioDiagnostics {
  isUserAuthenticated: boolean
  isElevenLabsConfigured: boolean
  canAccessElevenLabsApi: boolean
  networkConnectivity: boolean
  errorMessages: string[]
  suggestions: string[]
}

export class AudioDebugger {
  private errors: string[] = []
  private suggestions: string[] = []

  async runDiagnostics(): Promise<AudioDiagnostics> {
    this.errors = []
    this.suggestions = []

    const diagnostics: AudioDiagnostics = {
      isUserAuthenticated: await this.checkAuthentication(),
      isElevenLabsConfigured: await this.checkElevenLabsConfiguration(),
      canAccessElevenLabsApi: await this.testElevenLabsApiAccess(),
      networkConnectivity: await this.checkNetworkConnectivity(),
      errorMessages: this.errors,
      suggestions: this.suggestions
    }

    return diagnostics
  }

  private async checkAuthentication(): Promise<boolean> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        this.errors.push(`Authentication error: ${error.message}`)
        this.suggestions.push('Please sign in to your account')
        return false
      }

      if (!user) {
        this.errors.push('User not authenticated')
        this.suggestions.push('Please sign in to use audio features')
        return false
      }

      console.log('✅ User authenticated successfully')
      return true
    } catch (error) {
      this.errors.push(`Authentication check failed: ${error}`)
      this.suggestions.push('Check your internet connection and try signing in again')
      return false
    }
  }

  private async checkElevenLabsConfiguration(): Promise<boolean> {
    try {
      // Test if we can invoke the ElevenLabs function (this will fail if not configured)
      const { error } = await supabase.functions.invoke('elevenlabs-proxy/voices', {
        body: { test: true }
      })

      if (error) {
        if (error.message.includes('ElevenLabs API key not configured')) {
          this.errors.push('ElevenLabs API key is not configured in Supabase')
          this.suggestions.push('Contact the administrator to configure ElevenLabs API key in Supabase secrets')
          return false
        } else if (error.message.includes('Invalid ElevenLabs API key')) {
          this.errors.push('ElevenLabs API key is invalid')
          this.suggestions.push('The configured ElevenLabs API key appears to be invalid')
          return false
        }
        
        // If it's a different error, the configuration might still be okay
        console.log('ElevenLabs function callable, configuration appears correct')
        return true
      }

      console.log('✅ ElevenLabs configuration appears correct')
      return true
    } catch (error) {
      this.errors.push(`ElevenLabs configuration check failed: ${error}`)
      this.suggestions.push('Unable to verify ElevenLabs configuration')
      return false
    }
  }

  private async testElevenLabsApiAccess(): Promise<boolean> {
    try {
      console.log('Testing ElevenLabs API access...')
      
      // Try to get voices list
      const { data, error } = await supabase.functions.invoke('elevenlabs-proxy/voices')

      if (error) {
        this.errors.push(`ElevenLabs API error: ${error.message}`)
        
        if (error.message.includes('rate limit')) {
          this.suggestions.push('ElevenLabs rate limit exceeded. Please wait and try again.')
        } else if (error.message.includes('Invalid API key')) {
          this.suggestions.push('ElevenLabs API key is invalid. Contact administrator.')
        } else if (error.message.includes('not configured')) {
          this.suggestions.push('ElevenLabs API key not configured in Supabase secrets.')
        } else {
          this.suggestions.push('Check ElevenLabs service status and API configuration.')
        }
        
        return false
      }

      if (data && data.voices && Array.isArray(data.voices)) {
        console.log(`✅ ElevenLabs API accessible. Found ${data.voices.length} voices.`)
        return true
      } else {
        this.errors.push('ElevenLabs API returned unexpected response format')
        this.suggestions.push('There may be an issue with the ElevenLabs API response format')
        return false
      }
    } catch (error) {
      this.errors.push(`ElevenLabs API test failed: ${error}`)
      this.suggestions.push('Check internet connection and ElevenLabs service status')
      return false
    }
  }

  private async checkNetworkConnectivity(): Promise<boolean> {
    try {
      // Test basic internet connectivity
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        method: 'HEAD',
        headers: { 'Accept': 'application/json' }
      })

      if (response.ok || response.status === 401) {
        // 401 is expected without API key, but means network is working
        console.log('✅ Network connectivity to ElevenLabs confirmed')
        return true
      } else {
        this.errors.push(`Network connectivity issue: HTTP ${response.status}`)
        this.suggestions.push('Check your internet connection')
        return false
      }
    } catch (error) {
      this.errors.push(`Network connectivity test failed: ${error}`)
      this.suggestions.push('Check your internet connection and firewall settings')
      return false
    }
  }

  async testTextToSpeech(text: string = "Hello, this is a test."): Promise<boolean> {
    try {
      console.log('Testing text-to-speech generation...')
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-proxy/text-to-speech', {
        body: {
          text,
          voiceId: 'EXAVITQu4vr4xnSDxMaL', // Default voice
          stability: 0.5,
          similarity_boost: 0.75
        }
      })

      if (error) {
        this.errors.push(`Text-to-speech generation failed: ${error.message}`)
        
        if (error.message.includes('rate limit')) {
          this.suggestions.push('ElevenLabs rate limit exceeded. Please wait before trying again.')
        } else if (error.message.includes('quota')) {
          this.suggestions.push('ElevenLabs quota exceeded. Check your ElevenLabs account.')
        } else {
          this.suggestions.push('Check ElevenLabs configuration and account status.')
        }
        
        return false
      }

      if (data && data instanceof ArrayBuffer && data.byteLength > 0) {
        console.log(`✅ Text-to-speech successful. Generated ${data.byteLength} bytes of audio.`)
        return true
      } else {
        this.errors.push('Text-to-speech returned invalid audio data')
        this.suggestions.push('The audio generation completed but returned invalid data')
        return false
      }
    } catch (error) {
      this.errors.push(`Text-to-speech test failed: ${error}`)
      this.suggestions.push('Check logs for detailed error information')
      return false
    }
  }

  generateReport(diagnostics: AudioDiagnostics): string {
    let report = '🔍 Audio System Diagnostics Report\n\n'
    
    report += `Authentication: ${diagnostics.isUserAuthenticated ? '✅ Pass' : '❌ Fail'}\n`
    report += `ElevenLabs Config: ${diagnostics.isElevenLabsConfigured ? '✅ Pass' : '❌ Fail'}\n`
    report += `API Access: ${diagnostics.canAccessElevenLabsApi ? '✅ Pass' : '❌ Fail'}\n`
    report += `Network: ${diagnostics.networkConnectivity ? '✅ Pass' : '❌ Fail'}\n\n`
    
    if (diagnostics.errorMessages.length > 0) {
      report += '❌ Errors Found:\n'
      diagnostics.errorMessages.forEach((error, index) => {
        report += `${index + 1}. ${error}\n`
      })
      report += '\n'
    }
    
    if (diagnostics.suggestions.length > 0) {
      report += '💡 Suggestions:\n'
      diagnostics.suggestions.forEach((suggestion, index) => {
        report += `${index + 1}. ${suggestion}\n`
      })
    }
    
    return report
  }
}

// Helper function to run diagnostics and log results
export async function debugAudioIssues(): Promise<AudioDiagnostics> {
  console.log('🔍 Starting audio diagnostics...')
  
  const audioDebugger = new AudioDebugger()
  const diagnostics = await audioDebugger.runDiagnostics()
  
  // Test actual text-to-speech if basic checks pass
  if (diagnostics.isUserAuthenticated && diagnostics.isElevenLabsConfigured && diagnostics.canAccessElevenLabsApi) {
    console.log('Basic checks passed, testing text-to-speech...')
    const ttsResult = await audioDebugger.testTextToSpeech()
    if (!ttsResult) {
      console.log('❌ Text-to-speech test failed')
    }
  }
  
  const report = debugger.generateReport(diagnostics)
  console.log(report)
  
  return diagnostics
}

// Enhanced audio error handler
export function handleAudioError(error: any, context: string = 'Audio operation') {
  console.error(`${context} failed:`, error)
  
  let userMessage = 'Audio generation failed. '
  let technicalDetails = ''
  
  if (typeof error === 'string') {
    technicalDetails = error
  } else if (error?.message) {
    technicalDetails = error.message
  } else {
    technicalDetails = 'Unknown error'
  }
  
  // Provide user-friendly error messages
  if (technicalDetails.includes('ElevenLabs API key not configured')) {
    userMessage += 'The audio service is not properly configured. Please contact support.'
  } else if (technicalDetails.includes('rate limit')) {
    userMessage += 'Too many requests. Please wait a moment and try again.'
  } else if (technicalDetails.includes('quota')) {
    userMessage += 'Audio service quota exceeded. Please try again later.'
  } else if (technicalDetails.includes('Invalid API key')) {
    userMessage += 'Audio service authentication failed. Please contact support.'
  } else if (technicalDetails.includes('network') || technicalDetails.includes('fetch')) {
    userMessage += 'Network connection issue. Please check your internet connection.'
  } else if (technicalDetails.includes('User not authenticated')) {
    userMessage += 'Please sign in to use audio features.'
  } else {
    userMessage += 'An unexpected error occurred. Please try again.'
  }
  
  return {
    userMessage,
    technicalDetails,
    timestamp: new Date().toISOString()
  }
}

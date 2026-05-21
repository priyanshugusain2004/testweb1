import { supabase } from './supabase';

/**
 * Authentication Testing & Debugging Utility
 * 
 * Provides comprehensive OAuth flow testing and debugging capabilities
 */

export const authTestUtils = {
  /**
   * Test 1: Verify Supabase Configuration
   */
  testSupabaseConfig: async () => {
    console.log('🧪 Test 1: Supabase Configuration');
    try {
      if (!supabase) {
        return { status: '❌ FAILED', message: 'Supabase not configured', code: 'NO_SUPABASE' };
      }

      // Try to get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error && error.message !== 'Auth session not found') {
        return { status: '❌ FAILED', message: error.message, code: 'SESSION_ERROR' };
      }

      return { 
        status: '✅ PASSED', 
        message: 'Supabase configured correctly',
        session: !!session,
        code: 'SUPABASE_OK'
      };
    } catch (err) {
      return { status: '❌ FAILED', message: err.message, code: 'SUPABASE_ERROR' };
    }
  },

  /**
   * Test 2: Verify Platform Detection
   */
  testPlatformDetection: () => {
    console.log('🧪 Test 2: Platform Detection');
    const isNative = typeof window !== 'undefined' && window.Capacitor !== undefined;
    const isAndroid = isNative && /android/i.test(navigator.userAgent);
    const isIOS = isNative && /iphone|ipad|ipod/i.test(navigator.userAgent);

    return {
      status: isNative ? '✅ NATIVE APP' : '⚠️ WEB ONLY',
      isNativeApp: isNative,
      isAndroid,
      isIOS,
      isWeb: !isNative,
      userAgent: navigator.userAgent.substring(0, 100),
      code: isAndroid ? 'ANDROID' : isIOS ? 'IOS' : 'WEB'
    };
  },

  /**
   * Test 3: Verify OAuth Callback Handler
   */
  testOAuthCallbackHandler: () => {
    console.log('🧪 Test 3: OAuth Callback Handler');
    const hasHandler = typeof window.oauthCallback === 'function';

    return {
      status: hasHandler ? '✅ PASSED' : '❌ FAILED',
      message: hasHandler 
        ? 'OAuth callback handler registered' 
        : 'OAuth callback handler NOT found - deep links will not work',
      hasHandler,
      code: hasHandler ? 'HANDLER_OK' : 'HANDLER_MISSING'
    };
  },

  /**
   * Test 4: Simulate OAuth Callback (for testing)
   */
  simulateOAuthCallback: (code = 'test-code-123', state = 'test-state-456') => {
    console.log('🧪 Test 4: Simulate OAuth Callback');
    
    if (typeof window.oauthCallback !== 'function') {
      return { 
        status: '❌ FAILED', 
        message: 'OAuth callback handler not registered',
        code: 'HANDLER_MISSING'
      };
    }

    try {
      window.oauthCallback({ code, state });
      return { 
        status: '✅ PASSED', 
        message: 'OAuth callback simulated (code exchange would be attempted)',
        code: 'CALLBACK_SIMULATED'
      };
    } catch (err) {
      return { 
        status: '❌ FAILED', 
        message: err.message,
        code: 'CALLBACK_ERROR'
      };
    }
  },

  /**
   * Test 5: Verify Deep Link URL Format
   */
  testDeepLinkFormat: () => {
    console.log('🧪 Test 5: Deep Link URL Format');
    const expectedScheme = 'com.priyanshu.testweb1';
    const expectedHost = 'auth-callback';
    const testURL = `${expectedScheme}://${expectedHost}?code=test&state=test`;

    return {
      status: '✅ INFO',
      expectedScheme,
      expectedHost,
      exampleURL: testURL,
      testCommand: `adb shell am start -a android.intent.action.VIEW -d "${testURL}"`,
      code: 'DEEPLINK_FORMAT'
    };
  },

  /**
   * Test 6: Verify Browser Plugin
   */
  testBrowserPlugin: async () => {
    console.log('🧪 Test 6: Browser Plugin Availability');
    
    if (typeof window.Capacitor === 'undefined') {
      return {
        status: '⚠️ WARNING',
        message: 'Not running in Capacitor app - Browser plugin not available',
        hasBrowser: false,
        code: 'NO_CAPACITOR'
      };
    }

    try {
      const { Browser } = await import('@capacitor/browser');
      return {
        status: '✅ PASSED',
        message: 'Browser plugin available',
        hasBrowser: !!Browser,
        code: 'BROWSER_OK'
      };
    } catch (err) {
      return {
        status: '❌ FAILED',
        message: 'Browser plugin failed to load: ' + err.message,
        hasBrowser: false,
        code: 'BROWSER_ERROR'
      };
    }
  },

  /**
   * Test 7: Check Session Storage
   */
  testSessionStorage: () => {
    console.log('🧪 Test 7: Session Storage');
    
    try {
      const testKey = 'auth_test_' + Date.now();
      const testValue = 'test-value';
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      const isWorking = retrieved === testValue;
      
      return {
        status: isWorking ? '✅ PASSED' : '❌ FAILED',
        message: isWorking 
          ? 'Session storage working correctly' 
          : 'Session storage read/write failed',
        code: isWorking ? 'STORAGE_OK' : 'STORAGE_ERROR'
      };
    } catch (err) {
      return {
        status: '❌ FAILED',
        message: 'Session storage error: ' + err.message,
        code: 'STORAGE_ERROR'
      };
    }
  },

  /**
   * Test 8: Check Network Connectivity
   */
  testNetworkConnectivity: async () => {
    console.log('🧪 Test 8: Network Connectivity');
    
    try {
      await fetch('https://www.google.com/', { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      
      return {
        status: '✅ PASSED',
        message: 'Network connectivity confirmed',
        code: 'NETWORK_OK'
      };
    } catch (err) {
      return {
        status: '❌ FAILED',
        message: 'Network error: ' + err.message,
        code: 'NETWORK_ERROR'
      };
    }
  },

  /**
   * Run All Tests
   */
  runAllTests: async () => {
    console.log('\n🚀 RUNNING ALL AUTHENTICATION TESTS\n');
    
    const results = {
      timestamp: new Date().toISOString(),
      platform: authTestUtils.testPlatformDetection(),
      supabaseConfig: await authTestUtils.testSupabaseConfig(),
      oauthCallback: authTestUtils.testOAuthCallbackHandler(),
      deepLink: authTestUtils.testDeepLinkFormat(),
      browser: await authTestUtils.testBrowserPlugin(),
      storage: authTestUtils.testSessionStorage(),
      network: await authTestUtils.testNetworkConnectivity(),
    };

    const summary = {
      totalTests: 7,
      passed: Object.values(results).filter(r => r.status && r.status.includes('✅')).length,
      failed: Object.values(results).filter(r => r.status && r.status.includes('❌')).length,
      warnings: Object.values(results).filter(r => r.status && r.status.includes('⚠️')).length,
    };

    return { results, summary };
  },

  /**
   * Print Test Results to Console
   */
  printResults: (testResults) => {
    console.log('\n📊 TEST RESULTS SUMMARY\n');
    console.table({
      'Total Tests': testResults.summary.totalTests,
      '✅ Passed': testResults.summary.passed,
      '❌ Failed': testResults.summary.failed,
      '⚠️ Warnings': testResults.summary.warnings,
    });

    console.log('\n📋 DETAILED RESULTS:\n');
    Object.entries(testResults.results).forEach(([key, result]) => {
      if (typeof result === 'object') {
        console.group(`${result.status} ${key}`);
        console.log(result);
        console.groupEnd();
      }
    });
  },

  /**
   * Get Redirect URI for Current Platform
   */
  getRedirectURI: () => {
    const isNative = typeof window !== 'undefined' && window.Capacitor !== undefined;
    const isAndroid = isNative && /android/i.test(navigator.userAgent);
    
    if (isAndroid) {
      return 'com.priyanshu.testweb1://auth-callback';
    }
    
    return `${window.location.origin}/`;
  },

  /**
   * Log Complete Debug Info
   */
  logDebugInfo: async () => {
    console.log('\n🔍 COMPLETE DEBUG INFORMATION\n');
    
    const allTests = await authTestUtils.runAllTests();
    
    console.log('=== SYSTEM INFO ===');
    console.log('URL:', window.location.href);
    console.log('Origin:', window.location.origin);
    console.log('User Agent:', navigator.userAgent);
    console.log('Redirect URI:', authTestUtils.getRedirectURI());
    
    console.log('\n=== TEST RESULTS ===');
    authTestUtils.printResults(allTests);
    
    return allTests;
  }
};

/**
 * Quick Test Runner - Can be called from console
 * Usage: window.__testAuth()
 */
if (typeof window !== 'undefined') {
  window.__testAuth = {
    test: authTestUtils.runAllTests,
    print: authTestUtils.printResults,
    debug: authTestUtils.logDebugInfo,
    simulate: authTestUtils.simulateOAuthCallback,
    all: async () => {
      const results = await authTestUtils.runAllTests();
      authTestUtils.printResults(results);
      return results;
    }
  };
  
  // Log availability on page load
  console.log('✅ Auth testing utilities available at: window.__testAuth');
  console.log('   Run: await window.__testAuth.all() - to test everything');
  console.log('   Run: await window.__testAuth.debug() - for full debug info');
}

export default authTestUtils;

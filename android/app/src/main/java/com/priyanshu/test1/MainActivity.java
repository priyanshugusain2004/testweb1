package com.priyanshu.test1;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import com.getcapacitor.BridgeActivity;

/**
 * Main Android Activity for TestWeb1 App
 * 
 * Handles:
 * - OAuth callback deep links (Google Sign-In)
 * - App initialization and resumption
 * - Intent-based navigation
 */
public class MainActivity extends BridgeActivity {
  private static final String TAG = "MainActivity";
  private static final String AUTH_CALLBACK_SCHEME = "com.priyanshu.testweb1";
  private static final String AUTH_CALLBACK_HOST = "auth-callback";

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    
    // Handle any OAuth callback intent on app start
    handleOAuthCallback(getIntent());
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
    
    // Handle OAuth callback when app is resumed
    handleOAuthCallback(intent);
  }

  /**
   * Handles OAuth callback deep links
   * Extracts auth code and passes to WebView via postMessage
   */
  private void handleOAuthCallback(Intent intent) {
    if (intent == null) {
      return;
    }

    Uri data = intent.getData();
    if (data == null) {
      return;
    }

    Log.d(TAG, "Received intent with URI: " + data.toString());

    // Handle custom scheme: com.priyanshu.testweb1://auth-callback?code=...
    if (AUTH_CALLBACK_SCHEME.equals(data.getScheme()) && 
        AUTH_CALLBACK_HOST.equals(data.getHost())) {
      handleAuthCallback(data);
    }
    
    // Handle HTTPS deep link: https://com.priyanshu.testweb1/auth-callback?code=...
    else if ("https".equals(data.getScheme())) {
      String host = data.getHost();
      String path = data.getPath();
      if ("com.priyanshu.testweb1".equals(host) && "/auth-callback".equals(path)) {
        handleAuthCallback(data);
      }
    }
  }

  /**
   * Process OAuth callback parameters and notify the web layer
   */
  private void handleAuthCallback(Uri callbackUri) {
    Log.d(TAG, "Processing OAuth callback: " + callbackUri.toString());
    
    // Extract OAuth parameters
    String code = callbackUri.getQueryParameter("code");
    String state = callbackUri.getQueryParameter("state");
    String error = callbackUri.getQueryParameter("error");
    String errorDescription = callbackUri.getQueryParameter("error_description");
    
    if (error != null) {
      Log.e(TAG, "OAuth error: " + error + " - " + errorDescription);
      // Pass error to web layer
      String js = String.format(
        "window.oauthCallback({error: '%s', error_description: '%s'});",
        sanitizeForJavaScript(error),
        sanitizeForJavaScript(errorDescription)
      );
      bridge.evaluateJavascript(js, null);
    } else if (code != null) {
      Log.d(TAG, "OAuth code received: " + code.substring(0, 10) + "...");
      // Pass code to web layer
      String js = String.format(
        "window.oauthCallback({code: '%s', state: '%s'});",
        sanitizeForJavaScript(code),
        sanitizeForJavaScript(state)
      );
      bridge.evaluateJavascript(js, null);
    }
  }

  /**
   * Sanitize string for JavaScript execution to prevent injection
   */
  private String sanitizeForJavaScript(String input) {
    if (input == null) return "";
    return input.replace("'", "\\'").replace("\"", "\\\"").replace("\n", "\\n");
  }
}

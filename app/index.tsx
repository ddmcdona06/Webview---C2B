import React, { useState } from 'react';
import { SafeAreaView, View, Text, Button, Image, Platform, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import styles from './stylesheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { StatusBar } from 'expo-status-bar';
// import { setMaxListeners } from 'events';

const nav = [
  {label: 'Home', url: 'https://www.connect2black.com'},
  {label: 'Entertainment', url: 'https://www.connect2black.com/travel-agency-entertainment'},
  {label: 'Food', url: 'https://www.connect2black.com/travel-agency-food'}
]

export default function Index() {
  const [isError, setIsError] = useState(false);
  const [webKey, setWebKey] = useState(0);
  const [url, setUrl] = useState(nav[0].url)

  const reloadWebView = () => {

    setIsError(false);
    setWebKey(prev => prev + 1);
  };
  const renderNavBar = () => (

    <View style={styles.navBar}>
      {nav.map((page) => (
        <TouchableOpacity key={page.label} onPress={() => setUrl(page.url)} style={styles.navButton}>
          <Text style={styles.navText}>{page.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          {renderNavBar()}
          <iframe
            src={url}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Connect2Black"
            />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {renderNavBar()}
        {isError ? (
          <View style={styles.errorContainer}>
            <Image
              source={require('../assets/error.png')}
              style={styles.image}
              resizeMode="contain"
              />
            <Text style={styles.errorText}>Oops! No Internet Connection</Text>
            <Button title="Try Again" onPress={reloadWebView} />
          </View>
        ) : (
          <WebView
          key={webKey}
          source={{ uri: url }}
          style={{ flex: 1 }}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          onError={() => setIsError(true)}
          onHttpError={() => setIsError(true)}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


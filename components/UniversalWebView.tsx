import React, { useRef, useEffect, useState } from "react";
import { Platform, StyleSheet, View, BackHandler, TouchableOpacity } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import Loader from "./Loader";

type Props = {
  uri: string;
  onError?: () => void;
  renderLoading?: () => React.ReactNode;
};

export default function UniversalWebView({ uri, onError, renderLoading }: Props) {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });

    return () => handler.remove();
  }, [canGoBack]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude, accuracy } = loc.coords;

      const js = `
        (function() {
          const pos = {
            coords: {
              latitude: ${latitude},
              longitude: ${longitude},
              accuracy: ${accuracy},
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            },
            timestamp: ${loc.timestamp},
          };
          navigator.geolocation.getCurrentPosition = (success) => success(pos);
          navigator.geolocation.watchPosition = (success) => { success(pos); return 0; };
        })();
        true;
      `;

      webViewRef.current?.injectJavaScript(js);
    })();
  }, []);

  if (Platform.OS === "web") {
    return (
      <iframe
        src={uri}
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri }}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
        geolocationEnabled
        startInLoadingState
        cacheEnabled={false}
        cacheMode="LOAD_NO_CACHE"
        mixedContentMode="always"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo={true}
        onError={onError}
        onHttpError={onError}
        renderLoading={() => <Loader />}
        onNavigationStateChange={(state: WebViewNavigation) => setCanGoBack(state.canGoBack)}
        allowsBackForwardNavigationGestures={true}
        injectedJavaScript={`
          (function() {
            window.dispatchEvent(new Event('resize'));
            window.scrollTo(0, 1);
            window.scrollTo(0, 0);
            window.dispatchEvent(new Event('load'));
          })();
          true;
        `}
      />

      <TouchableOpacity
        onPress={() => webViewRef.current?.goBack()}
        disabled={!canGoBack}
        style={[styles.backButton, !canGoBack && { opacity: 0.3 }]}
      >
        <Ionicons name="arrow-back" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
});
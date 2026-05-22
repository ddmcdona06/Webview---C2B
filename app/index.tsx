import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import { styles } from "../styles/Appstyles";
import UniversalWebView from "../components/UniversalWebView";
import Loader from "../components/Loader";

// Nav bar links
const nav = [
  { label: "Home", url: "https://www.connect2black.com" },
  {
    label: "Entertainment",
    url: "https://www.connect2black.com/travel-agency-entertainment",
  },
  {
    label: "Food",
    url: "https://www.connect2black.com/travel-agency-food",
  },
];

export default function MainScreen() {
  const [url, setUrl] = useState(nav[0].url);
  const [hasError, setHasError] = useState(false);

  const renderNavBar = () => (
    <View style={styles.navBar}>
      {nav.map((page) => (
        <TouchableOpacity
          key={page.label}
          onPress={() => {
            setUrl(page.url);
            setHasError(false);
          }}
          style={styles.navButton}
        >
          <Text style={styles.navText}>{page.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderNavBar()}
      {hasError ? (
        <View style={styles.errorContainer}>
          <Image
            source={require("../assets/error.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.errorText}>Oops! No Internet Connection</Text>
          <Button title="Try Again" onPress={() => setHasError(false)} />
        </View>
      ) : (
        <UniversalWebView
          uri={url}
          onError={() => setHasError(true)}
          renderLoading={() => <Loader />}
        />
      )}
    </SafeAreaView>
  );
}

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../styles/Appstyles';

type Props = {
  onRetry: () => void;
};

export default function ErrorFallback({ onRetry }: Props) {
  return (
    <View style={styles.errorContainer}>
      <Image
        source={require('../assets/error.png')}
        style={styles.errorImage}
        resizeMode="contain"
      />
      <Text style={styles.errorText}>Something went wrong.</Text>
      <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}
//C:\Users\ddmcd\AppData\Local\Android\sdk
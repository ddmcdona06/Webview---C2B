import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styles } from '../styles/Appstyles';

export default function Loader() {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#000000" />
    </View>
  );
}

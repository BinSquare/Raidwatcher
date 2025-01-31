import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
<ParallaxScrollView
  headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
  headerImage={
    <Image
      source={require('@/assets/images/partial-react-logo.png')}
      style={styles.reactLogo}
    />
  }
>
  <ThemedView style={styles.titleContainer}>
    <ThemedText type="title">Welcome to RaidWatcher</ThemedText>
    <HelloWave />
  </ThemedView>

  <ThemedView style={styles.stepContainer}>
    <ThemedText type="subtitle">
      Crowd-driven map to track and report potential ICE/police raids.
    </ThemedText>
  </ThemedView>

  <ThemedView style={styles.stepContainer}>
    <ThemedText type="defaultSemiBold"> Free. No strings attached. </ThemedText>
    <ThemedText>
      100% free to use, forever. No ads. No selling data.
    </ThemedText>
  </ThemedView>

  <ThemedView style={styles.stepContainer}>
    <ThemedText type="defaultSemiBold"> Private and secure by default. </ThemedText>
    <ThemedText>
      We respect privacy and this app does not store any personal or location data.
    </ThemedText>
    <ThemedText>
      Any reports you submit cannot be
      traced back to you or any other individual user.
    </ThemedText>
  </ThemedView>

  <ThemedView style={styles.stepContainer}>
    <ThemedText type="defaultSemiBold"> Open Source. </ThemedText>
    <ThemedText>
      This project is built and ran by volunteers. It's open source with MIT license.
    </ThemedText>
    <ThemedText>
      Interested in contributing? Check out the repository to see how you can help:
    </ThemedText>
  </ThemedView>
</ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

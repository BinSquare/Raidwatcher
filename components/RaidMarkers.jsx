import React from 'react';
import { View, StyleSheet } from "react-native";
import { Marker, Callout } from 'react-native-maps';
import { ThemedText } from '../components/ThemedText';

const RaidMarkers = ({ markers, isSelectingLocation, selectedRegion, animatedMarkerCoordinate }) => {
  return (
    <>
      {markers.map((marker) => (
        <Marker key={marker.id} coordinate={marker.coordinate}>
          <Callout>
            <View style={styles.calloutContainer}>
              <ThemedText style={styles.calloutTitle}>{marker.title}</ThemedText>
              <ThemedText style={styles.calloutText}>
                Location: {marker.location_name || "Unknown"}
              </ThemedText>
              <ThemedText style={styles.calloutText}>
                Reported: {marker.report_time ? new Date(marker.report_time).toLocaleString() : "Unknown"}
              </ThemedText>
              <ThemedText style={styles.calloutText}>
                Description: {marker.description || "No description provided"}
              </ThemedText>
              <ThemedText style={styles.calloutText}>
                Size: {marker.size || "Unknown"}
              </ThemedText>
            </View>
          </Callout>
        </Marker>
      ))}

      {isSelectingLocation && (
        // Use Marker.Animated so that the marker smoothly follows the animated coordinate.
        <Marker.Animated 
          coordinate={animatedMarkerCoordinate}
          pinColor="orange"
        />      )}
    </>
  );
};

const styles = StyleSheet.create({
  calloutContainer: {
    width: 220,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 3,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  calloutText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
});


export default RaidMarkers;
import React from 'react';
import { View, StyleSheet } from "react-native";
import { Marker, Callout } from 'react-native-maps';
import { ThemedText } from '../components/ThemedText';

const RaidMarkers = ({ markers, isSelectingLocation, selectedRegion, animatedMarkerCoordinate }) => {
  return (
    <>
      {markers.map((marker) => {
        const reportDate = marker.report_time ? new Date(marker.report_time) : null;
        const isStale = reportDate ? (new Date() - reportDate) > 86400000 : false; // 24 hrs = 86,400,000 ms
        return (
          <Marker key={marker.id} coordinate={marker.coordinate}>
            <Callout>
              <View style={styles.calloutContainer}>
                <ThemedText style={styles.calloutTitle}>{marker.title}</ThemedText>
                <ThemedText style={styles.calloutText}>
                  Location: {marker.location_name || "Unknown"}
                </ThemedText>
                <ThemedText style={styles.calloutText}>
                  Reported: {reportDate ? reportDate.toLocaleString() : "Unknown"}
                </ThemedText>
                {isStale && (
                  <ThemedText style={styles.staleText}>
                    Report is older than 24 hrs
                  </ThemedText>
                )}
                <ThemedText style={styles.calloutText}>
                  Description: {marker.description || "No description provided"}
                </ThemedText>
                <ThemedText style={styles.calloutText}>
                  Size: {marker.size || "Unknown"}
                </ThemedText>
              </View>
            </Callout>
          </Marker>
        );
      })}

      {isSelectingLocation && (
        // Use Marker.Animated so that the marker smoothly follows the animated coordinate.
        <Marker.Animated 
          coordinate={animatedMarkerCoordinate}
          pinColor="orange"
        />
      )}
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
  staleText: {
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
    marginTop: 4,
  },
});

export default RaidMarkers;
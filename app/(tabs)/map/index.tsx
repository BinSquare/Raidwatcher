import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';

import { Ionicons } from '@expo/vector-icons';

import { supabase } from '@/utils/supabase';
import ReportActivityModal from '@/components/ReportActivityModal';
import FloatingSearchBar from '@/components/FloatingSearchBar';
import RaidMarkers from '@/components/RaidMarkers';
import { ThemedText } from '@/components/ThemedText';
import { INITIAL_REGION } from '@/constants/Strings';


export default function TabMap() {
  const [markers, setMarkers] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [raidDetails, setRaidDetails] = useState('');
  const [region, setRegion] = useState(INITIAL_REGION);
  const [previousRegion, setPreviousRegion] = useState(INITIAL_REGION);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const mapRef = useRef(null);

  // Create an AnimatedRegion for the new marker.
  const animatedMarker = useRef(
    new AnimatedRegion({
      latitude: INITIAL_REGION.latitude,
      longitude: INITIAL_REGION.longitude,
      latitudeDelta: INITIAL_REGION.latitudeDelta,
      longitudeDelta: INITIAL_REGION.longitudeDelta,
    })
  ).current;

  useEffect(() => {
    fetchMarkersFromSupabase();
  }, []);

  const fetchMarkersFromSupabase = async () => {
    console.log("Fetching markers...");
    try {
      const { data, error } = await supabase.from("raid_reports").select("*");
      if (error) {
        console.error(error);
        Alert.alert("Error", "Could not fetch raid reports.");
      } else {
        console.log("Markers fetched:", data.length);
        setMarkers(
          data
            .filter(item => item.latitude != null && item.longitude != null)
            .map(item => ({
              id: item.id,
              title: item.activity,
              description: item.description,
              location_name: item.location_name,
              report_time: item.report_time,
              size: item.size,
              coordinate: {
                latitude: Number(item.latitude),
                longitude: Number(item.longitude),
              },
            }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddPress = () => {
    setPreviousRegion(region);
    setIsSelectingLocation(true);
  };

  const confirmLocation = () => {
    console.log("Confirm button tapped!");
    setSelectedLocation({
      latitude: region.latitude,
      longitude: region.longitude,
    });
    setIsSelectingLocation(false);
    setModalVisible(true);
  };

  const cancelLocationSelection = () => {
    setIsSelectingLocation(false);
    if (mapRef.current) {
      mapRef.current.animateToRegion(previousRegion, 1000);
    }
    setRegion(previousRegion);
  };

  const handleLocationSelected = (location) => {
    console.log("Updating map to:", location);
    const newRegion = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
    setRegion(newRegion);
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }
    animatedMarker.setValue({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    });
  };

  const handleConfirmAndSave = async (reportData) => {
    if (!reportData.latitude || !reportData.longitude || !reportData.description) {
      Alert.alert("Error", "Please enter details before saving.");
      return;
    }
    try {
      console.log("Saving marker to Supabase...");
      const { data, error } = await supabase
        .from("raid_reports")
        .insert([
          {
            latitude: reportData.latitude,
            longitude: reportData.longitude,
            activity: reportData.activity,
            size: reportData.size,
            location_name: reportData.location_name,
            description: reportData.description,
            report_time: reportData.report_time,
            verified: reportData.verified,
          },
        ])
        .select();
      if (error) {
        Alert.alert("Error", "Failed to save report.");
        console.error(error);
      } else {
        Alert.alert("Success", "ICE raid reported.");
        setMarkers(data.map((item) => ({
          id: item.id,
          title: item.activity,
          description: item.description,
          location_name: item.location_name,
          report_time: item.report_time,
          size: item.size,
          coordinate: {
            latitude: Number(item.latitude),
            longitude: Number(item.longitude),
          },
        })));
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setRaidDetails('');
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <FloatingSearchBar onLocationSelected={handleLocationSelected} />

      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChange={(updatedRegion) => {
          if (isSelectingLocation) {
            // Smoothly update the animated marker without updating state
            animatedMarker.setValue({
              latitude: updatedRegion.latitude,
              longitude: updatedRegion.longitude,
            });
            // Do not update the region state here to avoid re-renders
          }
        }}
        onRegionChangeComplete={(updatedRegion) => {
          setRegion(updatedRegion);
        }}
      >
        <RaidMarkers
          markers={markers}
          isSelectingLocation={isSelectingLocation}
          selectedRegion={region}
          animatedMarkerCoordinate={animatedMarker}
        />
      </MapView>

      {isSelectingLocation && (
        <View style={styles.noteContainer}>
          <ThemedText style={styles.noteText}>
            Drag the map to move the new pin.
          </ThemedText>
        </View>
      )}

      {!isSelectingLocation && (
        <TouchableOpacity style={styles.fab} onPress={handleAddPress}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {isSelectingLocation && (
        <View style={styles.selectionButtonsContainer}>
          <TouchableOpacity style={styles.confirmBtn} onPress={confirmLocation}>
            <ThemedText style={{ color: "#fff" }}>Confirm Location</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={cancelLocationSelection}>
            <ThemedText style={{ color: "#fff" }}>Cancel</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      <ReportActivityModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleConfirmAndSave}
        initialLatitude={selectedLocation?.latitude ?? region.latitude}
        initialLongitude={selectedLocation?.longitude ?? region.longitude}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#2196F3",
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  selectionButtonsContainer: {
    position: "absolute",
    bottom: 100,
    left: "50%",
    transform: [{ translateX: -100 }],
    flexDirection: "row",
    zIndex: 999,
  },
  confirmBtn: {
    backgroundColor: "#008000",
    borderRadius: 25,
    padding: 10,
    marginRight: 10,
  },
  cancelBtn: {
    backgroundColor: "#FF0000",
    borderRadius: 25,
    padding: 10,
  },
  noteContainer: {
    position: "absolute",
    bottom: 200,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 999,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  noteText: {
    color: "#fff",
    fontSize: 14,
  },
});

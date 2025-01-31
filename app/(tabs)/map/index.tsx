import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, Modal, StyleSheet, TextInput, View } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { ThemedText } from '@/components/ThemedText';
import { supabase } from '@/utils/supabase';


const INITIAL_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};
export default function TabMap() {
  const [markers, setMarkers] = useState([]); // Markers from Supabase
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [raidDetails, setRaidDetails] = useState('');
  const [loading, setLoading] = useState(true);

  /** 🔄 Fetch Markers from Supabase */
  useEffect(() => {
    fetchMarkersFromSupabase();
  }, []);

  const fetchMarkersFromSupabase = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('raid_reports').select('*');

    if (error) {
      Alert.alert('Error', 'Could not fetch raid reports.');
      console.error(error);
    } else {
      // Transform Supabase data into marker format
      const formattedMarkers = data.map((item) => ({
        id: item.id,
        title: 'ICE Raid Reported',
        description: item.details,
        coordinate: {
          latitude: item.latitude,
          longitude: item.longitude,
        },
      }));
      setMarkers(formattedMarkers);
    }
    setLoading(false);
  };

  /** 🆕 User taps the map to report an ICE raid */
  const handleMapPress = (event) => {
    setSelectedLocation(event.nativeEvent.coordinate);
    setModalVisible(true);
  };

  /** 🔥 Save Marker to Supabase */
  const saveMarkerToSupabase = async () => {
    if (!selectedLocation || raidDetails.trim() === '') return;

    const { data, error } = await supabase.from('ice_raids').insert([
      {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        details: raidDetails,
      },
    ]);

    if (error) {
      Alert.alert('Error', 'Failed to save report.');
      console.error(error);
    } else {
      Alert.alert('Success', 'ICE raid reported.');
      // Update local markers immediately
      setMarkers((prevMarkers) => [
        ...prevMarkers,
        {
          id: data[0].id, // Assuming Supabase returns the ID
          title: 'ICE Raid Reported',
          description: raidDetails,
          coordinate: selectedLocation,
        },
      ]);
    }

    // Reset modal inputs and close modal
    setRaidDetails('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView style={styles.map} initialRegion={INITIAL_REGION} onPress={handleMapPress}>
        {markers.map((marker) => (
          <Marker key={marker.id} coordinate={marker.coordinate} title={marker.title}>
            <Callout>
              <View style={styles.calloutContainer}>
                <ThemedText style={styles.calloutTitle}>{marker.title}</ThemedText>
                <ThemedText style={styles.calloutDescription}>{marker.description}</ThemedText>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />}

      {/* Modal for Reporting an ICE Raid */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Report ICE Raid</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Details about the raid..."
              value={raidDetails}
              onChangeText={setRaidDetails}
            />
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
              <Button title="Submit Report" onPress={saveMarkerToSupabase} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/** 📌 Styles */
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  calloutContainer: { width: 200, padding: 5 },
  calloutTitle: { fontSize: 16, fontWeight: 'bold' },
  calloutDescription: { fontSize: 14 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  loading: { position: 'absolute', top: '50%', left: '50%' },
});

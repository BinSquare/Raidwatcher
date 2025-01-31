import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { supabase } from '@/utils/supabase';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function RaidReportsList() {
  const [reports, setReports] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [raidDetails, setRaidDetails] = useState('');
  const [loading, setLoading] = useState(true);

  /** 🔄 Fetch Reports from Supabase */
  useEffect(() => {
    fetchReportsFromSupabase();
  }, []);

  const fetchReportsFromSupabase = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('raid_reports').select('*');

    if (error) {
      Alert.alert('Error', 'Could not fetch raid reports.');
      console.error(error);
    } else {
      console.log(data);
      setReports(data || []);
    }
    setLoading(false);
  };

  /** 🔥 Save Report to Supabase */
  const saveReportToSupabase = async () => {
    if (raidDetails.trim() === '') return;

    const { data, error } = await supabase.from('raid_reports').insert([
      { details: raidDetails },
    ]).select();

    if (error) {
      Alert.alert('Error', 'Failed to save report.');
      console.error(error);
    } else {
      Alert.alert('Success', 'ICE raid reported.');
      setReports((prevReports) => [...prevReports, data[0]]);
    }

    setRaidDetails('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        ListHeaderComponent={
            <View style={{ height: 120 }}>
                <ParallaxScrollView
                    headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
                    headerImage={
                    <Image
                        source={require('@/assets/images/partial-react-logo.png')}
                        style={styles.reactLogo}
                    />
                    }
                />
            </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
          ) : (
            <ThemedText style={styles.emptyText}>No reports available</ThemedText>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.reportItem}>
            <ThemedText style={styles.reportText}>
              {item.activity} 
            </ThemedText>
            <ThemedText style={styles.reportSubText}>
                Location: {item.location_name}
            </ThemedText>
            <ThemedText style={styles.reportSubText}>
              Reported: {item.report_time ? new Date(item.report_time).toLocaleString() : 'Unknown'}
            </ThemedText>
            <ThemedText style={styles.reportSubText}>Description: {item.description || 'No description provided'}</ThemedText>
            <ThemedText style={styles.reportSubText}>Size: {item.size || 'Unknown'}</ThemedText>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <ThemedText style={styles.addButtonText}>Report ICE Raid</ThemedText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


/** 📌 Styles */
const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    headerContainer: { alignItems: 'center', justifyContent: 'center', height: 120 },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
      },
    reportItem: {
      padding: 15,
      marginVertical: 8,
      backgroundColor: '#f9f9f9',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    reportText: { fontSize: 16, fontWeight: 'bold' },
    reportSubText: { fontSize: 14, color: '#555' },
    addButton: {
      backgroundColor: '#007bff',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 10,
    },
    addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
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
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { supabase } from '@/utils/supabase';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function RaidReportsList() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAscending, setIsAscending] = useState(false); // Tracks sorting order

  /** 🔄 Fetch Reports from Supabase */
  useEffect(() => {
    fetchReportsFromSupabase();
  }, []);

  const fetchReportsFromSupabase = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('raid_reports')
      .select('*')
      .order('report_time', { ascending: false }); // Default: Show newest first

    if (error) {
      console.error(error);
    } else {
      setReports(data || []);
      setFilteredReports(data || []);
    }
    setLoading(false);
  };

  /** 🔄 Toggles sorting order */
  const sortReportsByTime = () => {
    const sortedData = [...filteredReports].sort((a, b) => {
      return isAscending
        ? new Date(a.report_time) - new Date(b.report_time) // Ascending (Oldest first)
        : new Date(b.report_time) - new Date(a.report_time); // Descending (Newest first)
    });

    setFilteredReports(sortedData);
    setIsAscending(!isAscending); // Toggle sorting order
  };

  /** 🔍 Handles search filtering */
  const handleSearch = (query) => {
    setSearchQuery(query);
    filterReports(query, selectedFilter);
  };

  /** 🎯 Filters based on search query & dropdown selection */
  const filterReports = (query, filter) => {
    let filteredData = reports;

    if (query) {
      filteredData = filteredData.filter((item) =>
        item.activity.toLowerCase().includes(query.toLowerCase()) ||
        item.location_name.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filter) {
      filteredData = filteredData.filter((item) => item.activity === filter);
    }

    setFilteredReports(filteredData);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={filteredReports}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        ListHeaderComponent={
          <>
            <View style={{ height: 100 }}>
              <ParallaxScrollView
                headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
                headerImage={
                  <Image
                    source={require('@/assets/images/togetherness-again.jpg')}
                    style={styles.reactLogo} />
                }
              />
            </View>

            {/* Search Input */}
            <View style={styles.searchAndSortContainer}>
              {/* Search Input */}
              <TextInput
                style={styles.searchInput}
                placeholder="Search by activity or location..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={handleSearch}
              />

              {/* Sorting Button */}
              <TouchableOpacity style={styles.sortButton} onPress={sortReportsByTime}>
                <Ionicons
                  name={isAscending ? 'arrow-up' : 'arrow-down'}
                  size={18}
                  color="#fff"
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.sortButtonText}>
                  {isAscending ? 'Oldest' : 'Newest'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
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
            <ThemedText style={styles.reportText}>{item.activity}</ThemedText>
            <ThemedText style={styles.reportSubText}>Location: {item.location_name}</ThemedText>
            <ThemedText style={styles.reportSubText}>
              Reported: {item.report_time ? new Date(item.report_time).toLocaleString() : 'Unknown'}
            </ThemedText>
            <ThemedText style={styles.reportSubText}>
              Description: {item.description || 'No description provided'}
            </ThemedText>
            <ThemedText style={styles.reportSubText}>Size: {item.size || 'Unknown'}</ThemedText>
          </View>
        )}
      />
    </SafeAreaView>
  );
}


/* 🛠 Styles */
const styles = StyleSheet.create({
  searchAndSortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1, // Takes up remaining space
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10, // Space between search and button
  },
  sortButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 20,
    alignSelf: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  reportItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  reportText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reportSubText: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  reactLogo: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});
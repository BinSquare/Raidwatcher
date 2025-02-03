import React, { useEffect, useRef } from 'react';
import { Dimensions, View, StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';

const { height } = Dimensions.get("window");
const SEARCH_BAR_TOP = height * 0.08; // 8% of screen height



const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.GOOGLE_MAPS_API_KEY

if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key is not configured');
    Alert.alert('Configuration Error', 'Google Maps API key is not set');
}


const FloatingSearchBar = ({ onLocationSelected }) => {
    return (
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <GooglePlacesAutocomplete
          placeholder="Search for a location..."
          minLength={1} // Show results faster
          fetchDetails={true}
          debounce={500} // Prevents API rate limit
          onPress={(data, details = null) => {
            console.log("onPress triggered");
            if (details) {
              const location = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              };
              onLocationSelected(location);
            }
          }}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: "en",
            components: "country:us", // Restrict to US (modify if needed)
          }}
          GooglePlacesDetailsQuery={{
            fields: "geometry,place_id" // Only fetch these details
          }}
          styles={{
            container: styles.searchBoxContainer,
            textInput: styles.searchInput,
            listView: styles.listView,
          }}
        />
      </View>
    );
  };
  
const styles = StyleSheet.create({
    searchContainer: {
        position: "absolute",
        top: SEARCH_BAR_TOP, // Ensure it's not hidden under status bar
        left: 10,
        right: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 30, // More rounded corners
        paddingHorizontal: 15,
        height: 50, // Adjusted height
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 4, // For Android shadow
        zIndex: 999,
    },
    searchBoxContainer: {
        flex: 1, // Ensures it takes space
    },
    searchInput: {
        flex: 1, // Ensures input expands properly
        backgroundColor: "#fff",
        fontSize: 16,
        borderRadius: 30, // More rounded corners
        paddingHorizontal: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    listView: {
        position: "absolute",
        top: 50,
        zIndex: 1000,
        backgroundColor: "#fff",
    },
});


export default FloatingSearchBar;
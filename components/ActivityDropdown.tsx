import React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const ActivityDropdown = ({ activity, setActivity, options = [] }) => {
  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={activity}
        onValueChange={(itemValue) => setActivity(itemValue)}
        style={styles.picker}
        itemStyle={styles.pickerItem} // Set the itemStyle to customize the text appearance
      >
        {options.map((option) => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    height: 200, // Adjust height as needed for a better look
    width: "100%",
  },
  pickerItem: {
    fontSize: 18,    // Adjust font size as needed
    color: "#000",   // Dark text color for improved contrast
  },
});


export default ActivityDropdown;
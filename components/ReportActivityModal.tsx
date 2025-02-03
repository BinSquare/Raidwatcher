import React, { useState } from 'react';
import {
  View,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import DateTimePicker from '@react-native-community/datetimepicker'; // Date & Time Picker
import ActivityDropdown from './ActivityDropdown';
import { ACTIVITY_OPTIONS } from '@/constants/Strings';

const ReportActivityModal = ({
  isVisible,
  onClose,
  onSubmit,
  initialLatitude,
  initialLongitude,
}) => {
  const options = ACTIVITY_OPTIONS || [];
  const [activity, setActivity] = useState(options.length ? options[0].value : "");
  const [size, setSize] = useState("");
  const [locationName, setLocationName] = useState("");
  const [description, setDescription] = useState("");
  const [reportTime, setReportTime] = useState(new Date().toISOString());
  // Temporary state for the date/time while the picker is open.
  const [tempReportTime, setTempReportTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    if (!activity || !locationName || !description) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const reportData = {
      activity,
      size: size ? parseInt(size, 10) : undefined,
      location_name: locationName,
      latitude: initialLatitude,
      longitude: initialLongitude,
      description,
      report_time: reportTime,
      verified: false,
    };

    onSubmit(reportData);
    resetForm();
  };

  const resetForm = () => {
    setActivity(options[0].value);
    setSize("");
    setLocationName("");
    setDescription("");
    const now = new Date();
    setReportTime(now.toISOString());
    setTempReportTime(now);
  };

  const confirmDateTime = () => {
    // When confirmed, update the reportTime and close the picker.
    setReportTime(tempReportTime.toISOString());
    setShowDatePicker(false);
  };

  const cancelDateTime = () => {
    // Simply close the picker without saving changes.
    setShowDatePicker(false);
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>Report ICE Activity</ThemedText>

          <ScrollView>
            {/* Activity Selection */}
            <ActivityDropdown activity={activity} setActivity={setActivity} options={ACTIVITY_OPTIONS} />

            {/* Size (Optional) */}
            <TextInput
              style={styles.input}
              placeholder="Number of agents (optional)"
              placeholderTextColor="#555"
              value={size}
              onChangeText={setSize}
              keyboardType="numeric"
            />

            {/* Location Name */}
            <TextInput
              style={styles.input}
              placeholder="Location Name"
              placeholderTextColor="#555"
              value={locationName}
              onChangeText={setLocationName}
            />

            {/* Description */}
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Description"
              placeholderTextColor="#555"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            {/* Date & Time Picker */}
            <Button
              title={`Report Time: ${new Date(reportTime).toLocaleString()}`}
              onPress={() => {
                // Set the temporary date to the current reportTime before showing picker.
                setTempReportTime(new Date(reportTime));
                setShowDatePicker(true);
              }}
            />
            {showDatePicker && (
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={tempReportTime}
                  mode="datetime"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(_, selectedDate) => {
                    if (selectedDate) {
                      setTempReportTime(selectedDate);
                    }
                  }}
                />
                <View style={styles.pickerButtonContainer}>
                  <Button title="Confirm" onPress={confirmDateTime} />
                  <Button title="Cancel" onPress={cancelDateTime} color="red" />
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} color="red" />
            <Button title="Submit Report" onPress={handleSubmit} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ReportActivityModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    color: "#000",
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  datePickerContainer: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  pickerButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});
export default ReportActivityModal;
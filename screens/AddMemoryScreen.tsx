"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Platform } from "react-native"
import { useMemories } from "../context/MemoryContext"
import { useCategories } from "../context/CategoryContext"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import DateTimePicker from "@react-native-community/datetimepicker"
import { format } from "date-fns"

const AddMemoryScreen = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [locationName, setLocationName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { addMemory } = useMemories()
  const { categories } = useCategories()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const route = useRoute()

  // Check if a category was passed from the category detail screen
  useEffect(() => {
    if (route.params?.categoryId) {
      setSelectedCategoryId(route.params.categoryId)
    }
  }, [route.params])

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need camera roll permissions to upload images")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      setImageUri(result.assets[0].uri)
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need camera permissions to take photos")
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      setImageUri(result.assets[0].uri)
    }
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios")
    if (selectedDate) {
      setDate(selectedDate)
    }
  }

  const handleSaveMemory = async () => {
    if (!title) {
      Alert.alert("Error", "Please enter a title for your memory")
      return
    }

    if (!imageUri) {
      Alert.alert("Error", "Please select an image for your memory")
      return
    }

    if (!selectedCategoryId) {
      Alert.alert("Error", "Please select a category for your memory")
      return
    }

    setIsLoading(true)
    try {
      // In a real app, you'd upload the image to a server here
      // For this demo, we'll just use the local URI

      const memoryData = {
        title,
        description,
        imageUri,
        date: format(date, "yyyy-MM-dd"),
        categoryId: selectedCategoryId,
        ...(locationName
          ? {
              location: {
                latitude: 0, // In a real app, you'd get actual coordinates
                longitude: 0,
                name: locationName,
              },
            }
          : {}),
      }

      const newMemory = await addMemory(memoryData)

      // Navigate back to the previous screen or to the memory detail
      if (route.params?.fromCategoryDetail) {
        navigation.navigate("CategoryDetail", {
          category: route.params.category,
          refresh: true,
        })
      } else {
        navigation.navigate("MemoryDetail", { memoryId: newMemory.id })
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save memory")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#8b5a2b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Memory</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="image-outline" size={80} color="#ccc" />
            <Text style={styles.placeholderText}>Add an image</Text>
          </View>
        )}
        <View style={styles.imageButtonsContainer}>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Ionicons name="images-outline" size={20} color="#fff" />
            <Text style={styles.imageButtonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
            <Ionicons name="camera-outline" size={20} color="#fff" />
            <Text style={styles.imageButtonText}>Camera</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter a title for your memory"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your memory..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
          <Text>{format(date, "MMMM d, yyyy")}</Text>
          <Ionicons name="calendar-outline" size={20} color="#666" />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} maximumDate={new Date()} />
        )}

        <Text style={styles.label}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategoryId === category.id && styles.selectedCategoryChip,
                { backgroundColor: selectedCategoryId === category.id ? category.color : "#f0f0f0" },
              ]}
              onPress={() => setSelectedCategoryId(category.id)}
            >
              <Text
                style={[styles.categoryChipText, selectedCategoryId === category.id && styles.selectedCategoryChipText]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Location (Optional)</Text>
        <TextInput
          style={styles.input}
          value={locationName}
          onChangeText={setLocationName}
          placeholder="Enter a location"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveMemory} disabled={isLoading}>
          <Text style={styles.saveButtonText}>{isLoading ? "Saving..." : "Save Memory"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f5e4", // Vintage paper color
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#f0ead6", // Lighter vintage paper
    borderBottomWidth: 1,
    borderBottomColor: "#d4c7a5",
    marginTop: 40, // Add top margin for status bar
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8b5a2b", // Vintage brown
    fontFamily: "serif",
  },
  backButton: {
    padding: 4,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  previewImage: {
    width: "90%",
    height: 200,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#d4c7a5",
  },
  placeholderImage: {
    width: "90%",
    height: 200,
    borderRadius: 8,
    backgroundColor: "#f0ead6", // Lighter vintage paper
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d4c7a5",
    borderStyle: "dashed",
  },
  placeholderText: {
    marginTop: 8,
    color: "#7d6c46",
    fontFamily: "serif",
  },
  imageButtonsContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8b5a2b", // Vintage brown
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#6d4520",
  },
  imageButtonText: {
    color: "#f8f5e4", // Vintage paper color
    marginLeft: 8,
    fontFamily: "serif",
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#8b5a2b", // Vintage brown
    fontFamily: "serif",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d4c7a5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fffdf7", // Light cream
    fontFamily: "serif",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#d4c7a5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    minHeight: 100,
    backgroundColor: "#fffdf7", // Light cream
    fontFamily: "serif",
  },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d4c7a5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fffdf7", // Light cream
  },
  categoriesContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#d4c7a5",
  },
  selectedCategoryChip: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  categoryChipText: {
    color: "#7d6c46",
    fontFamily: "serif",
  },
  selectedCategoryChipText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "serif",
  },
  saveButton: {
    backgroundColor: "#8b5a2b", // Vintage brown
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#6d4520",
  },
  saveButtonText: {
    color: "#f8f5e4", // Vintage paper color
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "serif",
  },
})

export default AddMemoryScreen

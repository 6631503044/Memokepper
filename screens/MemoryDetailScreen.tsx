"use client"

import { useEffect, useState } from "react"
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from "react-native"
import { useMemories, type Memory } from "../context/MemoryContext"
import { useCategories } from "../context/CategoryContext"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { format } from "date-fns"

const MemoryDetailScreen = () => {
  const [memory, setMemory] = useState<Memory | null>(null)
  const { getMemoryById, deleteMemory } = useMemories()
  const { getCategoryById } = useCategories()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const route = useRoute()
  const memoryId = route.params?.memoryId

  useEffect(() => {
    if (memoryId) {
      const foundMemory = getMemoryById(memoryId)
      if (foundMemory) {
        setMemory(foundMemory)
      } else {
        Alert.alert("Error", "Memory not found")
        navigation.goBack()
      }
    }
  }, [memoryId, getMemoryById])

  const handleDelete = () => {
    Alert.alert("Delete Memory", "Are you sure you want to delete this memory? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (memory) {
            const success = await deleteMemory(memory.id)
            if (success) {
              navigation.goBack()
            } else {
              Alert.alert("Error", "Failed to delete memory")
            }
          }
        },
      },
    ])
  }

  const handleShare = async () => {
    if (!memory) return

    try {
      await Share.share({
        message: `Check out my memory: ${memory.title}\n\n${memory.description}`,
        // In a real app, you'd include a URL to the memory or the image
      })
    } catch (error) {
      Alert.alert("Error", "Failed to share memory")
    }
  }

  if (!memory) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    )
  }

  const category = memory.categoryId ? getCategoryById(memory.categoryId) : null
  const formattedDate = format(new Date(memory.date), "MMMM d, yyyy")

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#8b5a2b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Memory Details</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.imageFrame}>
        <Image source={{ uri: memory.imageUri }} style={styles.image} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{memory.title}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={22} color="#8b5a2b" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                navigation.navigate("AddMemory", {
                  editMode: true,
                  memory,
                })
              }
            >
              <Ionicons name="pencil-outline" size={22} color="#8b5a2b" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={22} color="#b25d56" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color="#7d6c46" />
            <Text style={styles.metaText}>{formattedDate}</Text>
          </View>

          {category && (
            <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
              <Text style={styles.categoryText}>{category.name}</Text>
            </View>
          )}
        </View>

        {memory.location && (
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#7d6c46" />
            <Text style={styles.locationText}>{memory.location.name}</Text>
          </View>
        )}

        <Text style={styles.description}>{memory.description}</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f5e4", // Vintage paper color
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f5e4", // Vintage paper color
  },
  imageFrame: {
    padding: 12,
    backgroundColor: "#fffdf7", // Light cream
    borderBottomWidth: 1,
    borderBottomColor: "#d4c7a5",
  },
  image: {
    width: "100%",
    height: 250,
    borderWidth: 1,
    borderColor: "#d4c7a5",
  },
  contentContainer: {
    padding: 16,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8b5a2b", // Vintage brown
    flex: 1,
    fontFamily: "serif",
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e0c5",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    marginLeft: 6,
    color: "#7d6c46",
    fontFamily: "serif",
    fontStyle: "italic",
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  categoryText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "serif",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  locationText: {
    marginLeft: 6,
    color: "#7d6c46",
    fontFamily: "serif",
    fontStyle: "italic",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#5c4d33",
    fontFamily: "serif",
  },
})

export default MemoryDetailScreen

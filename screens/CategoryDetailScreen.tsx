"use client"

import { useEffect, useState } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from "react-native"
import { useMemories, type Memory } from "../context/MemoryContext"
import { useCategories, type Category } from "../context/CategoryContext"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { format } from "date-fns"

const CategoryDetailScreen = () => {
  const [memories, setMemories] = useState<Memory[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const { getMemoriesByCategory } = useMemories()
  const { getCategoryById, deleteCategory } = useCategories()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const route = useRoute()

  useEffect(() => {
    const categoryFromRoute = route.params?.category
    if (categoryFromRoute) {
      setCategory(categoryFromRoute)
      const categoryMemories = getMemoriesByCategory(categoryFromRoute.id)
      setMemories(categoryMemories)
    } else {
      Alert.alert("Error", "Category not found")
      navigation.goBack()
    }
  }, [route.params, getMemoriesByCategory])

  // Refresh memories when returning from add memory screen
  useEffect(() => {
    if (route.params?.refresh && category) {
      const categoryMemories = getMemoriesByCategory(category.id)
      setMemories(categoryMemories)
    }
  }, [route.params?.refresh, category, getMemoriesByCategory])

  const handleDeleteCategory = () => {
    if (!category) return

    if (memories.length > 0) {
      Alert.alert(
        "Cannot Delete Category",
        "This category contains memories. Please delete or move the memories first.",
        [{ text: "OK" }],
      )
      return
    }

    Alert.alert("Delete Category", "Are you sure you want to delete this category? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (category) {
            const success = await deleteCategory(category.id)
            if (success) {
              navigation.goBack()
            } else {
              Alert.alert("Error", "Failed to delete category")
            }
          }
        },
      },
    ])
  }

  const renderMemoryItem = ({ item }: { item: Memory }) => (
    <TouchableOpacity
      style={styles.memoryItem}
      onPress={() => navigation.navigate("MemoryDetail", { memoryId: item.id })}
    >
      <Image source={{ uri: item.imageUri }} style={styles.memoryImage} />
      <View style={styles.memoryContent}>
        <Text style={styles.memoryTitle}>{item.title}</Text>
        <Text style={styles.memoryDate}>{format(new Date(item.date), "MMM d, yyyy")}</Text>
      </View>
    </TouchableOpacity>
  )

  if (!category) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={[styles.categoryHeader, { backgroundColor: category.color }]}>
        <View style={styles.categoryInfo}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Ionicons name="folder-open" size={24} color="#fff" />
          <Text style={styles.categoryName}>{category.name}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteCategory}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {memories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No memories in this category</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate("AddMemory", {
                categoryId: category.id,
                fromCategoryDetail: true,
                category,
              })
            }
          >
            <Text style={styles.addButtonText}>Add Memory to {category.name}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={memories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
          renderItem={renderMemoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate("AddMemory", {
            categoryId: category.id,
            fromCategoryDetail: true,
            category,
          })
        }
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
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
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#d4c7a5",
    marginTop: 40, // Add top margin for status bar
  },
  backButton: {
    marginRight: 12,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 8,
    fontFamily: "serif",
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7d6c46",
    marginTop: 16,
    marginBottom: 24,
    fontFamily: "serif",
  },
  addButton: {
    backgroundColor: "#8b5a2b", // Vintage brown
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6d4520",
  },
  addButtonText: {
    color: "#f8f5e4", // Vintage paper color
    fontWeight: "bold",
    fontFamily: "serif",
  },
  list: {
    padding: 16,
  },
  memoryItem: {
    flexDirection: "row",
    backgroundColor: "#fffdf7", // Light cream
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#d4c7a5",
  },
  memoryImage: {
    width: 80,
    height: 80,
    borderRightWidth: 1,
    borderRightColor: "#d4c7a5",
  },
  memoryContent: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  memoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#8b5a2b", // Vintage brown
    fontFamily: "serif",
  },
  memoryDate: {
    fontSize: 14,
    color: "#7d6c46",
    fontFamily: "serif",
    fontStyle: "italic",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#8b5a2b", // Vintage brown
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#6d4520",
  },
})

export default CategoryDetailScreen

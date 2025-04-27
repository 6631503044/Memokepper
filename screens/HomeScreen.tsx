"use client"

import { useState } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, SafeAreaView } from "react-native"
import { useMemories } from "../context/MemoryContext"
import { useCategories } from "../context/CategoryContext"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { format } from "date-fns"

const HomeScreen = () => {
  const { memories } = useMemories()
  const { categories } = useCategories()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const [viewMode, setViewMode] = useState<"timeline" | "grid">("timeline")

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : "Uncategorized"
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.color : "#999"
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (e) {
      return dateString
    }
  }

  const renderTimelineItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.timelineItem}
      onPress={() => navigation.navigate("MemoryDetail", { memoryId: item.id })}
    >
      <View style={styles.timelineContent}>
        <View style={styles.timelineHeader}>
          <Text style={styles.timelineDate}>{formatDate(item.date)}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.categoryId) }]}>
            <Text style={styles.categoryText}>{getCategoryName(item.categoryId)}</Text>
          </View>
        </View>
        <View style={styles.imageFrame}>
          <Image source={{ uri: item.imageUri }} style={styles.timelineImage} />
        </View>
        <Text style={styles.timelineTitle}>{item.title}</Text>
        <Text style={styles.timelineDescription} numberOfLines={2}>
          {item.description}
        </Text>
        {item.location && (
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color="#7d6c46" />
            <Text style={styles.locationText}>{item.location.name}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )

  const renderGridItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => navigation.navigate("MemoryDetail", { memoryId: item.id })}
    >
      <View style={styles.gridImageFrame}>
        <Image source={{ uri: item.imageUri }} style={styles.gridImage} />
      </View>
      <View style={[styles.gridCategoryBadge, { backgroundColor: getCategoryColor(item.categoryId) }]}>
        <Text style={styles.gridCategoryText}>{getCategoryName(item.categoryId)}</Text>
      </View>
      <View style={styles.gridContent}>
        <Text style={styles.gridTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.gridDate}>{formatDate(item.date)}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Memories</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.viewToggleButton, viewMode === "timeline" && styles.viewToggleButtonActive]}
            onPress={() => setViewMode("timeline")}
          >
            <Ionicons name="list" size={20} color={viewMode === "timeline" ? "#8b5a2b" : "#7d6c46"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewToggleButton, viewMode === "grid" && styles.viewToggleButtonActive]}
            onPress={() => setViewMode("grid")}
          >
            <Ionicons name="grid" size={20} color={viewMode === "grid" ? "#8b5a2b" : "#7d6c46"} />
          </TouchableOpacity>
        </View>
      </View>

      {memories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No memories yet</Text>
          <Text style={styles.emptySubtext}>Start capturing your precious moments</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddMemory")}>
            <Text style={styles.addButtonText}>Add Your First Memory</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={memories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
          renderItem={viewMode === "timeline" ? renderTimelineItem : renderGridItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={viewMode === "timeline" ? styles.timelineList : styles.gridList}
          numColumns={viewMode === "grid" ? 2 : 1}
          key={viewMode} // Force re-render when view mode changes
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("AddMemory")}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f5e4", // Vintage paper color
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#f0ead6", // Lighter vintage paper
    borderBottomWidth: 1,
    borderBottomColor: "#d4c7a5",
    marginTop: 40, // Add top margin for status bar
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8b5a2b", // Vintage brown
    fontFamily: "serif",
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "#e8e0c5",
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: "#d4c7a5",
  },
  viewToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewToggleButtonActive: {
    backgroundColor: "#f8f5e4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
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
    fontFamily: "serif",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#7d6c46",
    marginTop: 8,
    marginBottom: 24,
    textAlign: "center",
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
  timelineList: {
    padding: 16,
  },
  gridList: {
    padding: 8,
  },
  timelineItem: {
    backgroundColor: "#fffdf7", // Light cream
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#d4c7a5",
  },
  timelineContent: {
    padding: 16,
  },
  timelineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  timelineDate: {
    fontSize: 14,
    color: "#7d6c46",
    fontFamily: "serif",
    fontStyle: "italic",
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "serif",
  },
  imageFrame: {
    padding: 8,
    backgroundColor: "#fffdf7",
    borderWidth: 1,
    borderColor: "#d4c7a5",
    borderRadius: 4,
    marginBottom: 12,
  },
  timelineImage: {
    width: "100%",
    height: 200,
    borderRadius: 2,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#8b5a2b", // Vintage brown
    fontFamily: "serif",
  },
  timelineDescription: {
    fontSize: 14,
    color: "#7d6c46",
    marginBottom: 8,
    fontFamily: "serif",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    color: "#7d6c46",
    marginLeft: 4,
    fontFamily: "serif",
    fontStyle: "italic",
  },
  gridItem: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fffdf7", // Light cream
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#d4c7a5",
  },
  gridImageFrame: {
    borderBottomWidth: 1,
    borderBottomColor: "#d4c7a5",
  },
  gridImage: {
    width: "100%",
    height: 120,
  },
  gridCategoryBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  gridCategoryText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "serif",
  },
  gridContent: {
    padding: 12,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#8b5a2b", // Vintage brown
    fontFamily: "serif",
  },
  gridDate: {
    fontSize: 12,
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

export default HomeScreen

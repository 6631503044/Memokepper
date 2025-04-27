"use client"

import { useState } from "react"
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native"
import { useMemories, type Memory } from "../context/MemoryContext"
import { useCategories } from "../context/CategoryContext"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { format } from "date-fns"

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Memory[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const { searchMemories } = useMemories()
  const { categories } = useCategories()
  const navigation = useNavigation<StackNavigationProp<any>>()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const results = searchMemories(query)
      setSearchResults(results)
      setHasSearched(true)
    } else {
      setSearchResults([])
      setHasSearched(false)
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : "Uncategorized"
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.color : "#999"
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
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.categoryId) }]}>
          <Text style={styles.categoryText}>{getCategoryName(item.categoryId)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search memories by title, description or date"
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {hasSearched && searchResults.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No results found</Text>
          <Text style={styles.emptySubtext}>Try searching with different keywords</Text>
        </View>
      ) : !hasSearched ? (
        <View style={styles.initialContainer}>
          <Ionicons name="search" size={80} color="#ccc" />
          <Text style={styles.initialText}>Search your memories</Text>
          <Text style={styles.initialSubtext}>Find memories by title, description or date</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderMemoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f5e4", // Vintage paper color
  },
  header: {
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fffdf7", // Light cream
    borderRadius: 8,
    margin: 16,
    marginTop: 8, // Reduced top margin since we now have a header
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#d4c7a5",
  },
  searchIcon: {
    marginRight: 8,
    color: "#7d6c46",
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontFamily: "serif",
    color: "#5c4d33",
  },
  clearButton: {
    padding: 8,
  },
  initialContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  initialText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7d6c46",
    marginTop: 16,
    fontFamily: "serif",
  },
  initialSubtext: {
    fontSize: 14,
    color: "#7d6c46",
    marginTop: 8,
    textAlign: "center",
    fontFamily: "serif",
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
    textAlign: "center",
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
    marginBottom: 4,
    fontFamily: "serif",
    fontStyle: "italic",
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
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
})

export default SearchScreen

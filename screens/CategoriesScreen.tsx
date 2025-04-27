"use client"

import { useState } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, TextInput } from "react-native"
import { useCategories } from "../context/CategoryContext"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"

const CategoriesScreen = () => {
  const { categories, addCategory } = useCategories()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const [modalVisible, setModalVisible] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [selectedColor, setSelectedColor] = useState("#FF5733")
  const [isLoading, setIsLoading] = useState(false)

  const colors = [
    "#FF5733",
    "#33A1FF",
    "#33FF57",
    "#A233FF",
    "#FFD133",
    "#FF33A8",
    "#33FFEC",
    "#FF8333",
    "#8C33FF",
    "#33FF8C",
  ]

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert("Error", "Please enter a category name")
      return
    }

    setIsLoading(true)
    try {
      await addCategory(newCategoryName.trim(), selectedColor)
      setModalVisible(false)
      setNewCategoryName("")
    } catch (error) {
      Alert.alert("Error", "Failed to add category")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate("CategoryDetail", { category: item })}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
        <Ionicons name="folder-open" size={24} color="#fff" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
      </View>

      {categories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-open-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No categories yet</Text>
          <Text style={styles.emptySubtext}>Create categories to organize your memories</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>Create Your First Category</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Category</Text>

            <Text style={styles.modalLabel}>Category Name</Text>
            <TextInput
              style={styles.input}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="Enter category name"
            />

            <Text style={styles.modalLabel}>Select Color</Text>
            <View style={styles.colorGrid}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorItem,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColorItem,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false)
                  setNewCategoryName("")
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddCategory}
                disabled={isLoading}
              >
                <Text style={styles.saveButtonText}>{isLoading ? "Adding..." : "Add Category"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  list: {
    padding: 16,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fffdf7", // Light cream
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#d4c7a5",
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    color: "#8b5a2b", // Vintage brown
    fontFamily: "serif",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#f8f5e4", // Vintage paper color
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#d4c7a5",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#8b5a2b", // Vintage brown
    textAlign: "center",
    fontFamily: "serif",
  },
  modalLabel: {
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
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  colorItem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    margin: 6,
    borderWidth: 1,
    borderColor: "#d4c7a5",
  },
  selectedColorItem: {
    borderWidth: 3,
    borderColor: "#8b5a2b", // Vintage brown
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e8e0c5",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#d4c7a5",
  },
  cancelButtonText: {
    color: "#7d6c46",
    fontWeight: "bold",
    fontFamily: "serif",
  },
  saveButton: {
    backgroundColor: "#8b5a2b", // Vintage brown
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#6d4520",
  },
  saveButtonText: {
    color: "#f8f5e4", // Vintage paper color
    fontWeight: "bold",
    fontFamily: "serif",
  },
})

export default CategoriesScreen

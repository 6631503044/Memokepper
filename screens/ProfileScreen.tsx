"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from "react-native"
import { useAuth } from "../context/AuthContext"
import { useMemories } from "../context/MemoryContext"
import { useCategories } from "../context/CategoryContext"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"

const ProfileScreen = () => {
  const { user, logout, updateProfile } = useAuth()
  const { memories } = useMemories()
  const { categories } = useCategories()
  const navigation = useNavigation<StackNavigationProp<any>>()

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [isLoading, setIsLoading] = useState(false)

  const userMemories = memories.filter((memory) => memory.userId === user?.id)
  const userCategories = categories.filter((category) => category.userId === user?.id)

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await logout()
          navigation.reset({
            index: 0,
            routes: [{ name: "Auth" }],
          })
        },
      },
    ])
  }

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty")
      return
    }

    setIsLoading(true)
    try {
      await updateProfile(name.trim())
      setIsEditing(false)
      Alert.alert("Success", "Profile updated successfully")
    } catch (error) {
      Alert.alert("Error", "Failed to update profile")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name ? user.name.charAt(0).toUpperCase() : "?"}</Text>
          </View>
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your name" />
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.editButton, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false)
                  setName(user?.name || "")
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editButton, styles.saveButton]}
                onPress={handleSaveProfile}
                disabled={isLoading}
              >
                <Text style={styles.saveButtonText}>{isLoading ? "Saving..." : "Save"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            <TouchableOpacity style={styles.editProfileButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userMemories.length}</Text>
          <Text style={styles.statLabel}>Memories</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userCategories.length}</Text>
          <Text style={styles.statLabel}>Categories</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={22} color="#6200ee" />
          <Text style={styles.menuItemText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="lock-closed-outline" size={22} color="#6200ee" />
          <Text style={styles.menuItemText}>Privacy</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="cloud-upload-outline" size={22} color="#6200ee" />
          <Text style={styles.menuItemText}>Backup & Restore</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={22} color="#6200ee" />
          <Text style={styles.menuItemText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="information-circle-outline" size={22} color="#6200ee" />
          <Text style={styles.menuItemText}>About MemoryKeeper</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#ff3b30" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>MemoryKeeper v1.0.0</Text>
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
    backgroundColor: "#fffdf7", // Light cream
    padding: 20,
    paddingTop: 60, // Increased padding for status bar
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#d4c7a5",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#8b5a2b", // Vintage brown
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#d4c7a5",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#f8f5e4", // Vintage paper color
    fontFamily: "serif",
  },
  profileInfo: {
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8b5a2b", // Vintage brown
    marginBottom: 4,
    fontFamily: "serif",
  },
  email: {
    fontSize: 14,
    color: "#7d6c46",
    marginBottom: 16,
    fontFamily: "serif",
    fontStyle: "italic",
  },
  editProfileButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e8e0c5",
    borderWidth: 1,
    borderColor: "#d4c7a5",
  },
  editProfileButtonText: {
    color: "#8b5a2b", // Vintage brown
    fontWeight: "bold",
    fontFamily: "serif",
  },
  editForm: {
    width: "100%",
    marginTop: 16,
  },
  label: {
    fontSize: 14,
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
  editButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    flex: 1,
    paddingVertical: 10,
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
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fffdf7", // Light cream
    marginTop: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#d4c7a5",
    borderTopWidth: 1,
    borderTopColor: "#d4c7a5",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8b5a2b", // Vintage brown
    marginBottom: 4,
    fontFamily: "serif",
  },
  statLabel: {
    fontSize: 14,
    color: "#7d6c46",
    fontFamily: "serif",
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#d4c7a5",
  },
  section: {
    marginTop: 16,
    backgroundColor: "#fffdf7", // Light cream
    borderTopWidth: 1,
    borderTopColor: "#d4c7a5",
    borderBottomWidth: 1,
    borderBottomColor: "#d4c7a5",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8b5a2b", // Vintage brown
    padding: 16,
    paddingBottom: 8,
    fontFamily: "serif",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#e8e0c5",
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: "#5c4d33",
    marginLeft: 16,
    fontFamily: "serif",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: "#fffdf7", // Light cream
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#b25d56",
  },
  logoutButtonText: {
    color: "#b25d56",
    fontWeight: "bold",
    marginLeft: 8,
    fontFamily: "serif",
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40,
  },
  versionText: {
    fontSize: 12,
    color: "#7d6c46",
    fontFamily: "serif",
    fontStyle: "italic",
  },
})

export default ProfileScreen

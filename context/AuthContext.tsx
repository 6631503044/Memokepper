"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { mockUsers } from "../data/mockData"

interface User {
  id: string
  name: string
  email: string
  password: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  updateProfile: (name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user")
        if (userJson) {
          setUser(JSON.parse(userJson))
        }
      } catch (error) {
        console.error("Failed to load user from storage", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call with mock data
      const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

      if (foundUser) {
        const userToStore = { ...foundUser }
        await AsyncStorage.setItem("user", JSON.stringify(userToStore))
        setUser(userToStore)
        return true
      }
      return false
    } catch (error) {
      console.error("Login error", error)
      return false
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Check if user already exists
      const userExists = mockUsers.some((u) => u.email === email)

      if (userExists) {
        return false
      }

      // Create new user (in a real app, this would be an API call)
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password,
      }

      // Add to mock users (this is just for demo)
      mockUsers.push(newUser)

      // Store user in AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(newUser))
      setUser(newUser)
      return true
    } catch (error) {
      console.error("Signup error", error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("user")
      setUser(null)
    } catch (error) {
      console.error("Logout error", error)
    }
  }

  const updateProfile = async (name: string): Promise<void> => {
    if (!user) return

    try {
      const updatedUser = { ...user, name }
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      // Update in mock data (just for demo)
      const userIndex = mockUsers.findIndex((u) => u.id === user.id)
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser
      }
    } catch (error) {
      console.error("Update profile error", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

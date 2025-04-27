"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { mockMemories } from "../data/mockData"
import { useAuth } from "./AuthContext"

export interface Memory {
  id: string
  userId: string
  title: string
  description: string
  imageUri: string
  date: string
  categoryId: string
  location?: {
    latitude: number
    longitude: number
    name: string
  }
  createdAt: string
}

interface MemoryContextType {
  memories: Memory[]
  addMemory: (memory: Omit<Memory, "id" | "userId" | "createdAt">) => Promise<Memory>
  updateMemory: (id: string, memory: Partial<Memory>) => Promise<Memory | null>
  deleteMemory: (id: string) => Promise<boolean>
  getMemoryById: (id: string) => Memory | undefined
  getMemoriesByCategory: (categoryId: string) => Memory[]
  searchMemories: (query: string) => Memory[]
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined)

export const MemoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [memories, setMemories] = useState<Memory[]>([])

  useEffect(() => {
    // Load memories when user changes
    if (user) {
      // In a real app, you'd fetch from an API
      // For now, filter mock data by user ID
      const userMemories = mockMemories.filter((memory) => memory.userId === user.id)
      setMemories(userMemories)
    } else {
      setMemories([])
    }
  }, [user])

  const addMemory = async (memoryData: Omit<Memory, "id" | "userId" | "createdAt">): Promise<Memory> => {
    if (!user) throw new Error("User must be logged in")

    const newMemory: Memory = {
      id: `memory_${Date.now()}`,
      userId: user.id,
      ...memoryData,
      createdAt: new Date().toISOString(),
    }

    // Update state
    setMemories((prev) => [...prev, newMemory])

    // In a real app, you'd send to an API
    // For demo, add to mock data
    mockMemories.push(newMemory)

    return newMemory
  }

  const updateMemory = async (id: string, memoryData: Partial<Memory>): Promise<Memory | null> => {
    if (!user) throw new Error("User must be logged in")

    const memoryIndex = memories.findIndex((m) => m.id === id && m.userId === user.id)
    if (memoryIndex === -1) return null

    const updatedMemory = { ...memories[memoryIndex], ...memoryData }

    // Update state
    const updatedMemories = [...memories]
    updatedMemories[memoryIndex] = updatedMemory
    setMemories(updatedMemories)

    // Update mock data
    const mockIndex = mockMemories.findIndex((m) => m.id === id)
    if (mockIndex !== -1) {
      mockMemories[mockIndex] = updatedMemory
    }

    return updatedMemory
  }

  const deleteMemory = async (id: string): Promise<boolean> => {
    if (!user) throw new Error("User must be logged in")

    const memoryExists = memories.some((m) => m.id === id && m.userId === user.id)
    if (!memoryExists) return false

    // Update state
    setMemories((prev) => prev.filter((m) => m.id !== id))

    // Update mock data
    const mockIndex = mockMemories.findIndex((m) => m.id === id)
    if (mockIndex !== -1) {
      mockMemories.splice(mockIndex, 1)
    }

    return true
  }

  const getMemoryById = (id: string): Memory | undefined => {
    return memories.find((m) => m.id === id)
  }

  const getMemoriesByCategory = (categoryId: string): Memory[] => {
    return memories.filter((m) => m.categoryId === categoryId)
  }

  const searchMemories = (query: string): Memory[] => {
    const lowercaseQuery = query.toLowerCase()
    return memories.filter(
      (m) =>
        m.title.toLowerCase().includes(lowercaseQuery) ||
        m.description.toLowerCase().includes(lowercaseQuery) ||
        m.date.includes(query),
    )
  }

  return (
    <MemoryContext.Provider
      value={{
        memories,
        addMemory,
        updateMemory,
        deleteMemory,
        getMemoryById,
        getMemoriesByCategory,
        searchMemories,
      }}
    >
      {children}
    </MemoryContext.Provider>
  )
}

export const useMemories = (): MemoryContextType => {
  const context = useContext(MemoryContext)
  if (context === undefined) {
    throw new Error("useMemories must be used within a MemoryProvider")
  }
  return context
}

"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { mockCategories } from "../data/mockData"
import { useAuth } from "./AuthContext"

export interface Category {
  id: string
  userId: string
  name: string
  color: string
}

interface CategoryContextType {
  categories: Category[]
  addCategory: (name: string, color: string) => Promise<Category>
  updateCategory: (id: string, name: string, color: string) => Promise<Category | null>
  deleteCategory: (id: string) => Promise<boolean>
  getCategoryById: (id: string) => Category | undefined
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined)

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    // Load categories when user changes
    if (user) {
      // In a real app, you'd fetch from an API
      // For now, filter mock data by user ID
      const userCategories = mockCategories.filter((category) => category.userId === user.id)
      setCategories(userCategories)
    } else {
      setCategories([])
    }
  }, [user])

  const addCategory = async (name: string, color: string): Promise<Category> => {
    if (!user) throw new Error("User must be logged in")

    const newCategory: Category = {
      id: `category_${Date.now()}`,
      userId: user.id,
      name,
      color,
    }

    // Update state
    setCategories((prev) => [...prev, newCategory])

    // In a real app, you'd send to an API
    // For demo, add to mock data
    mockCategories.push(newCategory)

    return newCategory
  }

  const updateCategory = async (id: string, name: string, color: string): Promise<Category | null> => {
    if (!user) throw new Error("User must be logged in")

    const categoryIndex = categories.findIndex((c) => c.id === id && c.userId === user.id)
    if (categoryIndex === -1) return null

    const updatedCategory = { ...categories[categoryIndex], name, color }

    // Update state
    const updatedCategories = [...categories]
    updatedCategories[categoryIndex] = updatedCategory
    setCategories(updatedCategories)

    // Update mock data
    const mockIndex = mockCategories.findIndex((c) => c.id === id)
    if (mockIndex !== -1) {
      mockCategories[mockIndex] = updatedCategory
    }

    return updatedCategory
  }

  const deleteCategory = async (id: string): Promise<boolean> => {
    if (!user) throw new Error("User must be logged in")

    const categoryExists = categories.some((c) => c.id === id && c.userId === user.id)
    if (!categoryExists) return false

    // Update state
    setCategories((prev) => prev.filter((c) => c.id !== id))

    // Update mock data
    const mockIndex = mockCategories.findIndex((c) => c.id === id)
    if (mockIndex !== -1) {
      mockCategories.splice(mockIndex, 1)
    }

    return true
  }

  const getCategoryById = (id: string): Category | undefined => {
    return categories.find((c) => c.id === id)
  }

  return (
    <CategoryContext.Provider
      value={{
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
      }}
    >
      {children}
    </CategoryContext.Provider>
  )
}

export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext)
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoryProvider")
  }
  return context
}

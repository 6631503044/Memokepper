import type { Memory } from "../context/MemoryContext"
import type { Category } from "../context/CategoryContext"

// Mock Users
export const mockUsers = [
  {
    id: "user_1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  },
  {
    id: "user_2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
  },
]

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: "category_1",
    userId: "user_1",
    name: "Family",
    color: "#a86032", // Vintage rust
  },
  {
    id: "category_2",
    userId: "user_1",
    name: "Travel",
    color: "#5b7b7a", // Vintage teal
  },
  {
    id: "category_3",
    userId: "user_1",
    name: "Friends",
    color: "#8f784b", // Vintage gold
  },
  {
    id: "category_4",
    userId: "user_2",
    name: "Work",
    color: "#76624c", // Vintage brown
  },
  {
    id: "category_5",
    userId: "user_2",
    name: "Vacation",
    color: "#b0a171", // Vintage tan
  },
]

// Mock Memories
export const mockMemories: Memory[] = [
  {
    id: "memory_1",
    userId: "user_1",
    title: "Family Reunion",
    description: "Annual family reunion at Grandma's house. Everyone was there!",
    imageUri: "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=1470&auto=format&fit=crop",
    date: "2023-07-15",
    categoryId: "category_1",
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      name: "New York, NY",
    },
    createdAt: "2023-07-16T14:30:00Z",
  },
  {
    id: "memory_2",
    userId: "user_1",
    title: "Trip to Paris",
    description: "Visited the Eiffel Tower and had amazing croissants!",
    imageUri: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1473&auto=format&fit=crop",
    date: "2023-05-10",
    categoryId: "category_2",
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      name: "Paris, France",
    },
    createdAt: "2023-05-15T10:20:00Z",
  },
  {
    id: "memory_3",
    userId: "user_1",
    title: "Birthday Party",
    description: "My 30th birthday celebration with friends",
    imageUri: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1470&auto=format&fit=crop",
    date: "2023-03-22",
    categoryId: "category_3",
    createdAt: "2023-03-23T18:45:00Z",
  },
  {
    id: "memory_4",
    userId: "user_1",
    title: "Hiking Trip",
    description: "Amazing views from the mountain top!",
    imageUri: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1470&auto=format&fit=crop",
    date: "2023-08-05",
    categoryId: "category_2",
    location: {
      latitude: 36.5785,
      longitude: -118.2923,
      name: "Sequoia National Park",
    },
    createdAt: "2023-08-07T09:15:00Z",
  },
  {
    id: "memory_5",
    userId: "user_2",
    title: "Company Retreat",
    description: "Team building activities and planning sessions",
    imageUri: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1470&auto=format&fit=crop",
    date: "2023-06-20",
    categoryId: "category_4",
    location: {
      latitude: 34.0522,
      longitude: -118.2437,
      name: "Los Angeles, CA",
    },
    createdAt: "2023-06-22T16:30:00Z",
  },
  {
    id: "memory_6",
    userId: "user_2",
    title: "Beach Vacation",
    description: "Relaxing week at the beach with perfect weather",
    imageUri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1473&auto=format&fit=crop",
    date: "2023-04-10",
    categoryId: "category_5",
    location: {
      latitude: 25.7617,
      longitude: -80.1918,
      name: "Miami Beach, FL",
    },
    createdAt: "2023-04-18T12:10:00Z",
  },
]

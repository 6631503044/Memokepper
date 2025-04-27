import "react-native-gesture-handler"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { AuthProvider } from "./context/AuthContext"
import { MemoryProvider } from "./context/MemoryContext"
import { CategoryProvider } from "./context/CategoryContext"

// Screens
import LoginScreen from "./screens/LoginScreen"
import SignupScreen from "./screens/SignupScreen"
import HomeScreen from "./screens/HomeScreen"
import AddMemoryScreen from "./screens/AddMemoryScreen"
import MemoryDetailScreen from "./screens/MemoryDetailScreen"
import CategoriesScreen from "./screens/CategoriesScreen"
import CategoryDetailScreen from "./screens/CategoryDetailScreen"
import SearchScreen from "./screens/SearchScreen"
import ProfileScreen from "./screens/ProfileScreen"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()
const AuthStack = createStackNavigator()
const HomeStack = createStackNavigator()
const CategoryStack = createStackNavigator()
const SearchStack = createStackNavigator()
const ProfileStack = createStackNavigator()

const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
    <HomeStack.Screen name="MemoryDetail" component={MemoryDetailScreen} />
    <HomeStack.Screen name="AddMemory" component={AddMemoryScreen} />
  </HomeStack.Navigator>
)

const CategoryStackScreen = () => (
  <CategoryStack.Navigator screenOptions={{ headerShown: false }}>
    <CategoryStack.Screen name="CategoriesScreen" component={CategoriesScreen} />
    <CategoryStack.Screen
      name="CategoryDetail"
      component={CategoryDetailScreen}
      options={({ route }) => ({ title: route.params?.category?.name || "Category" })}
    />
    <CategoryStack.Screen name="AddMemory" component={AddMemoryScreen} />
    <CategoryStack.Screen name="MemoryDetail" component={MemoryDetailScreen} />
  </CategoryStack.Navigator>
)

const SearchStackScreen = () => (
  <SearchStack.Navigator screenOptions={{ headerShown: false }}>
    <SearchStack.Screen name="SearchScreen" component={SearchScreen} />
    <SearchStack.Screen name="MemoryDetail" component={MemoryDetailScreen} />
  </SearchStack.Navigator>
)

const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
  </ProfileStack.Navigator>
)

const AuthStackScreen = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Signup" component={SignupScreen} />
  </AuthStack.Navigator>
)

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName

        if (route.name === "Home") {
          iconName = focused ? "home" : "home-outline"
        } else if (route.name === "Categories") {
          iconName = focused ? "folder" : "folder-outline"
        } else if (route.name === "Search") {
          iconName = focused ? "search" : "search-outline"
        } else if (route.name === "Profile") {
          iconName = focused ? "person" : "person-outline"
        }

        return <Ionicons name={iconName} size={size} color={color} />
      },
      tabBarActiveTintColor: "#8b5a2b", // Vintage brown
      tabBarInactiveTintColor: "#7d6c46",
      tabBarStyle: {
        backgroundColor: "#f0ead6", // Lighter vintage paper
        borderTopColor: "#d4c7a5",
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeStackScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Categories" component={CategoryStackScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Search" component={SearchStackScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Profile" component={ProfileStackScreen} options={{ headerShown: false }} />
  </Tab.Navigator>
)

export default function App() {
  return (
    <AuthProvider>
      <MemoryProvider>
        <CategoryProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Auth" component={AuthStackScreen} />
              <Stack.Screen name="Main" component={MainTabNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </CategoryProvider>
      </MemoryProvider>
    </AuthProvider>
  )
}

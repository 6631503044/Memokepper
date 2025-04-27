"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native"
import { useAuth } from "../context/AuthContext"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"

const LoginScreen = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigation = useNavigation<StackNavigationProp<any>>()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    setIsLoading(true)
    try {
      const success = await login(email, password)
      if (success) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        })
      } else {
        Alert.alert("Error", "Invalid email or password")
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during login")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1531845116688-48819b3b68d9?q=80&w=1471&auto=format&fit=crop",
          }}
          style={styles.logo}
          resizeMode="cover"
        />
        <Text style={styles.title}>MemoryKeeper</Text>
        <Text style={styles.subtitle}>Store your precious memories</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? "Logging in..." : "Login"}</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demoContainer}>
          <Text style={styles.demoText}>Demo credentials:</Text>
          <Text style={styles.demoCredentials}>Email: john@example.com</Text>
          <Text style={styles.demoCredentials}>Password: password123</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f5e4", // Vintage paper color
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#d4c7a5", // Vintage frame color
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#8b5a2b", // Vintage brown
    marginBottom: 8,
    fontFamily: "serif",
  },
  subtitle: {
    fontSize: 16,
    color: "#7d6c46",
    fontFamily: "serif",
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#d4c7a5",
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fffdf7", // Light cream
  },
  button: {
    backgroundColor: "#8b5a2b", // Vintage brown
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#6d4520",
  },
  buttonText: {
    color: "#f8f5e4", // Vintage paper color
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "serif",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  signupText: {
    color: "#7d6c46",
    fontSize: 14,
    fontFamily: "serif",
  },
  signupLink: {
    color: "#8b5a2b", // Vintage brown
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "serif",
  },
  demoContainer: {
    marginTop: 40,
    padding: 16,
    backgroundColor: "#f0ead6", // Lighter vintage paper
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d4c7a5",
  },
  demoText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#7d6c46",
    fontFamily: "serif",
  },
  demoCredentials: {
    fontSize: 14,
    color: "#7d6c46",
    fontFamily: "serif",
  },
})

export default LoginScreen

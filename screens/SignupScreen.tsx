"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native"
import { useAuth } from "../context/AuthContext"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"

const SignupScreen = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signup } = useAuth()
  const navigation = useNavigation<StackNavigationProp<any>>()

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    setIsLoading(true)
    try {
      const success = await signup(name, email, password)
      if (success) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        })
      } else {
        Alert.alert("Error", "Email already in use or registration failed")
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during signup")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to start saving your memories</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
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
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? "Creating Account..." : "Sign Up"}</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f5e4", // Vintage paper color
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
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
    paddingBottom: 40,
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
    fontFamily: "serif",
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: "#7d6c46",
    fontSize: 14,
    fontFamily: "serif",
  },
  loginLink: {
    color: "#8b5a2b", // Vintage brown
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "serif",
  },
})

export default SignupScreen

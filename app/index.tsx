// app/index.tsx
import React, { useState } from "react";
import { 
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import LoginForm from "./screens/LoginForm";
import SignupForm from "./screens/SignupForm";
import { User } from "./components/Login/User";
import TabNavigator from "./navigation/TabNavigator";
import { styles } from "./styles/IndexStyles";

// URL de tu API (reemplazar con la URL de Vercel cuando esté desplegado)
const API_URL = "https://7ujm8uhb.vercel.app";

export default function Index() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Si el usuario está logueado, mostramos el tab navigator
  if (user) {
    return <TabNavigator user={user} onLogout={() => setUser(null)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {isLogin ? (
            <LoginForm 
              onLogin={setUser}
              onSwitchToSignup={() => setIsLogin(false)}
              apiUrl={API_URL}
            />
          ) : (
            <SignupForm 
              onSwitchToLogin={() => setIsLogin(true)}
              apiUrl={API_URL}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
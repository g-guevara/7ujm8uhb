import React, { useState } from "react";
import { 
  Text, 
  View, 
  TextInput,
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from "react-native";
import { User } from "../components/Login/User";
import { styles } from "../styles/LoginFormStyles";

interface LoginFormProps {
  onLogin: (user: User) => void;
  onSwitchToSignup: () => void;
  apiUrl: string;
}

export default function LoginForm({ onLogin, onSwitchToSignup, apiUrl }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      console.log("Intentando hacer login con URL:", `${apiUrl}/login`);
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const contentType = response.headers.get("content-type");
      console.log("Content-Type:", contentType);

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Respuesta no es JSON:", text);
        Alert.alert("Error", "El servidor no devolvió un JSON válido");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        onLogin(data.user);
        Alert.alert("Éxito", "Has iniciado sesión correctamente");
      } else {
        Alert.alert("Error", data.error || "No se pudo iniciar sesión");
      }
    } catch (error) {
      console.error("Error en login:", error);
      Alert.alert("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={loginEmail}
        onChangeText={setLoginEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={loginPassword}
        onChangeText={setLoginPassword}
        secureTextEntry
      />
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.switchButton} 
        onPress={onSwitchToSignup}
      >
        <Text style={styles.switchButtonText}>
          ¿No tienes cuenta? Regístrate
        </Text>
      </TouchableOpacity>
    </View>
  );
}
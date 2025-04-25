// app/screens/LoginForm.tsx
import React, { useState } from "react";
import { 
  Text, 
  View, 
  TextInput,
  TouchableOpacity, 
  ActivityIndicator,
} from "react-native";
import { useToast } from '../utils/ToastContext';
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
  const { showToast } = useToast();

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      showToast('Por favor completa todos los campos', 'error');
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
        showToast('El servidor no devolvió un JSON válido', 'error');
        return;
      }

      const data = await response.json();

      if (response.ok) {
        onLogin(data.user);
        showToast('¡Has iniciado sesión correctamente!', 'success');
      } else {
        // Specific error messages based on server response
        if (response.status === 401) {
          showToast('Email o contraseña incorrectos', 'error');
        } else if (response.status === 404) {
          showToast('El email no está registrado', 'error');
        } else {
          showToast(data.error || 'No se pudo iniciar sesión', 'error');
        }
      }
    } catch (error) {
      console.error("Error en login:", error);
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        showToast('Por favor verifica tu conexión a internet', 'error');
      } else {
        showToast('No se pudo conectar con el servidor', 'error');
      }
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
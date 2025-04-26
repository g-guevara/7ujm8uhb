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
import { ApiService } from "../services/api";
import { saveToken } from "../utils/authUtils";

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
      const response = await ApiService.login(loginEmail, loginPassword);
      
      // Guardar el token
      if (response.token) {
        await saveToken(response.token);
      }
      
      onLogin(response.user);
      showToast('Logged in', 'success');
    } catch (error: any) {
      console.error("Login error: ", error);
      
      if (error.message === 'Sesión expirada') {
        showToast('Tu sesión ha expirado, por favor inicia sesión nuevamente', 'error');
      } else if (error.message.includes('Credenciales inválidas')) {
        showToast('Email o contraseña incorrectos', 'error');
      } else if (error instanceof TypeError && error.message.includes('Network request failed')) {
        showToast('Por favor verifica tu conexión a internet', 'error');
      } else {
        showToast(error.message || 'No se pudo iniciar sesión', 'error');
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
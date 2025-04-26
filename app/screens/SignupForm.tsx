// app/screens/SignupForm.tsx
import React, { useState } from "react";
import { 
  Text, 
  View, 
  TextInput,
  TouchableOpacity, 
  ActivityIndicator,
} from "react-native";
import { useToast } from '../utils/ToastContext';
import { styles } from "../styles/SignupFormStyles";
import { ApiService } from "../services/api";

interface SignupFormProps {
  onSwitchToLogin: () => void;
  apiUrl: string;
}

export default function SignupForm({ onSwitchToLogin, apiUrl }: SignupFormProps) {
  const [loading, setLoading] = useState(false);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupLanguage, setSignupLanguage] = useState("es");
  const { showToast } = useToast();

  const handleSignup = async () => {
    if (!signupName || !signupEmail || !signupPassword) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }

    setLoading(true);
    try {
      await ApiService.signup({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        language: signupLanguage
      });

      showToast('Account created successfully!', 'success');
      
      // Wait a moment before switching to login
      setTimeout(() => {
        onSwitchToLogin();
      }, 1500);

      // Clear signup fields
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
    } catch (error: any) {
      console.error("Error en registro:", error);
      
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        showToast('Por favor verifica tu conexión a internet', 'error');
      } else {
        showToast(error.message || 'No se pudo crear la cuenta', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Crear Cuenta</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={signupName}
        onChangeText={setSignupName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={signupEmail}
        onChangeText={setSignupEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={signupPassword}
        onChangeText={setSignupPassword}
        secureTextEntry
      />
      <View style={styles.languageContainer}>
        <Text style={styles.languageLabel}>Idioma:</Text>
        <View style={styles.languageButtons}>
          <TouchableOpacity 
            style={[
              styles.languageButton, 
              signupLanguage === "es" && styles.languageButtonActive
            ]}
            onPress={() => setSignupLanguage("es")}
          >
            <Text style={[
              styles.languageButtonText,
              signupLanguage === "es" && styles.languageButtonTextActive
            ]}>Español</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.languageButton, 
              signupLanguage === "en" && styles.languageButtonActive
            ]}
            onPress={() => setSignupLanguage("en")}
          >
            <Text style={[
              styles.languageButtonText,
              signupLanguage === "en" && styles.languageButtonTextActive
            ]}>English</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Crear Cuenta</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.switchButton} 
        onPress={onSwitchToLogin}
      >
        <Text style={styles.switchButtonText}>
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}
import React, { useState } from "react";
import { 
  Text, 
  View, 
  TextInput,
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from "react-native";
import { styles } from "../styles/SignupFormStyles";

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

  const handleSignup = async () => {
    if (!signupName || !signupEmail || !signupPassword) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      console.log("Intentando registrar con URL:", `${apiUrl}/users`);
      const response = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          language: signupLanguage,
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
        Alert.alert(
          "Éxito", 
          "Cuenta creada correctamente. Ahora puedes iniciar sesión.",
          [{ text: "OK", onPress: onSwitchToLogin }]
        );
        // Limpiar campos de registro
        setSignupName("");
        setSignupEmail("");
        setSignupPassword("");
      } else {
        Alert.alert("Error", data.error || "No se pudo crear la cuenta");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      Alert.alert("Error");
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
// app/screens/LoginForm.tsx
import React, { useState, useEffect } from "react";
import { 
  Text, 
  View, 
  TextInput,
  TouchableOpacity, 
  ActivityIndicator,
  Platform,
  Image,
} from "react-native";
import { useToast } from '../utils/ToastContext';
import { User } from "../components/Login/User";
import { styles } from "../styles/LoginFormStyles";
import { ApiService } from "../services/api";
import { saveToken } from "../utils/authUtils";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

interface LoginFormProps {
  onLogin: (user: User) => void;
  onSwitchToSignup: () => void;
  apiUrl: string;
}

export default function LoginForm({ onLogin, onSwitchToSignup, apiUrl }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { showToast } = useToast();

  // Configuración de Google OAuth
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '421431845569-3gi5bflt29es9fo1ovrpc9tprmd6tj3s.apps.googleusercontent.com',
  });

  useEffect(() => {
    handleGoogleResponse();
  }, [response]);

  const handleGoogleResponse = async () => {
    if (response?.type === 'success') {
      setGoogleLoading(true);
      try {
        const { params } = response;
        const { id_token } = params;
        
        // Decode the ID token to get user info
        const decodedToken = JSON.parse(atob(id_token.split('.')[1]));
        
        // Send Google token to your backend
        const loginResponse = await ApiService.googleLogin({
          idToken: id_token,
          accessToken: '', // ID token flow doesn't provide access token
          email: decodedToken.email,
          name: decodedToken.name,
          googleId: decodedToken.sub
        });
        
        if (loginResponse.token) {
          await saveToken(loginResponse.token);
          onLogin(loginResponse.user);
          showToast('Iniciado sesión con Google', 'success');
        }
      } catch (error: any) {
        console.error("Google login error: ", error);
        showToast('Error al iniciar sesión con Google', 'error');
      } finally {
        setGoogleLoading(false);
      }
    }
  };

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

      {/* Google Sign-In Button */}
      <TouchableOpacity 
        style={[styles.googleButton, (googleLoading || !request) && styles.googleButtonDisabled]} 
        onPress={() => promptAsync()}
        disabled={!request || googleLoading}
      >
        {googleLoading ? (
          <ActivityIndicator color="#555" />
        ) : (
          <>
            <Image 
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png' }}
              style={styles.googleLogo}
              resizeMode="contain"
            />
            <Text style={styles.googleButtonText}>
              Continuar con Google
            </Text>
          </>
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
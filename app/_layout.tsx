// app/_layout.tsx
import { Stack } from "expo-router";
import { ToastProvider } from './utils/ToastContext';

export default function RootLayout() {
  return (
    <ToastProvider>
      <Stack
        screenOptions={{
          headerShown: false,  // Esto ocultará el header en todas las pantallas
        }}
      />
    </ToastProvider>
  );
}
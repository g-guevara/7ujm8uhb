// app/_layout.tsx
import { Stack } from "expo-router";
import { ToastProvider } from './utils/ToastContext';

export default function RootLayout() {
  return (
    <ToastProvider>
      <Stack />
    </ToastProvider>
  );
}
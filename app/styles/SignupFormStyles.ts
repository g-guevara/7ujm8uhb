import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
    width: '100%',
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  switchButton: {
    marginTop: 20,
    alignItems: "center",
  },
  switchButtonText: {
    color: "#007bff",
    fontSize: 14,
  },
  languageContainer: {
    marginBottom: 15,
  },
  languageLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  languageButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  languageButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  languageButtonActive: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  languageButtonText: {
    color: "#333",
  },
  languageButtonTextActive: {
    color: "#fff",
  },


  formContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    position: 'relative',
  },
  logoContainer: {
    position: 'absolute',
    top: -40,
    left: 20,
    width: 80,
    height: 80,
    borderRadius: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
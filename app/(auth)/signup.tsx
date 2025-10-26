import { auth } from "@/utils/firebaseConfig";
import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.inputContainer}>
          <Mail size={20} color={Colors.fontColors} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor={Colors.fontColorsLight}
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} color={Colors.fontColors} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={Colors.fontColorsLight}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.linkText}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 30,
    shadowColor: Colors.background,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceDark,
    borderRadius: 12,
    marginBottom: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.fontColorsLight,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  button: {
    backgroundColor: Colors.accent,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: Colors.background,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: Colors.textSecondary,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  error: {
    color: Colors.fontColors,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
    backgroundColor: Colors.backgroundMedium,
    padding: 10,
    borderRadius: 8,
  },
});
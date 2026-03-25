import { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '../services/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace('/'); // go to main screen
    } catch {
      alert('Login failed');
    }
  };

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <Button title="Login" onPress={handleLogin} />

      <Text onPress={() => router.push('/register')}>
        Go to Register
      </Text>
    </View>
  );
}
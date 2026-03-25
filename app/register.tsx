import { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { register } from '../services/api';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await register(email, password);
      router.replace('/login');
    } catch {
      alert('Register failed');
    }
  };

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}
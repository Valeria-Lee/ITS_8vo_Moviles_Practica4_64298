import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { Card, IconButton, Text, TextInput } from 'react-native-paper';
import useNotes from '../hooks/useNotes';
import { TOKEN } from '../services/api';

export default function NotesListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { notes, isLoading, error, deleteNote, loadNotes } = useNotes();

  useFocusEffect(
    useCallback(() => {
      if (!TOKEN) {
        router.replace('/login');
        return;
      }
      loadNotes();
    }, [loadNotes])
  );

  const handleEditNote = (noteId: number) => {
    router.push(`/create-note?id=${noteId}`);
  };

  const handleDeleteNote = async (noteId: number) => {
    Alert.alert(
      'Eliminar Nota',
      '¿Estás seguro de que quieres eliminar esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(noteId);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la nota');
            }
          }
        }
      ]
    );
  };

  const filteredNotes = notes.filter(note =>
    note.titulo.toLowerCase().includes(search.toLowerCase()) ||
    note.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating={true} size="large" color="#FFB74D" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Journal</Text>
        <TextInput
          mode="outlined"
          placeholder="Buscar notas..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          outlineStyle={styles.searchOutline}
          activeOutlineColor="#FFB74D"
          placeholderTextColor="#999"
          left={<TextInput.Icon icon="magnify" color="#999" />}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredNotes.length === 0 ? (
          <Text style={styles.emptyText}>No se encontraron notas</Text>
        ) : (
          filteredNotes.map(note => (
            <Card key={note.id} style={styles.card} onPress={() => handleEditNote(note.id)}>
              <Card.Title
                title={note.titulo}
                titleStyle={styles.cardTitle}
              />
              <Card.Content>
                <Text 
                  numberOfLines={3} 
                  ellipsizeMode="tail"
                  style={styles.cardContent}
                >
                  {note.descripcion.replace(/<[^>]*>/g, '').substring(0, 200)}
                </Text>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <IconButton
                  icon="pencil-outline"
                  size={20}
                  onPress={() => handleEditNote(note.id)}
                  iconColor="#666"
                />
                <IconButton
                  icon="delete-outline"
                  size={20}
                  onPress={() => handleDeleteNote(note.id)}
                  iconColor="#FF5252"
                />
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/create-note')}
      >
        <MaterialIcons name="add" size={32} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F3F1', // Warm cream background
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#F4F3F1',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    height: 50,
  },
  searchOutline: {
    borderRadius: 25, // Pill shape
    borderColor: 'transparent',
    borderWidth: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 16,
    borderRadius: 24, // High rounding like the image
    backgroundColor: '#FFFFFF',
    elevation: 1,
    borderWidth: 0,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  cardContent: {
    color: '#666',
    lineHeight: 20,
    marginTop: -8,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  fab: {
    position: 'absolute',
    right: 25,
    bottom: 30,
    backgroundColor: '#FFB74D', // Gold/Yellow accent
    width: 65,
    height: 65,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F3F1',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 16,
  },
});
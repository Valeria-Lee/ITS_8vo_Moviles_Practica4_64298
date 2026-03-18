import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiService {
  static final String _apiUrl = dotenv.get('API_URL');

  // Token JWT almacenado en memoria tras el login
  static String? _token;

  /// Cabeceras base — incluye Authorization si hay token
  static Map<String, String> get _headers {
    final headers = <String, String>{
      'Content-Type': 'application/json',
    };
    if (_token != null) {
      headers['Authorization'] = 'Bearer $_token';
    }
    return headers;
  }

  // ─────────────────────────────────────────────
  //  Autenticación
  // ─────────────────────────────────────────────

  static Future<void> login(String username, String password) async {
    final response = await http.post(
      // FIJADO: Agregado /auth/ para coincidir con tu AuthController.java
      Uri.parse('$_apiUrl/auth/login'), 
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'username': username, 'password': password}),
    );

    if (response.statusCode == 200) {
      final body = json.decode(response.body);
      _token = body['token'] ?? body['access_token'] ?? body['jwt'];
      if (_token == null) {
        throw Exception('El servidor no devolvió un token válido');
      }
    } else {
      throw Exception('Credenciales incorrectas (${response.statusCode})');
    }
  }

  static Future<void> register(String username, String password) async {
    final response = await http.post(
      // FIJADO: Agregado /auth/ para coincidir con tu AuthController.java
      Uri.parse('$_apiUrl/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'username': username, 'password': password}),
    );

    // FIJADO: Aceptamos 200 o 201
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Error al registrar la cuenta (${response.statusCode})');
    }
  }

  static void logout() {
    _token = null;
  }

  // ─────────────────────────────────────────────
  //  Tareas (TODAS fijadas para usar _headers)
  // ─────────────────────────────────────────────

  static Future<List<Map<String, dynamic>>> getTasks() async {
    final response = await http.get(Uri.parse('$_apiUrl/tareas'), headers: _headers);
    if (response.statusCode == 200) {
      return List<Map<String, dynamic>>.from(json.decode(response.body));
    } else {
      throw Exception('No autorizado o error al cargar tareas');
    }
  }

  static Future<Map<String, dynamic>> createTask(Map<String, dynamic> task) async {
    final response = await http.post(
      Uri.parse('$_apiUrl/tareas'),
      headers: _headers, // FIJADO: Usar _headers para el token
      body: json.encode(task),
    );
    if (response.statusCode == 200 || response.statusCode == 201) {
      return Map<String, dynamic>.from(json.decode(response.body));
    } else {
      throw Exception('Error al crear tarea');
    }
  }

  static Future<Map<String, dynamic>> updateTask(int id, Map<String, dynamic> task) async {
    final response = await http.put(
      Uri.parse('$_apiUrl/tareas/$id'),
      headers: _headers, // FIJADO
      body: json.encode(task),
    );
    if (response.statusCode == 200) {
      return Map<String, dynamic>.from(json.decode(response.body));
    } else {
      throw Exception('Error al actualizar');
    }
  }

  static Future<Map<String, dynamic>> toggleTaskCompletion(int id, bool completed) async {
    final response = await http.patch(
      Uri.parse('$_apiUrl/tareas/$id'),
      headers: _headers, // FIJADO
      body: json.encode({'completada': completed}),
    );
    if (response.statusCode == 200) {
      return Map<String, dynamic>.from(json.decode(response.body));
    } else {
      throw Exception('Error al actualizar estado');
    }
  }

  static Future<void> deleteTask(int id) async {
    final response = await http.delete(
      Uri.parse('$_apiUrl/tareas/$id'),
      headers: _headers, // FIJADO
    );
    if (response.statusCode != 204 && response.statusCode != 200) {
      throw Exception('Error al eliminar');
    }
  }
}
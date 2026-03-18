import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String _baseUrl = 'https://tu-api.com'; // ← cambia esto
  static String? _token;

  // ── Headers con token ──────────────────────────────────────────────────────
  static Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (_token != null) 'Authorization': 'Bearer $_token',
      };

  // ── Auth ───────────────────────────────────────────────────────────────────
  static Future<void> login(String username, String password) async {
    final res = await http.post(
      Uri.parse('$_baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': username, 'password': password}),
    );
    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      _token = data['token'];           // ← guarda el token
    } else {
      throw Exception('Credenciales incorrectas (${res.statusCode})');
    }
  }

  static Future<void> register(String username, String password) async {
    final res = await http.post(
      Uri.parse('$_baseUrl/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': username, 'password': password}),
    );
    if (res.statusCode != 200 && res.statusCode != 201) {
      throw Exception('Error al registrar (${res.statusCode})');
    }
  }

  static void logout() => _token = null;   // ← limpia el token

  // ── Tareas (token inyectado automáticamente via _headers) ──────────────────
  static Future<List<Map<String, dynamic>>> getTasks() async {
    final res = await http.get(
      Uri.parse('$_baseUrl/tasks'),
      headers: _headers,                  // ← lleva el token
    );
    if (res.statusCode == 200) {
      final List data = jsonDecode(res.body);
      return data.cast<Map<String, dynamic>>();
    }
    throw Exception('Error al obtener tareas (${res.statusCode})');
  }

  static Future<void> createTask(Map<String, dynamic> task) async {
    final res = await http.post(
      Uri.parse('$_baseUrl/tasks'),
      headers: _headers,
      body: jsonEncode(task),
    );
    if (res.statusCode != 200 && res.statusCode != 201) {
      throw Exception('Error al crear tarea (${res.statusCode})');
    }
  }

  static Future<void> updateTask(dynamic id, Map<String, dynamic> task) async {
    final res = await http.put(
      Uri.parse('$_baseUrl/tasks/$id'),
      headers: _headers,
      body: jsonEncode(task),
    );
    if (res.statusCode != 200) {
      throw Exception('Error al actualizar tarea (${res.statusCode})');
    }
  }

  static Future<void> deleteTask(dynamic id) async {
    final res = await http.delete(
      Uri.parse('$_baseUrl/tasks/$id'),
      headers: _headers,
    );
    if (res.statusCode != 200 && res.statusCode != 204) {
      throw Exception('Error al eliminar tarea (${res.statusCode})');
    }
  }

  static Future<void> toggleTaskCompletion(dynamic id, bool completada) async {
    final res = await http.patch(
      Uri.parse('$_baseUrl/tasks/$id'),
      headers: _headers,
      body: jsonEncode({'completada': completada}),
    );
    if (res.statusCode != 200) {
      throw Exception('Error al actualizar estado (${res.statusCode})');
    }
  }
}
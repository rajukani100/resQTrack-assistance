import 'package:get_storage/get_storage.dart';

class StorageService {
  static final GetStorage _storage = GetStorage();

  /// Save login status
  static Future<void> saveLoginStatus(bool isLoggedIn) async {
    await _storage.write('isLoggedIn', isLoggedIn);
  }

  /// Check if user is logged in
  static bool isLoggedIn() {
    return _storage.read<bool>('isLoggedIn') ?? false;
  }

  /// Logout and clear user data
  static Future<void> logout() async {
    await _storage.remove('isLoggedIn');
    await _storage.remove('user_email');
    await _storage.remove('user_cookie');
  }

  /// Save user email
  static Future<void> saveUserEmail(String email) async {
    await _storage.write('user_email', email);
  }

  /// Get user email
  static String? getUserEmail() {
    return _storage.read<String>('user_email');
  }

  /// Save user authentication cookie
  static Future<void> saveUserCookie(String cookie) async {
    await _storage.write('user_cookie', cookie);
  }

  /// Get user authentication cookie
  static String? getUserCookie() {
    return _storage.read<String>('user_cookie');
  }

  /// Save user name
  static Future<void> saveUserName(String name) async {
    await _storage.write('user_name', name);
  }

  /// Get user name
  static String? getUserName() {
    return _storage.read<String>('user_name');
  }

  static void markRequestAsRated(String requestId) {
    final List<String> ratedList = getRatedRequestIds();
    if (!ratedList.contains(requestId)) {
      ratedList.add(requestId);
      _storage.write('ratedRequests', ratedList);
    }
  }

  /// Get locally stored rated request IDs
  static List<String> getRatedRequestIds() {
    return List<String>.from(_storage.read('ratedRequests') ?? []);
  }
}

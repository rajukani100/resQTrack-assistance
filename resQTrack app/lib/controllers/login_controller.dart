import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:get/get.dart';
import 'package:resqtrack/controllers/navigation_controller.dart';
import 'package:resqtrack/routes.dart';
import 'package:resqtrack/utils/constant.dart';
import '../services/storage_service.dart';

class LoginController extends GetxController {
  final NavigationController navController = Get.find<NavigationController>();
  Future<void> login(String email, String password) async {
    final body = {
      'email': email,
      'password': password,
    };

    try {
      final response = await http.post(
        Uri.parse(Backend.host + "/api/user/login"),
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(body),
      );

      if (response.statusCode == 200) {
        final decodedBody = jsonDecode(response.body);
        final String token = decodedBody["data"]["accesstoken"];

        // Save token

        await StorageService.saveUserCookie(token);
        await StorageService.saveUserEmail(email);

        Get.snackbar(
          "Success",
          "Login successful!",
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.green,
          colorText: Colors.white,
          duration: Duration(seconds: 2),
          margin: EdgeInsets.all(16),
        );

        StorageService.saveLoginStatus(true);
        navController.changeLoggedinState(true);
        // Navigate to home and remove login screen from stack
        Get.offAllNamed(Routes.BASE);
      } else {
        Get.snackbar(
          "Error",
          jsonDecode(response.body)["message"],
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
          duration: Duration(seconds: 2),
          margin: EdgeInsets.all(16),
        );
      }
    } catch (e) {
      Get.snackbar(
        "Error",
        "Failed to connect to the server",
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
        duration: Duration(seconds: 2),
        margin: EdgeInsets.all(16),
      );
      print(e);
    }
  }
}

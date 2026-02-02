import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:get/get.dart';
import 'package:resqtrack/routes.dart';
import 'package:resqtrack/services/storage_service.dart';
import 'package:resqtrack/utils/constant.dart';

class RegisterController extends GetxController {
  Future<void> register(
      String name, String email, String password, String contactNo) async {
    final body = {
      'name': name,
      'email': email,
      'password': password,
      'phone': contactNo,
    };
    try {
      final response = await http.post(
        Uri.parse(Backend.host + "/api/user/register"),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(body),
      );

      if (response.statusCode == 200) {
        Get.snackbar(
          "Success",
          "Registration successful!",
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.green,
          colorText: Colors.white,
          duration: Duration(seconds: 2),
          margin: EdgeInsets.all(16),
        );

        await StorageService.saveUserEmail(email);

        Get.toNamed(Routes.LOGIN);
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
      print(e);
    }
  }
}

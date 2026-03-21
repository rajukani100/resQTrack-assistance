import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:resqtrack/utils/constant.dart';

import '../services/storage_service.dart';

class NearbyServiceController extends GetxController {
  TextEditingController cityController = TextEditingController();
  TextEditingController queryController = TextEditingController();

  var services = <Map<String, dynamic>>[].obs;
  var isLoading = false.obs;

  Future<void> fetchNearbyServices() async {
    String city = cityController.text.trim();
    String query = queryController.text.trim();

    if (city.isEmpty || query.isEmpty) {
      Get.snackbar("Error", "Please enter both city and query",
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white);
      return;
    }

    isLoading.value = true;

    try {
      final url = Uri.parse(Backend.host +
          "/api/community/nearby-services?location=$city&query=$query");
      final response = await http.get(
        url,
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Cookie': 'accessToken=' + (StorageService.getUserCookie() ?? ""),
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data["success"] == true && data["services"] is List) {
          services.value = List<Map<String, dynamic>>.from(data["services"]);
        } else {
          services.clear();
          Get.snackbar("No Results", "No services found",
              snackPosition: SnackPosition.BOTTOM,
              backgroundColor: Colors.orange,
              colorText: Colors.white);
        }
      } else {
        Get.snackbar("Error", "Failed to load services",
            snackPosition: SnackPosition.BOTTOM,
            backgroundColor: Colors.red,
            colorText: Colors.white);
      }
    } catch (e) {
      Get.snackbar("Error", "Could not connect to the server",
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white);
    } finally {
      isLoading.value = false;
    }
  }
}

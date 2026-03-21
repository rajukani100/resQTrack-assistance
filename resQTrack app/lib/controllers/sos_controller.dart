import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import '../routes.dart';
import '../services/storage_service.dart';
import '../utils/constant.dart';
import 'navigation_controller.dart';

class SosController extends GetxController {
  NavigationController navController = Get.find<NavigationController>();
  var isLoading = false.obs;
  var selectedEmergency = "Accident".obs;

  void setEmergency(String value) {
    selectedEmergency.value = value;
  }

  Future<void> sendSOS() async {
    isLoading.value = true;

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        Get.snackbar(
          "Error",
          "Location permission is required",
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      Get.snackbar(
        "Error",
        "Location permission is permanently denied. Please enable it from settings.",
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
      return;
    }

    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      Get.snackbar(
        "Error",
        "Location services are disabled. Please enable them.",
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
      return;
    }

    LocationSettings locationSettings = LocationSettings(
      accuracy: LocationAccuracy.high,
      distanceFilter: 0,
    );
    Position position = await Geolocator.getCurrentPosition(
      locationSettings: locationSettings,
    );

    final Map<String, dynamic> requestBody = {
      "emergencyType": selectedEmergency.value,
      "location": {
        "latitude": position.latitude,
        "longitude": position.longitude,
      }
    };

    try {
      final response = await http.post(
        Uri.parse(Backend.host + "/api/user/sos"),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Cookie': 'accessToken=' + (StorageService.getUserCookie() ?? ""),
        },
        body: jsonEncode(requestBody),
      );

      if (response.statusCode == 201) {
        Future.delayed(Duration.zero, () {
          Get.snackbar(
            "Success",
            jsonDecode(response.body)["message"],
            snackPosition: SnackPosition.BOTTOM,
            backgroundColor: Colors.green,
            colorText: Colors.white,
            duration: Duration(seconds: 2),
            margin: EdgeInsets.all(16),
          );
        });
        navController.changeRoute(Routes.HOME);
      } else {
        Future.delayed(Duration.zero, () {
          Get.snackbar(
            "Error",
            jsonDecode(response.body)["message"],
            snackPosition: SnackPosition.BOTTOM,
            backgroundColor: Colors.red,
            colorText: Colors.white,
            duration: Duration(seconds: 2),
            margin: EdgeInsets.all(16),
          );
        });
      }
    } catch (e) {
      Future.delayed(Duration.zero, () {
        Get.snackbar(
          "Error",
          "Failed to connect to the server",
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
          duration: Duration(seconds: 2),
          margin: EdgeInsets.all(16),
        );
      });

      print(e);
    } finally {
      isLoading.value = false;
    }
  }
}

import 'dart:convert';
import 'package:geolocator/geolocator.dart';
import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:resqtrack/controllers/navigation_controller.dart';
import 'package:resqtrack/routes.dart';
import '../services/storage_service.dart';
import '../utils/constant.dart';

class VehicleIssueController extends GetxController {
  NavigationController navController = Get.find<NavigationController>();
  RxString selectedIssue = ''.obs;
  RxString selectedVehicle = ''.obs;
  TextEditingController additionalInfoController = TextEditingController();
  var isLoading = false.obs;

  final Map<String, String> issueTypes = {
    "Towing": "towing",
    "Flat Tire": "flat_tire",
    "Emergency": "emergency",
    "Out of Fuel": "out_of_fuel",
    "Vehicle Issue": "vehicle_issue",
  };

  final List<String> vehicleTypes = [
    "Car",
    "Bike",
    "Truck",
    "Bus",
  ];

  Future<void> submitIssue() async {
    if (selectedIssue.isEmpty || selectedVehicle.isEmpty) {
      Get.snackbar("Error", "Please select both issue type and vehicle type",
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white);
      return;
    }

    isLoading.value = true;
    try {
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
      Position position = await Geolocator.getCurrentPosition(
        locationSettings: LocationSettings(
          accuracy: LocationAccuracy.high,
          distanceFilter: 0,
        ),
      );

      final issueData = {
        "location": {
          "latitude": position.latitude,
          "longitude": position.longitude
        },
        "status": "pending",
        "issueType": issueTypes[selectedIssue.value],
        "vehicleType": selectedVehicle.value.toLowerCase(),
        "additionalInfo": additionalInfoController.text,
      };

      try {
        final response = await http.post(
          Uri.parse(Backend.host + "/api/user/request"),
          headers: {
            'Content-Type': 'application/json',
            'Cookie': 'accessToken=' + (StorageService.getUserCookie() ?? ""),
          },
          body: jsonEncode(issueData),
        );
        print(jsonEncode(issueData));
        print(StorageService.getUserCookie());
        if (response.statusCode == 201) {
          Get.snackbar(
            "Success",
            jsonDecode(response.body)["message"],
            snackPosition: SnackPosition.BOTTOM,
            backgroundColor: Colors.green,
            colorText: Colors.white,
            duration: Duration(seconds: 2),
            margin: EdgeInsets.all(16),
          );

          selectedIssue.value = "";
          selectedVehicle.value = "";
          additionalInfoController.clear();

          navController.changeRoute(Routes.HOME);
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
    } catch (e) {
      print(e.toString());
    } finally {
      isLoading.value = false;
    }
  }
}

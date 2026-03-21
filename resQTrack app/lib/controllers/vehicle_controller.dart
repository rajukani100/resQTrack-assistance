import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:resqtrack/services/storage_service.dart';
import 'package:resqtrack/utils/constant.dart';

class VehicleController extends GetxController {
  var make = ''.obs;
  var model = ''.obs;
  var year = ''.obs;
  var licensePlate = ''.obs;
  var isLoading = true.obs;

  @override
  void onInit() {
    super.onInit();
    fetchVehicleDetails();
  }

  Future<void> fetchVehicleDetails() async {
    try {
      final response = await http.get(
        Uri.parse(Backend.host + '/api/user/getvehicledetails'),
        headers: {
          'Cookie': "accessToken=${StorageService.getUserCookie() ?? ""}"
        },
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body)['data'];
        if (data != null) {
          make.value = data['make'] ?? '';
          model.value = data['model'] ?? '';
          year.value = data['year']?.toString() ?? '';
          licensePlate.value = data['licensePlate'] ?? '';
        }
      }
    } catch (e) {
      print("Error fetching vehicle details: $e");
      Future.delayed(Duration.zero, () {
        Get.snackbar(
          "Error",
          e.toString(),
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.green,
          colorText: Colors.white,
          duration: Duration(seconds: 2),
          margin: EdgeInsets.all(16),
        );
      });
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> saveVehicleInfo({
    required String makeValue,
    required String modelValue,
    required String yearValue,
    required String licensePlateValue,
  }) async {
    isLoading.value = true;

    try {
      final response = await http.put(
        Uri.parse(Backend.host + '/api/user/update-vehicle'),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': "accessToken=${StorageService.getUserCookie() ?? ""}"
        },
        body: json.encode({
          'make': makeValue,
          'model': modelValue,
          'year': yearValue,
          'licensePlate': licensePlateValue,
        }),
      );
      if (response.statusCode == 200) {
        make.value = makeValue;
        model.value = modelValue;
        year.value = yearValue;
        licensePlate.value = licensePlateValue;
        fetchVehicleDetails();
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
        Get.back();
      }
    } catch (e) {
      Future.delayed(Duration.zero, () {
        Get.snackbar(
          "Error",
          e.toString(),
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
          duration: Duration(seconds: 2),
          margin: EdgeInsets.all(16),
        );
      });
      print("Error saving vehicle info: $e");
    } finally {
      isLoading.value = false;
    }
  }
}

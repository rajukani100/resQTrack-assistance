import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../services/storage_service.dart';
import '../utils/constant.dart';

class ProfileController extends GetxController {
  var isLoading = true.obs;
  var userData = {}.obs;

  @override
  void onInit() {
    super.onInit();
    fetchUserProfile();
  }

  Future<void> fetchUserProfile() async {
    try {
      isLoading(true);
      var response = await http.get(
        Uri.parse(Backend.host + "/api/emergency/getuserprofile"),
        headers: {
          'Cookie': "accessToken=${StorageService.getUserCookie() ?? ""}"
        },
      );
      if (response.statusCode == 200) {
        userData.value = json.decode(response.body);
      } else {
        Get.snackbar("Error", "Failed to load profile");
      }
    } catch (e) {
      Get.snackbar("Error", e.toString());
    } finally {
      isLoading(false);
    }
  }

  Future<void> updateEmergencyContact(
      String contactId, String name, String phone) async {
    try {
      var response = await http.put(
        Uri.parse("${Backend.host}/api/emergency/update/$contactId"),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': "accessToken=${StorageService.getUserCookie() ?? ""}"
        },
        body: json.encode({"name": name, "phone": phone}),
      );

      if (response.statusCode == 200) {
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
        fetchUserProfile();
        Get.back(); // Close dialog
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
          e.toString(),
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
          duration: Duration(seconds: 2),
          margin: EdgeInsets.all(16),
        );
      });
    }
  }

  Future<void> addEmergencyContact(String name, String phone) async {
    var body = {"name": name, "phone": phone};
    try {
      var response =
          await http.post(Uri.parse("${Backend.host}/api/emergency/addcontact"),
              headers: {
                'Content-Type': 'application/json',
                'Cookie': "accessToken=${StorageService.getUserCookie() ?? ""}"
              },
              body: json.encode(body));

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
        fetchUserProfile(); // Refresh UI after deletion
        Get.back();
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
          e.toString(),
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
          duration: Duration(seconds: 2),
          margin: EdgeInsets.all(16),
        );
      });
    }
  }

  Future<void> deleteEmergencyContact(String contactId) async {
    try {
      var response = await http.delete(
        Uri.parse("${Backend.host}/api/emergency/delete/$contactId"),
        headers: {
          'Cookie': "accessToken=${StorageService.getUserCookie() ?? ""}"
        },
      );

      if (response.statusCode == 200) {
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
        fetchUserProfile(); // Refresh UI after deletion
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
          e.toString(),
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
          duration: Duration(seconds: 2),
          margin: EdgeInsets.all(16),
        );
      });
    }
  }
}

import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:resqtrack/routes.dart';
import 'package:resqtrack/services/storage_service.dart';
import 'dart:convert';

import 'package:resqtrack/utils/constant.dart';

class CommunityController extends GetxController {
  var isLoading = true.obs;
  RxList<dynamic> posts = <dynamic>[].obs;

  @override
  void onInit() {
    super.onInit();
    fetchPosts();
  }

  Future<void> addPost(
      String title, String description, String category) async {
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

      LocationSettings ls = LocationSettings(accuracy: LocationAccuracy.high);
      // Fetch current location
      Position position =
          await Geolocator.getCurrentPosition(locationSettings: ls);

      double latitude = position.latitude;
      double longitude = position.longitude;

      // Create post data
      var newPost = {
        "title": title,
        "description": description,
        "location": {"latitude": latitude, "longitude": longitude},
        "category": category,
      };

      try {
        var response = await http.post(
            Uri.parse(
              Backend.host + "/api/community/create",
            ),
            headers: {
              'Content-Type': 'application/json',
              'Cookie': "accessToken=${StorageService.getUserCookie() ?? ""}"
            },
            body: jsonEncode(newPost));
        if (response.statusCode == 201) {
          await fetchPosts();
          Get.snackbar(
            "Sucess",
            jsonDecode(response.body)["message"],
            snackPosition: SnackPosition.BOTTOM,
            backgroundColor: Colors.green,
            colorText: Colors.white,
          );
          Get.back();
        } else {
          Get.snackbar(
            "Error",
            jsonDecode(response.body)["message"],
            snackPosition: SnackPosition.BOTTOM,
            backgroundColor: Colors.red,
            colorText: Colors.white,
          );
        }
      } catch (e) {
        Get.snackbar(
          "Sucess",
          e.toString(),
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
      } finally {
        isLoading.value = false;
      }
    } catch (e) {
      Get.snackbar(
        "Sucess",
        e.toString(),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> fetchPosts() async {
    try {
      isLoading(true);
      var response = await http.get(
          Uri.parse(
            Backend.host + "/api/community/nearby",
          ),
          headers: {
            'Cookie': "accessToken=${StorageService.getUserCookie() ?? ""}"
          });

      if (response.statusCode == 200) {
        var jsonData = json.decode(response.body);
        posts.assignAll(List<Map<String, dynamic>>.from(jsonData['data']));
      } else {
        Get.snackbar(
          "Error",
          jsonDecode(response.body)["message"],
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
      }
    } catch (e) {
      Get.snackbar(
        "Error",
        e.toString(),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    } finally {
      isLoading(false);
    }
  }

  Future<void> addReply(String postId, String message) async {
    try {
      var response = await http.post(
        Uri.parse(Backend.host + "/api/community/${postId}/reply"),
        headers: {
          "Content-Type": "application/json",
          'Cookie': "accessToken=${StorageService.getUserCookie() ?? ""}"
        },
        body: jsonEncode({"message": message}),
      );

      if (response.statusCode == 200) {
        Get.back();
        Get.snackbar(
          "Sucess",
          jsonDecode(response.body)["message"],
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.green,
          colorText: Colors.white,
        );
        await fetchPosts();
      } else {
        Get.snackbar(
          "Error",
          jsonDecode(response.body)["message"],
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
      }
    } catch (e) {
      Get.snackbar(
        "Error",
        e.toString(),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    }
  }
}

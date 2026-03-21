import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:latlong2/latlong.dart';
import 'package:resqtrack/controllers/home_controller.dart';
import 'package:resqtrack/services/storage_service.dart';
import 'package:resqtrack/utils/constant.dart';

class NearbyMechanicsController extends GetxController {
  HomeController homeController = Get.find<HomeController>();
  TextEditingController radiusController = TextEditingController();
  var isLoading = false.obs;
  var mechanics = [].obs;
  var userLocation = LatLng(22.5511749, 72.9185381).obs;
  @override
  void onInit() {
    super.onInit();
    userLocation = homeController.currentLocation;
  }

  Future<void> fetchNearbyMechanics() async {
    isLoading.value = true;
    final double radius = double.tryParse(radiusController.text) ?? 10.0;
    final Map<String, dynamic> requestBody = {
      "latitude": userLocation.value.latitude,
      "longitude": userLocation.value.longitude,
      "radius": radius
    };

    try {
      var response = await http.post(
        Uri.parse(Backend.host + "/api/emergency/find-nearby-mechanics"),
        headers: {
          "Content-Type": "application/json",
          "Cookie": "session_id=" + (StorageService.getUserCookie() ?? "")
        },
        body: jsonEncode(requestBody),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data["success"] == true) {
          mechanics.value = data["mechanics"]
              .map((m) => {
                    "_id": m["_id"],
                    "name": m["name"],
                    "phone": m["phone"],
                    "servicesOffered": m["servicesOffered"],
                    "distance": m["distance"],
                    "location": LatLng(
                        m["location"]["latitude"], m["location"]["longitude"]),
                  })
              .toList();
        } else {
          mechanics.clear();
        }
      } else {
        mechanics.clear();
      }
    } catch (e) {
      mechanics.clear();
      print("Error fetching mechanics: $e");
    } finally {
      isLoading.value = false;
    }
  }
}

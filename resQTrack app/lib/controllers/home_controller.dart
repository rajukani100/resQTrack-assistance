import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:get/get.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart';
import 'package:http/http.dart' as http;
import 'package:resqtrack/screens/post_details_view.dart';
import 'package:resqtrack/utils/constant.dart';

import '../services/storage_service.dart';

class HomeController extends GetxController {
  final Rx<LatLng> currentLocation = LatLng(22.5511749, 72.9185381).obs;
  final RxString area = "Locating...".obs;
  final MapController mapController = MapController();

  @override
  void onInit() {
    super.onInit();
    getUserLocation();
  }

  Future<void> getUserLocation() async {
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
    Position position =
        await Geolocator.getCurrentPosition(locationSettings: locationSettings);

    final String url =
        "https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.latitude}&lon=${position.longitude}";

    try {
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        Map<String, dynamic> data = json.decode(response.body);
        if (data["display_name"].isNotEmpty) {
          // var result = data["results"][0];
          // String suburb = result["suburb"] ?? "";
          // String pincode = result["postcode"] ?? "";
          // String city = result["state_district"] ?? "";
          // String location = suburb.isNotEmpty ? suburb : city;

          // String location = result["country"];

          area.value = data["display_name"];
        }
      }
    } catch (e) {
      print("Error: $e");
    }

    currentLocation.value = LatLng(position.latitude, position.longitude);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      mapController.move(currentLocation.value, 15);
    });

    //save location to db

    var location = {
      "location": {
        "latitude": position.latitude,
        "longitude": position.longitude
      }
    };
    try {
      await http.post(Uri.parse(Backend.host + "/api/user/update-location"),
          headers: {
            "Content-Type": "application/json",
            "Cookie": "accessToken=" + (StorageService.getUserCookie() ?? "")
          },
          body: jsonEncode(location));
    } catch (e) {
      print("Error: $e");
    }
  }
}

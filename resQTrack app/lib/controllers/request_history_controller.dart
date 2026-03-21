import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:resqtrack/main.dart';
import 'package:resqtrack/utils/constant.dart';
import '../services/storage_service.dart';

class RequestHistoryController extends GetxController {
  var isLoading = false.obs;
  var requestHistory = [].obs;
  RxMap<String, int> userRatings = <String, int>{}.obs;

  @override
  void onInit() {
    super.onInit();
    _loadLocalRatings();
    fetchRequestHistory();
  }

  void _loadLocalRatings() {
    final ratedRequests = StorageService.getRatedRequestIds();
    for (var reqId in ratedRequests) {
      userRatings[reqId] = 1; // Marked as rated; actual rating not needed
    }
  }

  Future<void> submitRating(String mechId, int rating, String reqId) async {
    try {
      final response = await http.post(
        Uri.parse(Backend.host + "/api/user/ratemechanic/$mechId"),
        headers: {
          'Content-Type': 'application/json',
          "Cookie": "accessToken=${StorageService.getUserCookie() ?? ""}"
        },
        body: jsonEncode({"rating": rating}),
      );

      if (response.statusCode == 200) {
        // Store in local observable map
        userRatings[reqId] = rating;

        // Save locally to prevent re-rating
        StorageService.markRequestAsRated(reqId);

        Get.snackbar(
          "Success",
          "You rated successfully",
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.green,
          colorText: Colors.white,
        );
      } else {
        Get.snackbar(
          "Error",
          "Failed to rate.",
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

  Future<void> fetchRequestHistory() async {
    isLoading.value = true;
    try {
      var response = await http.get(
        Uri.parse(Backend.host + "/api/user/requesthistory"),
        headers: {
          "Content-Type": "application/json",
          "Cookie": "accessToken=${StorageService.getUserCookie() ?? ""}"
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data["success"] == "true") {
          requestHistory.value = data["findrequest"];
        } else {
          requestHistory.clear();
        }
      } else {
        requestHistory.clear();
      }
    } catch (e) {
      requestHistory.clear();
      print("Error fetching request history: $e");
    } finally {
      isLoading.value = false;
    }
  }
}

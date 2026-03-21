import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:resqtrack/services/storage_service.dart';
import 'package:resqtrack/utils/constant.dart';

class WalletController extends GetxController {
  var availableCredit = 0.obs;
  var products = [].obs;
  var isLoading = true.obs;
  var isPurchasing = false.obs;

  final cookie = "accessToken=${StorageService.getUserCookie()!}";
  @override
  void onInit() {
    super.onInit();
    fetchUserCredit();
    fetchProducts();
  }

  Future<void> fetchUserCredit() async {
    try {
      final res = await http.get(
        Uri.parse(Backend.host + '/api/emergency/getuserprofile'),
        headers: {'Cookie': cookie},
      );
      final data = jsonDecode(res.body);
      print(data);
      availableCredit.value = data['credits'];
    } catch (e) {
      Get.snackbar("Error", "Failed to fetch credit");
    }
  }

  Future<void> fetchProducts() async {
    try {
      isLoading.value = true;
      final res = await http.get(
        Uri.parse(Backend.host + '/api/product/getproducts'),
        headers: {'Cookie': cookie},
      );
      final data = jsonDecode(res.body);
      products.value = data['data'];
    } catch (e) {
      Get.snackbar(
        "Error",
        "Failed to fetch.",
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> purchaseProduct(Map product) async {
    final cost = int.parse(product['coins'].toString());

    if (availableCredit.value < cost) {
      Get.snackbar(
        "Info",
        "Not enough coin available.",
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
      return;
    }

    final newBalance = availableCredit.value - cost;

    try {
      isPurchasing.value = true;

      final res = await http.put(
        Uri.parse(Backend.host + '/api/product/updatecredits'),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookie,
        },
        body: jsonEncode({"updatecoin": newBalance}),
      );

      final responseData = jsonDecode(res.body);

      if (res.statusCode == 200 && responseData['success']) {
        availableCredit.value = newBalance;
        Get.snackbar(
          "Success",
          "You have successfully Redeemed.",
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.green,
          colorText: Colors.white,
        );
      } else {
        Get.snackbar(
          "Error",
          responseData["message"],
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.green,
          colorText: Colors.white,
        );
      }
    } catch (e) {
      Get.snackbar(
        "Error",
        e.toString(),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.green,
        colorText: Colors.white,
      );
    } finally {
      isPurchasing.value = false;
    }
  }
}

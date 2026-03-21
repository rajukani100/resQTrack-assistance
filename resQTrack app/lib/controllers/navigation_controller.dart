import 'dart:convert';

import 'package:get/get.dart';
import 'package:resqtrack/services/storage_service.dart';
import 'package:http/http.dart' as http;
import 'package:resqtrack/utils/constant.dart';
import '../routes.dart';

class NavigationController extends GetxController {
  var name = "Guest".obs;
  var isLoggedin = RxBool(false); // Ensure it's initialized properly
  var currentRoute = Routes.HOME.obs;

  @override
  void onInit() {
    super.onInit();
    isLoggedin.value = StorageService.isLoggedIn(); // Update value correctly
    getUserInfo();
  }

  void changeLoggedinState(bool val) {
    if (val == false) {
      StorageService.logout();
    }
    isLoggedin.value = val;
  }

  void changeRoute(String route) {
    currentRoute.value = route;
  }

  Future<void> getUserInfo() async {
    try {
      final response = await http.get(
          Uri.parse(Backend.host + "/api/emergency/getuserprofile"),
          headers: {
            'Cookie': "accessToken=${StorageService.getUserCookie() ?? ""}"
          });

      if (response.statusCode == 200) {
        name.value = jsonDecode(response.body)["name"];
      }
    } catch (e) {
      // Catch network errors, JSON parsing issues, etc.
      print("Exception occurred: $e");
      return null;
    }
  }
}

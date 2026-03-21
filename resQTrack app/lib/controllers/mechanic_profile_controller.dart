import 'dart:convert';

import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:resqtrack/services/storage_service.dart';
import 'package:resqtrack/utils/constant.dart';

class MechanicController extends GetxController {
  var isLoading = true.obs;
  var address = "".obs;
  var mechanicData = {}.obs;

  Future<void> fetchMechanicDetails(String id) async {
    try {
      isLoading.value = true;

      // Fetch mechanic details
      var response = await http.get(
        Uri.parse('${Backend.host}/api/emergency/mechanic/$id'),
        headers: {
          'Cookie': "accessToken=${StorageService.getUserCookie() ?? ""}"
        },
      );

      if (response.statusCode != 200) {
        Get.snackbar("Error", "Failed to load mechanic data");
        return;
      }

      var jsonData = json.decode(response.body);
      mechanicData.value = jsonData['response'];

      // Extract location details safely
      var locationData = jsonData["response"]["location"];
      if (locationData == null ||
          locationData["latitude"] == null ||
          locationData["longitude"] == null) {
        Get.snackbar("Error", "Location data not available");
        return;
      }

      // Fetch address using OpenStreetMap API
      var locationResponse = await http.get(
        Uri.parse(
            "https://nominatim.openstreetmap.org/reverse?format=json&lat=${locationData["latitude"]}&lon=${locationData["longitude"]}"),
      );
      print(locationResponse.body);
      if (locationResponse.statusCode == 200) {
        var locationJson = jsonDecode(locationResponse.body);
        address.value = locationJson["display_name"] ?? "Address not found";
      } else {
        Get.snackbar("Error", "Failed to load address");
      }
    } catch (e) {
      Get.snackbar("Error", "An error occurred while fetching data: $e");
    } finally {
      isLoading.value = false;
    }
  }
}

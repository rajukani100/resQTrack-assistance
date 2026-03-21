import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:resqtrack/services/storage_service.dart';
import 'package:resqtrack/utils/constant.dart';

class ResQTagController extends GetxController {
  var resQTagCardNo = RxnString();
  var isLoading = true.obs;
  var isGenerating = false.obs;

  @override
  void onInit() {
    super.onInit();
    fetchResQTagDetails();
  }

  Future<void> fetchResQTagDetails() async {
    try {
      final response = await http.get(
          Uri.parse(Backend.host + '/api/user/getresqtagdetails'),
          headers: {
            'Cookie': "accessToken=${StorageService.getUserCookie() ?? ""}"
          });
      if (response.statusCode == 200) {
        final data = json.decode(response.body)['data'];
        resQTagCardNo.value = data != null ? data['resQTagCardNo'] : null;
      }
    } catch (e) {
      print("Error fetching details: $e");
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> assignResQTag() async {
    isGenerating.value = true;
    try {
      final response = await http
          .post(Uri.parse(Backend.host + '/api/user/assign-resqtag'), headers: {
        'Content-Type': 'application/json',
        'Cookie': "accessToken=${StorageService.getUserCookie() ?? ""}"
      });
      if (response.statusCode == 200) {
        fetchResQTagDetails();
      }
    } catch (e) {
      print("Error assigning tag: $e");
    } finally {
      isGenerating.value = false;
    }
  }
}

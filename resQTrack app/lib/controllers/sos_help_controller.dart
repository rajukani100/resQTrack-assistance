import 'dart:io';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:mime/mime.dart';
import 'package:resqtrack/services/storage_service.dart';
import 'package:resqtrack/utils/constant.dart';

class SosHelpController extends GetxController {
  final resqTagController = TextEditingController();
  final descriptionController = TextEditingController();

  final selectedImage = Rxn<File>();
  final isSubmitting = false.obs;

  final ImagePicker _picker = ImagePicker();

  Future<void> pickImage() async {
    final picked = await _picker.pickImage(source: ImageSource.gallery);
    if (picked != null) {
      selectedImage.value = File(picked.path);
    } else {
      Get.snackbar("No image selected", "Please choose an image.");
    }
  }

  Future<void> submitHelpRequest() async {
    final cardnumber = resqTagController.text.trim();
    final description = descriptionController.text.trim();
    final imageFile = selectedImage.value;

    if (cardnumber.isEmpty || description.isEmpty || imageFile == null) {
      Get.snackbar("Missing Fields", "All fields and image are required.");
      return;
    }

    try {
      isSubmitting.value = true;

      final uri = Uri.parse(Backend.host + "/createsosrequest");
      final request = http.MultipartRequest("POST", uri);

      request.fields['cardnumber'] = cardnumber;
      request.fields['description'] = description;

      final mimeType =
          lookupMimeType(imageFile.path)?.split("/") ?? ["image", "jpeg"];
      request.files.add(await http.MultipartFile.fromPath(
        "image",
        imageFile.path,
        contentType: MediaType(mimeType[0], mimeType[1]),
      ));

      request.headers['Cookie'] =
          'accessToken=${StorageService.getUserCookie() ?? ""}';

      final response = await request.send();
      final respStr = await response.stream.bytesToString();

      if (response.statusCode == 201) {
        Get.snackbar(
          "Success",
          "SOS message sent successfully.",
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.green,
          colorText: Colors.white,
        );
        resqTagController.clear();
        descriptionController.clear();
        selectedImage.value = null;
      } else {
        Get.snackbar(
          "Error",
          "Failed to send message.",
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
      isSubmitting.value = false;
    }
  }

  @override
  void onClose() {
    resqTagController.dispose();
    descriptionController.dispose();
    super.onClose();
  }
}

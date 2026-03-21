import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/sos_help_controller.dart';

class SosHelpView extends StatelessWidget {
  SosHelpView({super.key});
  final controller = Get.put(SosHelpController());

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("ResqTag Code"),
          const SizedBox(height: 8),
          TextField(
            controller: controller.resqTagController,
            decoration: InputDecoration(
              hintText: 'Enter ResqTag Code',
              border:
                  OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              filled: true,
              fillColor: Colors.grey.shade100,
            ),
          ),
          const SizedBox(height: 24),
          Text("Upload Image"),
          const SizedBox(height: 8),
          Obx(() {
            final imageFile = controller.selectedImage.value;
            return GestureDetector(
              onTap: controller.pickImage,
              child: Container(
                height: 180,
                width: double.infinity,
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey.shade400),
                  borderRadius: BorderRadius.circular(12),
                  color: Colors.grey.shade50,
                ),
                child: imageFile != null
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.file(imageFile, fit: BoxFit.cover),
                      )
                    : const Center(child: Text("Tap to upload image")),
              ),
            );
          }),
          const SizedBox(height: 24),
          Text("Description"),
          const SizedBox(height: 8),
          TextField(
            controller: controller.descriptionController,
            maxLines: 4,
            decoration: InputDecoration(
              hintText: 'Write a brief description...',
              border:
                  OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              filled: true,
              fillColor: Colors.grey.shade100,
            ),
          ),
          const SizedBox(height: 30),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: Obx(() => ElevatedButton.icon(
                  onPressed: controller.isSubmitting.value
                      ? null
                      : controller.submitHelpRequest,
                  icon: controller.isSubmitting.value
                      ? const SizedBox(
                          height: 18,
                          width: 18,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white),
                        )
                      : const Icon(Icons.send),
                  label: const Text("Submit"),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                    textStyle: const TextStyle(
                        fontSize: 16, fontWeight: FontWeight.bold),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                )),
          ),
        ],
      ),
    );
  }
}

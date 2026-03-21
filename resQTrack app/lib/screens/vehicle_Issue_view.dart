import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:resqtrack/utils/constant.dart';

import '../controllers/vehicle_issue_controller.dart';

class VehicleIssueView extends StatelessWidget {
  VehicleIssueView({super.key});

  final VehicleIssueController controller = Get.put(VehicleIssueController());

  @override
  Widget build(BuildContext context) {
    return Obx(
      () {
        if (controller.isLoading.value) {
          return Center(
              child: CircularProgressIndicator(color: AppColors.primary));
        }
        return SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Report a Vehicle Issue",
                  style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87),
                ),
                const SizedBox(height: 20),
                _buildDropdown(
                    "Select Issue Type",
                    controller.issueTypes.keys.toList(),
                    controller.selectedIssue),
                const SizedBox(height: 20),
                _buildDropdown("Select Vehicle Type", controller.vehicleTypes,
                    controller.selectedVehicle),
                const SizedBox(height: 20),
                _buildAdditionalInfoField(),
                const SizedBox(height: 30),
                _buildSubmitButton(),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildDropdown(
      String label, List<String> items, RxString selectedValue) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.black87)),
        const SizedBox(height: 8),
        Obx(() => Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade400),
                boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)],
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  isExpanded: true,
                  value:
                      selectedValue.value.isEmpty ? null : selectedValue.value,
                  hint: const Text("Select"),
                  items: items.map((item) {
                    return DropdownMenuItem(
                      value: item,
                      child: Text(item),
                    );
                  }).toList(),
                  onChanged: (value) => selectedValue.value = value!,
                ),
              ),
            )),
      ],
    );
  }

  Widget _buildAdditionalInfoField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Additional Information",
            style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.black87)),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)],
          ),
          child: TextField(
            controller: controller.additionalInfoController,
            maxLines: 3,
            decoration: InputDecoration(
              hintText: "Describe the issue...",
              contentPadding: const EdgeInsets.all(12),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSubmitButton() {
    return Center(
      child: ElevatedButton(
        onPressed: () => controller.submitIssue(),
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          padding: const EdgeInsets.symmetric(horizontal: 50, vertical: 14),
          elevation: 4,
        ),
        child: const Text("Submit",
            style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.white)),
      ),
    );
  }
}

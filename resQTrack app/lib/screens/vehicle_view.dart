import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/vehicle_controller.dart';
import 'package:resqtrack/utils/constant.dart';

class VehicleView extends StatelessWidget {
  final VehicleController controller = Get.put(VehicleController());

  @override
  Widget build(BuildContext context) {
    return Obx(() {
      if (controller.isLoading.value) {
        return Center(
            child: CircularProgressIndicator(color: AppColors.primary));
      }

      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 15),
        child: Card(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          elevation: 4,
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  "Vehicle Details",
                  style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary),
                ),
                SizedBox(height: 20),
                if (controller.make.value.isNotEmpty) ...[
                  _buildVehicleInfoTile("Make", controller.make.value),
                  _buildVehicleInfoTile("Model", controller.model.value),
                  _buildVehicleInfoTile("Year", controller.year.value),
                  _buildVehicleInfoTile(
                      "License Plate", controller.licensePlate.value),
                  SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () => _showVehicleBottomSheet(isEdit: true),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10)),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 30, vertical: 8),
                    ),
                    child: const Text("Edit",
                        style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.white)),
                  ),
                ] else ...[
                  Center(
                    child: Column(
                      children: [
                        Text("No vehicle details found",
                            style: TextStyle(fontSize: 16, color: Colors.grey)),
                        SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: () =>
                              _showVehicleBottomSheet(isEdit: false),
                          style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary),
                          child: Text("Add Vehicle",
                              style: TextStyle(color: Colors.white)),
                        ),
                      ],
                    ),
                  )
                ],
              ],
            ),
          ),
        ),
      );
    });
  }

  Widget _buildVehicleInfoTile(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          Text(value, style: TextStyle(fontSize: 16, color: Colors.grey[700])),
        ],
      ),
    );
  }

  void _showVehicleBottomSheet({required bool isEdit}) {
    TextEditingController makeController =
        TextEditingController(text: isEdit ? controller.make.value : "");
    TextEditingController modelController =
        TextEditingController(text: isEdit ? controller.model.value : "");
    TextEditingController yearController =
        TextEditingController(text: isEdit ? controller.year.value : "");
    TextEditingController licensePlateController = TextEditingController(
        text: isEdit ? controller.licensePlate.value : "");

    Get.bottomSheet(
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      Padding(
        padding: EdgeInsets.only(
          left: 20,
          right: 20,
          bottom: MediaQuery.of(Get.context!).viewInsets.bottom + 20,
          top: 20,
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Text(
                  "Vehicle Info",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
              ),
              SizedBox(height: 20),
              _buildTextField("Make", makeController),
              _buildTextField("Model", modelController),
              _buildTextField("Year", yearController,
                  keyboardType: TextInputType.number),
              _buildTextField("License Plate", licensePlateController),
              SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  ElevatedButton(
                    onPressed: () => Get.back(),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey[400],
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      padding:
                          EdgeInsets.symmetric(horizontal: 30, vertical: 10),
                    ),
                    child: Text(
                      "Cancel",
                      style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.white),
                    ),
                  ),
                  SizedBox(width: 10),
                  ElevatedButton(
                    onPressed: () async {
                      await controller.saveVehicleInfo(
                        licensePlateValue: licensePlateController.text,
                        makeValue: makeController.text,
                        modelValue: modelController.text,
                        yearValue: yearController.text,
                      );
                      Get.back(); // close the bottom sheet after saving
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      padding:
                          EdgeInsets.symmetric(horizontal: 30, vertical: 10),
                    ),
                    child: Text(
                      isEdit ? "Update" : "Save",
                      style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.white),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller,
      {TextInputType keyboardType = TextInputType.text}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: TextField(
        controller: controller,
        keyboardType: keyboardType,
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(),
        ),
      ),
    );
  }
}

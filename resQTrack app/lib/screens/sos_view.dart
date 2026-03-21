import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:resqtrack/controllers/sos_controller.dart';

import '../utils/constant.dart';

class SosView extends StatelessWidget {
  final SosController controller = Get.put(SosController());

  SosView({super.key});

  @override
  Widget build(BuildContext context) {
    return Obx(
      () {
        if (controller.isLoading.value) {
          return Center(
              child: CircularProgressIndicator(
            color: AppColors.primary,
          ));
        }
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 100),
                Text(
                  "Emergency Assistance",
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.red.shade900,
                  ),
                ),
                const SizedBox(height: 20),

                // Dropdown Button for Emergency Type (GetX)
                Obx(() => DropdownButtonFormField<String>(
                      value: controller.selectedEmergency.value,
                      decoration: InputDecoration(
                        labelText: "Select Emergency Type",
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      items: ["Accident", "Crime", "Safety"]
                          .map((String type) => DropdownMenuItem(
                                value: type,
                                child: Text(type),
                              ))
                          .toList(),
                      onChanged: (value) => controller.setEmergency(value!),
                    )),

                const SizedBox(height: 30),

                // SOS Button
                ElevatedButton(
                  onPressed: controller.sendSOS,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    padding: const EdgeInsets.symmetric(
                        vertical: 15, horizontal: 50),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: const Text(
                    "SEND SOS",
                    style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white),
                  ),
                ),

                const SizedBox(height: 20),

                // Emergency Note
                Text(
                  "⚠️ Use SOS only in real emergencies. False alerts may delay help for others in need.\n"
                  "Ensure your location is enabled for quick assistance.",
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 14, color: Colors.red.shade700),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

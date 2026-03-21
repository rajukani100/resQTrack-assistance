import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:resqtrack/utils/constant.dart';
import '../controllers/nearby_service_controller.dart';

class NearbyServiceView extends StatelessWidget {
  final NearbyServiceController controller = Get.put(NearbyServiceController());

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header with Search Inputs
          Container(
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.primary,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Find Nearby Services",
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold)),
                SizedBox(height: 10),
                TextField(
                  controller: controller.cityController,
                  decoration: InputDecoration(
                    floatingLabelBehavior: FloatingLabelBehavior.never,
                    filled: true,
                    fillColor: Colors.white,
                    labelText: "Enter City",
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                ),
                SizedBox(height: 10),
                TextField(
                  controller: controller.queryController,
                  decoration: InputDecoration(
                    floatingLabelBehavior: FloatingLabelBehavior.never,
                    filled: true,
                    fillColor: Colors.white,
                    labelText: "Enter Service Query",
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                ),
                SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: controller.fetchNearbyServices,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text("Search",
                        style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primary)),
                  ),
                ),
              ],
            ),
          ),
          SizedBox(height: 20),
          // Service List
          Expanded(
            child: Obx(() {
              if (controller.isLoading.value) {
                return Container(
                  child: Center(
                      child: CircularProgressIndicator(
                    color: AppColors.primary,
                  )),
                );
              }
              if (controller.services.isEmpty) {
                return Center(
                  child: Text("No services found",
                      style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          color: Colors.grey)),
                );
              }
              return ListView.builder(
                itemCount: controller.services.length,
                itemBuilder: (context, index) {
                  final service = controller.services[index];
                  return Card(
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    elevation: 3,
                    margin: EdgeInsets.symmetric(vertical: 8),
                    child: ListTile(
                      title: Text(service["name"],
                          style: TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 16)),
                      subtitle: Text(service["address"],
                          style: TextStyle(color: Colors.grey[700])),
                      trailing:
                          Icon(Icons.location_on, color: AppColors.primary),
                    ),
                  );
                },
              );
            }),
          ),
          // Loading Overlay
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:resqtrack/controllers/home_controller.dart';
import 'package:resqtrack/screens/mechanic_profile_view.dart';

import '../controllers/nearby_meachnics_controller.dart';
import '../utils/constant.dart';

class NearbyMechanicsView extends StatelessWidget {
  final NearbyMechanicsController controller =
      Get.put(NearbyMechanicsController());
  final HomeController homeController = Get.find<HomeController>();

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16.0),
            width: double.infinity,
            decoration: BoxDecoration(
              color: AppColors.primary,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(10),
                topRight: Radius.circular(10),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Nearby Mechanics",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: controller.radiusController,
                  decoration: InputDecoration(
                    filled: true,
                    floatingLabelBehavior: FloatingLabelBehavior.never,
                    fillColor: Colors.white,
                    labelText: "Enter Search Radius (km)",
                    hintText: "Default is 10km",
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      FocusScope.of(context).unfocus();
                      controller.fetchNearbyMechanics();
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: AppColors.primary,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text("Search"),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          TabBar(
            indicatorColor: AppColors.primary,
            labelColor: AppColors.primary,
            tabs: const [
              Tab(text: "Details"),
              Tab(text: "Map View"),
            ],
          ),
          Expanded(
            child: TabBarView(
              children: [
                // Mechanics List View
                Obx(() {
                  if (controller.isLoading.value) {
                    return Center(
                        child: CircularProgressIndicator(
                            color: AppColors.primary));
                  }
                  if (controller.mechanics.isEmpty) {
                    return const Center(child: Text("No mechanics found"));
                  }
                  return ListView.builder(
                    itemCount: controller.mechanics.length,
                    itemBuilder: (context, index) {
                      final mechanic = controller.mechanics[index];
                      return GestureDetector(
                        onTap: () {
                          Get.to(MechanicProfileView(
                            mechanicId: mechanic["_id"],
                          ));
                        },
                        child: Padding(
                          padding: const EdgeInsets.all(2.0),
                          child: Card(
                            elevation: 4,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8)),
                            child: ListTile(
                              title: Text(mechanic["name"],
                                  style: const TextStyle(
                                      fontWeight: FontWeight.bold)),
                              subtitle: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text("Phone: ${mechanic["phone"]}"),
                                  Text(
                                      "Services: ${mechanic["servicesOffered"].join(", ")}"),
                                ],
                              ),
                              trailing: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.location_on,
                                      color: AppColors.primary),
                                  Text(
                                      "${mechanic["distance"].toStringAsFixed(2)} km",
                                      style:
                                          TextStyle(color: AppColors.primary)),
                                ],
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  );
                }),
                // Map View
                Obx(() => FlutterMap(
                      options: MapOptions(
                        initialCenter: homeController.currentLocation.value,
                        initialZoom: 13.0,
                      ),
                      children: [
                        TileLayer(
                          urlTemplate:
                              "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                        ),
                        MarkerLayer(
                          markers: [
                            // User Location Marker
                            Marker(
                              width: 80.0,
                              height: 80.0,
                              point: homeController.currentLocation.value,
                              child: Column(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(4),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(5),
                                      boxShadow: [
                                        const BoxShadow(
                                          color: Colors.black26,
                                          blurRadius: 3,
                                        ),
                                      ],
                                    ),
                                    child: const Text(
                                      "You",
                                      style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                  const Icon(Icons.person_pin_circle,
                                      color: Colors.red, size: 40),
                                ],
                              ),
                            ),
                            // Nearby Mechanics Markers with Labels
                            ...controller.mechanics.map((mechanic) => Marker(
                                  width: 80.0,
                                  height: 80.0,
                                  point: mechanic["location"] as LatLng,
                                  child: Column(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(4),
                                        decoration: BoxDecoration(
                                          color: Colors.white,
                                          borderRadius:
                                              BorderRadius.circular(5),
                                          boxShadow: const [
                                            BoxShadow(
                                              color: Colors.black26,
                                              blurRadius: 3,
                                            ),
                                          ],
                                        ),
                                        child: Text(
                                          mechanic["name"],
                                          style: const TextStyle(
                                              fontSize: 12,
                                              fontWeight: FontWeight.w600),
                                        ),
                                      ),
                                      Icon(Icons.person_pin_circle,
                                          color: AppColors.primary, size: 40),
                                    ],
                                  ),
                                )),
                          ],
                        ),
                      ],
                    )),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

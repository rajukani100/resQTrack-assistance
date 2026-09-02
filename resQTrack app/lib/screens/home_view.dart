import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:get/get.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:resqtrack/controllers/home_controller.dart';
import 'package:resqtrack/controllers/navigation_controller.dart';
import 'package:resqtrack/routes.dart';
import 'package:resqtrack/services/storage_service.dart';
import 'package:resqtrack/utils/constant.dart';
import 'package:resqtrack/widgets/service_card.dart';

import '../models/service_model.dart';

class HomeView extends StatefulWidget {
  @override
  _HomeViewState createState() => _HomeViewState();
}

class _HomeViewState extends State<HomeView> {
  final HomeController homeController = Get.put(HomeController());
  final NavigationController navigationController =
      Get.find<NavigationController>();

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Stack(
        children: [
          Positioned.fill(
            child: Obx(
              () => FlutterMap(
                mapController:
                    homeController.mapController, // Attach controller
                options: MapOptions(
                    initialCenter: homeController.currentLocation.value,
                    initialZoom: 18,
                    minZoom: 1,
                    maxZoom: 19),
                children: [
                  TileLayer(
                      urlTemplate:
                          'https://tile.openstreetmap.org/{z}/{x}/{y}.png'),
                  MarkerLayer(
                    markers: [
                      Marker(
                        width: 80.0,
                        height: 80.0,
                        point: homeController.currentLocation.value,
                        child: Column(
                          children: [
                            Container(
                              padding: EdgeInsets.all(4),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(5),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black26,
                                    blurRadius: 3,
                                  ),
                                ],
                              ),
                              child: Text(
                                "You",
                                style: TextStyle(
                                    fontSize: 12, fontWeight: FontWeight.bold),
                              ),
                            ),
                            Icon(Icons.person_pin_circle,
                                color: Colors.red, size: 40),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          Positioned.fill(
            child: Column(
              children: [
                Padding(
                  padding: EdgeInsets.all(20),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Padding(
                      padding: EdgeInsets.all(15),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Row(
                              children: [
                                Icon(Icons.my_location),
                                SizedBox(width: 10),
                                Expanded(
                                  child: Obx(
                                    () => Text(
                                      homeController.area.value,
                                      style: TextStyle(
                                          overflow: TextOverflow.ellipsis,
                                          fontWeight: FontWeight.w600,
                                          fontSize: 15),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          GestureDetector(
                            child: Icon(Icons.refresh),
                            onTap: () async {
                              homeController.getUserLocation();
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: DraggableScrollableSheet(
                    initialChildSize: 0.4,
                    minChildSize: 0.2,
                    maxChildSize: 0.96,
                    builder: (BuildContext context,
                        ScrollController scrollController) {
                      List<ServiceCardData> serviceCardsList = [
                        ServiceCardData(
                            number: "01",
                            title: "Emergency",
                            services: [
                              "Trigger SOS",
                              "Live Tracking",
                            ],
                            route: Routes.SOS),
                        ServiceCardData(
                            number: "02",
                            title: "Vehicle Issues",
                            services: [
                              "Towing",
                              "Out of Fuel",
                            ],
                            route: Routes.VEHICLE_ISSUE),
                        ServiceCardData(
                            number: "03",
                            title: "ResQTag",
                            services: [
                              "Scan ResQTag",
                              "Emergency Alert",
                            ],
                            route: Routes.RESQTAG),
                        ServiceCardData(
                            number: "04",
                            title: "Nearby Services",
                            services: [
                              "Find Mechanic",
                              "Find Petrol Pump",
                            ],
                            route: Routes.NEARBY_SERVICE),
                        ServiceCardData(
                            number: "05",
                            title: "My Requests",
                            services: [
                              "Active Requests",
                              "Service History",
                            ],
                            route: Routes.REQUEST_HISTORY),
                        ServiceCardData(
                            number: "06",
                            title: "Settings",
                            services: [
                              "My Profile",
                              "Logout",
                            ],
                            route: Routes.PROFILE),
                      ];

                      return GestureDetector(
                        behavior: HitTestBehavior.translucent,
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: const BorderRadius.vertical(
                                top: Radius.circular(16)),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black26,
                                blurRadius: 5,
                                spreadRadius: 1,
                              ),
                            ],
                          ),
                          child: Column(
                            children: [
                              Container(
                                width: 40,
                                height: 5,
                                margin: const EdgeInsets.symmetric(vertical: 8),
                                decoration: BoxDecoration(
                                  color: Colors.grey[400],
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                              Expanded(
                                child: SingleChildScrollView(
                                  controller: scrollController,
                                  child: Padding(
                                    padding: const EdgeInsets.all(5.0),
                                    child: Column(
                                      children: [
                                        Padding(
                                          padding: EdgeInsets.symmetric(
                                              vertical: 15),
                                          child: Text(
                                            "We're ready for your car's worst day",
                                            style: TextStyle(
                                                fontWeight: FontWeight.w600,
                                                color: AppColors.primary,
                                                fontSize: 18),
                                          ),
                                        ),
                                        GridView.builder(
                                          shrinkWrap: true,
                                          physics:
                                              NeverScrollableScrollPhysics(),
                                          gridDelegate:
                                              SliverGridDelegateWithFixedCrossAxisCount(
                                            crossAxisCount: 2,
                                          ),
                                          itemCount: serviceCardsList.length,
                                          itemBuilder: (context, index) {
                                            return Padding(
                                                padding: EdgeInsets.all(7),
                                                child: GestureDetector(
                                                  onTap: () {
                                                    navigationController
                                                        .changeRoute(
                                                            serviceCardsList[
                                                                    index]
                                                                .route);
                                                  },
                                                  child: ServiceCard(
                                                    number:
                                                        serviceCardsList[index]
                                                            .number,
                                                    services:
                                                        serviceCardsList[index]
                                                            .services,
                                                    title:
                                                        serviceCardsList[index]
                                                            .title,
                                                  ),
                                                ));
                                          },
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

import 'dart:convert';

import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:get/get.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:resqtrack/controllers/home_controller.dart';
import 'package:resqtrack/routes.dart';
import 'package:resqtrack/screens/community_view.dart';
import 'package:resqtrack/screens/home_view.dart';
import 'package:resqtrack/screens/nearby_mechanics_view.dart';
import 'package:resqtrack/screens/nearby_service_view.dart';
import 'package:resqtrack/screens/profile_view.dart';
import 'package:resqtrack/screens/request_history_view.dart';
import 'package:resqtrack/screens/resqtag_view.dart';
import 'package:resqtrack/screens/sos_help_view.dart';
import 'package:resqtrack/screens/sos_view.dart';
import 'package:resqtrack/screens/vehicle_Issue_view.dart';
import 'package:resqtrack/screens/vehicle_view.dart';
import 'package:resqtrack/screens/wallet_view.dart';
import 'package:resqtrack/services/storage_service.dart';
import 'package:resqtrack/utils/constant.dart';
import 'package:resqtrack/widgets/service_card.dart';

import '../controllers/navigation_controller.dart';
import '../models/service_model.dart';

class BaseView extends StatefulWidget {
  @override
  _BaseViewState createState() => _BaseViewState();
}

class _BaseViewState extends State<BaseView> {
  final NavigationController navController = Get.find<NavigationController>();

  String? userEmail = StorageService.getUserEmail();

  Widget _getBody(String route) {
    switch (route) {
      case Routes.HOME:
        return HomeView();
      case Routes.VEHICLE_ISSUE:
        return VehicleIssueView();
      case Routes.SOS:
        return SosView();
      case Routes.NEARBY_SERVICE:
        return NearbyServiceView();
      case Routes.NEARBY_MECHANICS:
        return NearbyMechanicsView();
      case Routes.PROFILE:
        return ProfileView();
      case Routes.RESQTAG:
        return ResQTagView();
      case Routes.VEHICLE:
        return VehicleView();
      case Routes.COMMUNITY:
        return CommunityView();
      case Routes.REQUEST_HISTORY:
        return RequestHistoryView();
      case Routes.SOS_HELP:
        return SosHelpView();
      case Routes.WALLET:
        return WalletView();
      default:
        return HomeView();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Center(
          child: Text(
            'resQtrack',
            style: GoogleFonts.lato(
                fontWeight: FontWeight.bold, color: AppColors.primary),
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: GestureDetector(
              child: Icon(Icons.person),
              onTap: () {
                navController.changeRoute(Routes.PROFILE);
              },
            ),
          ),
        ],
      ),
      drawer: Drawer(
        child: SafeArea(
          child: ListView(
            padding: EdgeInsets.zero,
            children: <Widget>[
              Padding(
                padding: EdgeInsets.symmetric(vertical: 15, horizontal: 10),
                child: Row(
                  children: [
                    Icon(
                      Icons.person,
                      size: 40,
                    ),
                    SizedBox(width: 10),
                    Flexible(
                      child: Container(
                        child: Obx(
                          () => Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                overflow: TextOverflow.ellipsis,
                                navController.name.value,
                                textAlign: TextAlign.left,
                                style: TextStyle(
                                  fontSize: 19,
                                ),
                              ),
                              Text(
                                overflow: TextOverflow.ellipsis,
                                userEmail!,
                                style: TextStyle(
                                  fontSize: 15,
                                ),
                              )
                            ],
                          ),
                        ),
                      ),
                    )
                  ],
                ),
              ),
              Divider(),
              DrawerItem(icon: Icons.home, label: "Home", route: Routes.HOME),
              DrawerItem(
                  icon: Icons.sos, label: "Emergency", route: Routes.SOS),
              DrawerItem(
                icon: Icons.attribution,
                label: "Neaby Mechanics",
                onTap: () => navController.changeRoute(Routes.NEARBY_MECHANICS),
              ),
              DrawerItem(
                  icon: Icons.car_crash,
                  label: "Vehicle Issues",
                  route: Routes.VEHICLE_ISSUE),
              DrawerItem(
                  icon: Icons.near_me,
                  label: "Nearby Services",
                  route: Routes.NEARBY_SERVICE),
              DrawerItem(
                  icon: Icons.tag, label: "resQtag", route: Routes.RESQTAG),
              DrawerItem(
                  icon: Icons.credit_score,
                  label: "resQassist",
                  route: Routes.SOS_HELP),
              DrawerItem(
                  icon: Icons.monetization_on,
                  label: "resQcredit",
                  route: Routes.WALLET),
              DrawerItem(
                  icon: Icons.group,
                  label: "Community",
                  route: Routes.COMMUNITY),
              DrawerItem(
                  icon: Icons.car_rental_outlined,
                  label: "Vehicle info",
                  route: Routes.VEHICLE),
              DrawerItem(
                  icon: Icons.history,
                  label: "Service History",
                  route: Routes.REQUEST_HISTORY),
              DrawerItem(
                icon: Icons.person,
                label: "Profile",
                onTap: () => navController.changeRoute(Routes.PROFILE),
              ),
              DrawerItem(
                icon: Icons.logout,
                label: "Logout",
                onTap: () {
                  navController.changeLoggedinState(false);
                },
              ),
            ],
          ),
        ),
      ),
      body: Obx(() => _getBody(navController.currentRoute.value)),
    );
  }
}

class DrawerItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String? route;
  final VoidCallback? onTap;

  const DrawerItem(
      {required this.icon, required this.label, this.route, this.onTap});

  @override
  Widget build(BuildContext context) {
    final NavigationController navController = Get.find<NavigationController>();

    return ListTile(
      leading: Icon(icon, color: Colors.black54),
      title: Text(label, style: TextStyle(fontSize: 16)),
      onTap: () {
        if (route != null) {
          navController.changeRoute(route!);
        } else {
          onTap?.call();
        }
        Get.back(); // Close drawer after navigation
      },
    );
  }
}

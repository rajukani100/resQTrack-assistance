import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:resqtrack/controllers/navigation_controller.dart';
import 'package:resqtrack/routes.dart';
import 'package:resqtrack/utils/constant.dart';
import '../controllers/mechanic_profile_controller.dart';

class MechanicProfileView extends StatefulWidget {
  final String mechanicId;

  const MechanicProfileView({Key? key, required this.mechanicId})
      : super(key: key);

  @override
  State<MechanicProfileView> createState() => _MechanicProfileViewState();
}

class _MechanicProfileViewState extends State<MechanicProfileView> {
  final NavigationController navController = Get.find<NavigationController>();
  final MechanicController controller = Get.put(MechanicController());

  void loadData() async {
    await controller.fetchMechanicDetails(widget.mechanicId);
  }

  @override
  void initState() {
    super.initState();
    loadData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Mechanic Profile")),
      body: Obx(() {
        if (controller.isLoading.value) {
          return Center(
              child: CircularProgressIndicator(
            color: AppColors.primary,
          ));
        }
        var mechanic = controller.mechanicData;
        return Padding(
          padding: EdgeInsets.all(16),
          child: Card(
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            elevation: 4,
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("${mechanic['name']}",
                      style:
                          TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                  SizedBox(height: 10),
                  Row(
                    children: [
                      Icon(Icons.phone, color: Colors.blue),
                      SizedBox(width: 5),
                      Text(mechanic['phone'], style: TextStyle(fontSize: 16))
                    ],
                  ),
                  Row(
                    children: [
                      Icon(Icons.email, color: Colors.blue),
                      SizedBox(width: 5),
                      Text(mechanic['email'], style: TextStyle(fontSize: 16))
                    ],
                  ),
                  SizedBox(height: 10),
                  Text("Address:",
                      style: TextStyle(fontWeight: FontWeight.bold)),
                  Obx(() => Text(controller.address.value,
                      style: TextStyle(fontSize: 16))),
                  SizedBox(height: 10),
                  Text("Rating:",
                      style: TextStyle(fontWeight: FontWeight.bold)),
                  RatingBarIndicator(
                    rating: mechanic['rating']['averageRating'].toDouble(),
                    itemBuilder: (context, index) => Icon(
                      Icons.star,
                      color: Colors.amber,
                    ),
                    itemCount: 5,
                    itemSize: 24.0,
                    direction: Axis.horizontal,
                  ),
                  Text("(${mechanic['rating']['totalReviews']} reviews)"),
                  SizedBox(height: 10),
                  Text("Services Offered:",
                      style: TextStyle(fontWeight: FontWeight.bold)),
                  Wrap(
                    spacing: 8,
                    children:
                        mechanic['servicesOffered'].map<Widget>((service) {
                      return Chip(label: Text(service));
                    }).toList(),
                  ),
                  SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        Get.back();
                        navController.changeRoute(Routes.VEHICLE_ISSUE);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: Text(
                        "Add Service",
                        style: TextStyle(color: Colors.white, fontSize: 15),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      }),
    );
  }
}

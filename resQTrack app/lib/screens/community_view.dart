import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:resqtrack/routes.dart';
import 'package:resqtrack/screens/post_details_view.dart';
import 'package:resqtrack/utils/constant.dart';
import 'package:url_launcher/url_launcher.dart';

import '../controllers/community_controller.dart';

class CommunityView extends StatelessWidget {
  final CommunityController controller = Get.put(CommunityController());

  Future<void> _launchMap(double lat, double lng) async {
    final Uri url = Uri.parse('https://www.google.com/maps?q=$lat,$lng');

    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    } else {
      Get.snackbar("Error", "Could not open the map.");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Stack(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Text(
                  "Community",
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              SizedBox(height: 12),
              Expanded(
                child: RefreshIndicator(
                  onRefresh: controller.fetchPosts,
                  child: Obx(() {
                    if (controller.isLoading.value) {
                      return Center(
                        child:
                            CircularProgressIndicator(color: AppColors.primary),
                      );
                    }

                    if (controller.posts.isEmpty) {
                      return Center(
                        child: Text("No posts found",
                            style: TextStyle(
                                fontSize: 16, fontWeight: FontWeight.w500)),
                      );
                    }

                    return ListView.builder(
                      itemCount: controller.posts.length,
                      itemBuilder: (context, index) {
                        var post = controller.posts[index];
                        final lat = post["location"]["latitude"];
                        final lng = post["location"]["longitude"];

                        return GestureDetector(
                          onTap: () =>
                              Get.to(() => PostDetailsView(post: post)),
                          child: Card(
                            shape: RoundedRectangleBorder(
                              side: BorderSide(width: 0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            elevation: 4,
                            color: Colors.white,
                            margin: EdgeInsets.only(bottom: 12),
                            child: Padding(
                              padding: EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(post["title"],
                                      style: TextStyle(
                                          fontSize: 20,
                                          fontWeight: FontWeight.bold)),
                                  SizedBox(height: 6),
                                  Text(post["description"],
                                      style: TextStyle(
                                          fontSize: 16,
                                          color: Colors.grey[700])),
                                  SizedBox(height: 10),
                                  Row(
                                    children: [
                                      Icon(Icons.person,
                                          size: 18, color: Colors.grey),
                                      SizedBox(width: 6),
                                      Text(
                                          "Posted by: ${post["user"]["name"] ?? "Anonymous"}",
                                          style: TextStyle(
                                              fontStyle: FontStyle.italic,
                                              color: Colors.grey[800])),
                                    ],
                                  ),
                                  SizedBox(height: 6),
                                  GestureDetector(
                                    onTap: () async {
                                      try {
                                        await _launchMap(lat, lng);
                                      } catch (e) {
                                        print(e.toString());
                                        Get.snackbar(
                                          "Error",
                                          e.toString(),
                                          snackPosition: SnackPosition.BOTTOM,
                                          backgroundColor: Colors.red,
                                          colorText: Colors.white,
                                        );
                                      }
                                    },
                                    child: Row(
                                      children: [
                                        Icon(Icons.location_on,
                                            size: 18, color: Colors.red),
                                        SizedBox(width: 6),
                                        Text("View Location on Map",
                                            style: TextStyle(
                                                color: Colors.red,
                                                decoration:
                                                    TextDecoration.underline)),
                                      ],
                                    ),
                                  ),
                                  SizedBox(height: 10),
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Container(
                                        padding: EdgeInsets.symmetric(
                                            horizontal: 10, vertical: 5),
                                        decoration: BoxDecoration(
                                          color: Colors.blue[100],
                                          borderRadius:
                                              BorderRadius.circular(8),
                                        ),
                                        child: Text(post["category"],
                                            style: TextStyle(
                                                color: const Color.fromRGBO(
                                                    33, 150, 243, 1),
                                                fontWeight: FontWeight.w600)),
                                      ),
                                      Text(
                                        post["status"],
                                        style: TextStyle(
                                          color: post["status"] == "Open"
                                              ? Colors.green
                                              : Colors.red,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      )
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    );
                  }),
                ),
              ),
            ],
          ),
          Positioned(
            bottom: 20,
            right: 0,
            child: FloatingActionButton(
              backgroundColor: AppColors.primary,
              onPressed: () {
                Get.toNamed(Routes.ADDPOST);
              },
              child: Icon(Icons.add, color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }
}

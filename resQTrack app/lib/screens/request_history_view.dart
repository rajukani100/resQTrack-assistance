import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import '../controllers/request_history_controller.dart';
import 'package:resqtrack/utils/constant.dart';

class RequestHistoryView extends StatelessWidget {
  final RequestHistoryController controller =
      Get.put(RequestHistoryController());

  String formatDate(String timestamp) {
    try {
      final dateTime = DateTime.parse(timestamp);
      return DateFormat('dd MMM yyyy • hh:mm a').format(dateTime);
    } catch (e) {
      return timestamp;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(12),
          child: Center(
            child: Text(
              "History",
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
          ),
        ),
        Expanded(
          child: RefreshIndicator(
            onRefresh: controller.fetchRequestHistory,
            child: Obx(() {
              if (controller.isLoading.value) {
                return Center(
                    child: CircularProgressIndicator(color: AppColors.primary));
              }

              if (controller.requestHistory.isEmpty) {
                return Center(child: Text("No request history found"));
              }

              return ListView.builder(
                padding: EdgeInsets.all(12),
                itemCount: controller.requestHistory.length,
                itemBuilder: (context, index) {
                  final request = controller.requestHistory[index];
                  final requestId = request["_id"].toString();
                  final status = request["status"]?.toLowerCase() ?? "";
                  final isCompleted = status == "completed";

                  Color statusColor(String status) {
                    switch (status) {
                      case "pending":
                        return Colors.orange;
                      case "cancelled":
                        return Colors.red;
                      case "completed":
                        return Colors.green;
                      default:
                        return Colors.grey;
                    }
                  }

                  return Card(
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    elevation: 4,
                    margin: EdgeInsets.symmetric(vertical: 8),
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.miscellaneous_services_rounded,
                                  color: AppColors.primary),
                              SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  "Request ID: $requestId",
                                  style: TextStyle(
                                      overflow: TextOverflow.ellipsis,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13),
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 8),
                          Text("Service Type: ${request["serviceType"]}"),
                          Text("Vehicle Type: ${request["vehicleType"]}"),
                          SizedBox(height: 6),
                          Text.rich(
                            TextSpan(
                              children: [
                                TextSpan(
                                    text: "Status: ",
                                    style: TextStyle(color: Colors.black)),
                                TextSpan(
                                  text: request["status"],
                                  style: TextStyle(
                                    color: statusColor(request["status"] ?? ""),
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          SizedBox(height: 6),
                          Text(
                              "Created At: ${formatDate(request["createdAt"])}"),
                          if (isCompleted) ...[
                            SizedBox(height: 12),
                            Divider(),
                            Text(
                              "Rate your experience:",
                              style: TextStyle(fontWeight: FontWeight.w600),
                            ),
                            SizedBox(height: 6),
                            Obx(() {
                              final currentRating =
                                  controller.userRatings[requestId] ?? 0;
                              final isRated =
                                  controller.userRatings.containsKey(requestId);

                              return isRated
                                  ? Text(
                                      "Already Submitted",
                                      style: TextStyle(
                                        color: Colors.green,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    )
                                  : Row(
                                      children: List.generate(5, (i) {
                                        return IconButton(
                                          icon: Icon(
                                            i < currentRating
                                                ? Icons.star
                                                : Icons.star_border,
                                            color: Colors.amber,
                                          ),
                                          onPressed: () {
                                            controller.submitRating(
                                              request["assignedMechanic"],
                                              i + 1,
                                              requestId,
                                            );
                                          },
                                        );
                                      }),
                                    );
                            })
                          ]
                        ],
                      ),
                    ),
                  );
                },
              );
            }),
          ),
        ),
      ],
    );
  }
}

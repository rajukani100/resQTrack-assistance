import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:resqtrack/utils/constant.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../controllers/resqtag_controller.dart';

class ResQTagView extends StatelessWidget {
  final ResQTagController controller = Get.put(ResQTagController());

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          "ResQTag Service",
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: AppColors.primary,
          ),
        ),
        SizedBox(height: 20),
        Obx(() {
          if (controller.isLoading.value) {
            return Center(
              child: CircularProgressIndicator(
                color: AppColors.primary,
              ),
            );
          }
          return Center(
            child: Card(
              elevation: 10,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              margin: EdgeInsets.all(20),
              child: Padding(
                padding: EdgeInsets.all(20),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (controller.resQTagCardNo.value != null) ...[
                      QrImageView(
                        data: controller.resQTagCardNo.value!,
                        size: 200,
                        backgroundColor: Colors.white,
                      ),
                      SizedBox(height: 20),
                      Text(
                        "ResQTag Code: ${controller.resQTagCardNo.value}",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primary,
                        ),
                      ),
                    ] else ...[
                      Icon(
                        Icons.qr_code_rounded,
                        size: 100,
                        color: AppColors.primary,
                      ),
                      SizedBox(height: 20),
                      Obx(() {
                        return ElevatedButton(
                          onPressed: controller.isGenerating.value
                              ? null
                              : controller.assignResQTag,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            padding: EdgeInsets.symmetric(
                                vertical: 12, horizontal: 20),
                          ),
                          child: controller.isGenerating.value
                              ? SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                    color: Colors.white,
                                    strokeWidth: 2,
                                  ),
                                )
                              : Text(
                                  "Generate ResQTag",
                                  style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.white),
                                ),
                        );
                      }),
                    ],
                  ],
                ),
              ),
            ),
          );
        }),
      ],
    );
  }
}

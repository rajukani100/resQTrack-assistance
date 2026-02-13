import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:resqtrack/controllers/navigation_controller.dart';
import 'package:resqtrack/routes.dart';
import 'package:resqtrack/utils/constant.dart';
import '../controllers/profile_controller.dart';

class ProfileView extends StatelessWidget {
  final ProfileController controller = Get.put(ProfileController());
  NavigationController navController = Get.find<NavigationController>();

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: controller.fetchUserProfile,
      child: Obx(() {
        if (controller.isLoading.value) {
          return Center(
              child: CircularProgressIndicator(
            color: AppColors.primary,
          ));
        }

        Map<String, dynamic> userData =
            Map<String, dynamic>.from(controller.userData);
        return SingleChildScrollView(
          physics: AlwaysScrollableScrollPhysics(),
          padding: EdgeInsets.symmetric(horizontal: 15, vertical: 10),
          child: Column(
            children: [
              Center(
                child: Text(
                  "Profile",
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                ),
              ),
              SizedBox(height: 14),
              _buildProfileSection(userData),
              SizedBox(height: 16),
              _buildEmergencyContacts(userData["emergencyContacts"]),
              SizedBox(height: 16),
              _buildResQTag(userData),
            ],
          ),
        );
      }),
    );
  }

  Widget _buildProfileSection(Map<String, dynamic> userData) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 2,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            _buildProfileDetail(
                Icons.person, "Name", userData["name"] ?? "N/A"),
            _buildProfileDetail(
                Icons.email, "Email", userData["email"] ?? "N/A"),
            _buildProfileDetail(
                Icons.phone, "Phone", userData["phone"] ?? "N/A"),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileDetail(IconData icon, String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, color: AppColors.primary),
          SizedBox(width: 12),
          Expanded(
            child: Text(value, style: TextStyle(fontSize: 16)),
          ),
        ],
      ),
    );
  }

  Widget _buildEmergencyContacts(List<dynamic>? contacts) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 2,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Emergency Contacts",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            SizedBox(height: 10),
            contacts != null && contacts.isNotEmpty
                ? Column(
                    children: contacts.map((contact) {
                      return ListTile(
                        leading: Icon(Icons.phone, color: AppColors.primary),
                        title: Text(contact["name"],
                            style: TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text(contact["phone"]),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: Icon(Icons.edit, color: Colors.green),
                              onPressed: () {
                                _showEditBottomSheet(contact);
                              },
                            ),
                            IconButton(
                              icon: Icon(Icons.delete, color: Colors.red),
                              onPressed: () {
                                controller
                                    .deleteEmergencyContact(contact["_id"]);
                              },
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  )
                : Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      child: Text("No emergency contacts available.",
                          style: TextStyle(color: Colors.grey)),
                    ),
                  ),
            SizedBox(height: 10),
            Center(
              child: ElevatedButton(
                onPressed: () => _showAddBottomSheet(),
                style: ElevatedButton.styleFrom(
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                ),
                child: Text("Add Contact"),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResQTag(Map<String, dynamic> userData) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 2,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text("ResQTag Code",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            SizedBox(height: 8),
            userData["resQTagCardNo"] != null
                ? Text(userData["resQTagCardNo"],
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold))
                : Column(
                    children: [
                      SizedBox(height: 20),
                      Text("You can generate code from below."),
                      SizedBox(height: 10),
                      ElevatedButton(
                        onPressed: () =>
                            {navController.changeRoute(Routes.RESQTAG)},
                        style: ElevatedButton.styleFrom(
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12)),
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          padding: EdgeInsets.symmetric(
                              horizontal: 24, vertical: 12),
                        ),
                        child: Text("Generate ResQTag",
                            style: TextStyle(fontSize: 16)),
                      ),
                    ],
                  )
          ],
        ),
      ),
    );
  }

  void _showEditBottomSheet(Map<String, dynamic> contact) {
    TextEditingController nameController =
        TextEditingController(text: contact["name"]);
    TextEditingController phoneController =
        TextEditingController(text: contact["phone"]);

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
            children: [
              Text(
                "Edit Contact",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 16),
              TextField(
                controller: nameController,
                decoration: InputDecoration(
                  labelText: "Name",
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
              SizedBox(height: 12),
              TextField(
                controller: phoneController,
                keyboardType: TextInputType.phone,
                decoration: InputDecoration(
                  labelText: "Phone",
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
              SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Get.back(),
                    style: ElevatedButton.styleFrom(
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                      backgroundColor: Colors.grey[400],
                      foregroundColor: Colors.white,
                      padding:
                          EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    ),
                    child: Text("Cancel"),
                  ),
                  SizedBox(width: 15),
                  ElevatedButton(
                    onPressed: () async {
                      controller.updateEmergencyContact(
                        contact["_id"],
                        nameController.text,
                        phoneController.text,
                      );
                      Get.back();
                    },
                    style: ElevatedButton.styleFrom(
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                      padding:
                          EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    ),
                    child: Text("Save"),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showAddBottomSheet() {
    TextEditingController nameController = TextEditingController();
    TextEditingController phoneController = TextEditingController();

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
            children: [
              Text(
                "Add Contact",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 16),
              TextField(
                controller: nameController,
                decoration: InputDecoration(
                  labelText: "Name",
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
              SizedBox(height: 12),
              TextField(
                controller: phoneController,
                keyboardType: TextInputType.phone,
                decoration: InputDecoration(
                  labelText: "Phone",
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
              SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Get.back(),
                    style: ElevatedButton.styleFrom(
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                      backgroundColor: Colors.grey[400],
                      foregroundColor: Colors.white,
                      padding:
                          EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    ),
                    child: Text("Cancel"),
                  ),
                  SizedBox(width: 15),
                  ElevatedButton(
                    onPressed: () async {
                      await controller.addEmergencyContact(
                        nameController.text,
                        phoneController.text,
                      );
                      Get.back();
                    },
                    style: ElevatedButton.styleFrom(
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                      padding:
                          EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    ),
                    child: Text("Add"),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

Widget _buildResQTag(Map<String, dynamic> userData) {
  return Card(
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    elevation: 4,
    child: Padding(
      padding: EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text("ResQTag Code",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          SizedBox(height: 5),
          userData["resQTagCardNo"] != null
              ? Text(userData["resQTagCardNo"],
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold))
              : Column(
                  children: [
                    SizedBox(height: 20),
                    Text("You can generate code from below."),
                    SizedBox(height: 5),
                    ElevatedButton(
                      onPressed: () => {},
                      style: ElevatedButton.styleFrom(
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                        padding:
                            EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      ),
                      child: Text("Generate ResQTag",
                          style: TextStyle(fontSize: 16)),
                    ),
                  ],
                )
        ],
      ),
    ),
  );
}

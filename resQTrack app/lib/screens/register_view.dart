import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:resqtrack/services/storage_service.dart';
import 'package:resqtrack/utils/constant.dart';
import '../controllers/register_controller.dart';
import 'login_view.dart';
import 'home_view.dart';

class RegisterView extends StatelessWidget {
  final RegisterController registerController = Get.put(RegisterController());

  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController contactController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: 24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  "Create Account",
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: AppColors.secondary,
                  ),
                ),
                SizedBox(height: 20),
                Card(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 5,
                  child: Padding(
                    padding: EdgeInsets.all(20.0),
                    child: Column(
                      children: [
                        TextField(
                          controller: nameController,
                          decoration: InputDecoration(
                            labelText: "Full Name",
                            prefixIcon:
                                Icon(Icons.person, color: AppColors.primary),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                        SizedBox(height: 16),
                        TextField(
                          controller: emailController,
                          decoration: InputDecoration(
                            labelText: "Email",
                            prefixIcon:
                                Icon(Icons.email, color: AppColors.primary),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                        SizedBox(height: 16),
                        TextField(
                          controller: passwordController,
                          obscureText: true,
                          decoration: InputDecoration(
                            labelText: "Password",
                            prefixIcon:
                                Icon(Icons.lock, color: AppColors.primary),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                        SizedBox(height: 16),
                        TextField(
                          controller: contactController,
                          keyboardType: TextInputType.phone,
                          decoration: InputDecoration(
                            labelText: "Contact Number",
                            prefixIcon: Icon(Icons.phone_android,
                                color: AppColors.primary),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                        SizedBox(height: 20),
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.secondary,
                            foregroundColor: AppColors.background,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            minimumSize: Size(double.infinity, 50),
                          ),
                          onPressed: () async {
                            if (contactController.text != "" &&
                                nameController.text != "" &&
                                emailController.text != "" &&
                                passwordController.text != "") {
                              registerController.register(
                                  nameController.text,
                                  emailController.text,
                                  passwordController.text,
                                  contactController.text);
                            }
                          },
                          child:
                              Text("Register", style: TextStyle(fontSize: 18)),
                        ),
                        TextButton(
                          onPressed: () => Get.to(() => LoginView()),
                          child: Text("Already have an account? Login",
                              style: TextStyle(color: AppColors.primary)),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

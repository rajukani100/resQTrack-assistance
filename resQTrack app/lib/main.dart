import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:resqtrack/screens/base_view.dart';
import 'package:resqtrack/screens/login_view.dart';
import 'package:resqtrack/utils/constant.dart';
import 'controllers/navigation_controller.dart';
import 'routes.dart';
import 'services/storage_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await GetStorage.init();
  Get.put(NavigationController());
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  final NavigationController navController = Get.find<NavigationController>();
  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      theme: ThemeData(
        textTheme: GoogleFonts.latoTextTheme(
          Theme.of(context).textTheme,
        ),
        useMaterial3: true,
        inputDecorationTheme: InputDecorationTheme(
          floatingLabelStyle: TextStyle(color: AppColors.primary),
          border: OutlineInputBorder(),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: AppColors.primary), // When focused
          ),
        ),
      ),
      debugShowCheckedModeBanner: false,
      getPages: Routes.pages,
      home: AuthWrapper(),
    );
  }
}

class AuthWrapper extends StatelessWidget {
  final NavigationController navController = Get.find<NavigationController>();

  @override
  Widget build(BuildContext context) {
    return Obx(() {
      return navController.isLoggedin.value
          ? BaseView() // Show home when logged in
          : LoginView(); // Show login when logged out
    });
  }
}

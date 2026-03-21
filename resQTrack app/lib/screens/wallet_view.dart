import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/wallet_controller.dart';

class WalletView extends StatelessWidget {
  WalletView({super.key});

  final controller = Get.put(WalletController());

  @override
  Widget build(BuildContext context) {
    return Obx(() {
      if (controller.isLoading.value) {
        return const Center(
          child: CircularProgressIndicator(
            color: Colors.blue,
          ),
        );
      }

      return Container(
        color: Colors.white,
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Wallet Credits Display
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.blue.shade50,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  const Icon(Icons.account_balance_wallet,
                      size: 32, color: Colors.blue),
                  const SizedBox(width: 12),
                  Text(
                    "ResQCredits: ${controller.availableCredit.value}",
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.blue,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Title
            const Text(
              "Redeemable Products",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.blue,
              ),
            ),

            const SizedBox(height: 16),

            // Product List with RefreshIndicator
            Expanded(
              child: RefreshIndicator(
                color: Colors.blue,
                onRefresh: () async {
                  await controller.fetchUserCredit();
                  await controller.fetchProducts();
                },
                child: ListView.builder(
                  itemCount: controller.products.length,
                  itemBuilder: (context, index) {
                    final product = controller.products[index];
                    return Container(
                      margin: const EdgeInsets.symmetric(vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.withOpacity(0.2),
                            blurRadius: 8,
                            offset: const Offset(0, 4),
                          ),
                        ],
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Name + Redeem
                            Row(
                              children: [
                                const Icon(Icons.local_offer,
                                    color: Colors.deepPurple, size: 28),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Text(
                                    product['name'],
                                    style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.black87,
                                    ),
                                  ),
                                ),
                                ElevatedButton(
                                  onPressed: controller.isPurchasing.value
                                      ? null
                                      : () =>
                                          controller.purchaseProduct(product),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.blue,
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                  ),
                                  child: const Text("Redeem"),
                                ),
                              ],
                            ),

                            const SizedBox(height: 10),

                            // Description
                            Text(
                              product['description'],
                              style: const TextStyle(
                                  color: Colors.black87, fontSize: 14),
                            ),

                            const SizedBox(height: 12),

                            // Coins
                            Row(
                              children: [
                                const Icon(Icons.monetization_on,
                                    color: Colors.orange),
                                const SizedBox(width: 4),
                                Text(
                                  "${product['coins']} ResQCredits",
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w600,
                                    color: Colors.orange,
                                  ),
                                ),
                              ],
                            )
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      );
    });
  }
}

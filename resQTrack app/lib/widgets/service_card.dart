import 'package:flutter/material.dart';

class ServiceCard extends StatelessWidget {
  final String number;
  final String title;
  final List<String> services;

  const ServiceCard({
    Key? key,
    required this.number,
    required this.title,
    required this.services,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
      ),
      elevation: 6,
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Stack(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Opacity(
                  opacity: 0.1,
                  child: Text(
                    number,
                    style: TextStyle(
                      fontSize: 33,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                // const SizedBox(height: 8),
                Text(
                  title,
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                  ),
                ),
                // const SizedBox(height: 12),
                ..._buildServiceList(context),
              ],
            ),
            Positioned(
              bottom: 0,
              right: 0,
              child: Icon(
                Icons.arrow_forward_ios,
                size: 20,
                color: Colors.grey.shade400,
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildServiceList(BuildContext context) {
    List<Widget> widgets = [];

    for (int i = 0; i < services.length; i++) {
      widgets.add(
        Padding(
          padding: const EdgeInsets.only(bottom: 0),
          child: Text(
            '• ${services[i]}',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: Colors.grey[700],
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ),
      );
    }

    return widgets;
  }
}

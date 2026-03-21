import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/community_controller.dart';

class PostDetailsView extends StatelessWidget {
  final Map<String, dynamic> post;
  final CommunityController controller = Get.find<CommunityController>();
  final TextEditingController replyController = TextEditingController();

  PostDetailsView({required this.post});

  void _sendReply() {
    String message = replyController.text.trim();
    if (message.isNotEmpty) {
      controller.addReply(post["_id"], message);
      replyController.clear();
    } else {
      Get.snackbar("Error", "Reply cannot be empty");
    }
  }

  @override
  Widget build(BuildContext context) {
    print(post);
    return Scaffold(
      appBar: AppBar(
        title:
            Text("Post Details", style: TextStyle(fontWeight: FontWeight.w600)),
        elevation: 0,
        backgroundColor: Colors.white,
        iconTheme: IconThemeData(color: Colors.black),
      ),
      backgroundColor: Colors.grey[200],
      body: Column(
        children: [
          // Post Content
          Container(
            margin: EdgeInsets.all(16),
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(color: Colors.black12, blurRadius: 8, spreadRadius: 2)
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(post["title"],
                    style:
                        TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                SizedBox(height: 8),
                Text("Category: ${post["category"]}",
                    style: TextStyle(
                        color: Colors.blue, fontWeight: FontWeight.w500)),
                SizedBox(height: 8),
                Text(post["description"],
                    style: TextStyle(fontSize: 16, color: Colors.black87)),
                SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Chip(
                      label: Text(post["status"],
                          style: TextStyle(color: Colors.white)),
                      backgroundColor:
                          post["status"] == "Open" ? Colors.green : Colors.red,
                    ),
                    Text(post["timestamp"].split("T")[0],
                        style: TextStyle(color: Colors.black45)),
                  ],
                ),
              ],
            ),
          ),

          // Replies Section
          Expanded(
            child: Container(
              margin: EdgeInsets.symmetric(horizontal: 16),
              padding: EdgeInsets.symmetric(vertical: 12, horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                      color: Colors.black12, blurRadius: 6, spreadRadius: 1)
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Replies",
                      style:
                          TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  SizedBox(height: 10),
                  Expanded(
                    child: post["responses"].isEmpty
                        ? Center(
                            child: Text("No replies yet",
                                style: TextStyle(color: Colors.black45)))
                        : ListView.builder(
                            itemCount: post["responses"].length,
                            itemBuilder: (context, index) {
                              var reply = post["responses"][index];
                              return Container(
                                margin: EdgeInsets.only(bottom: 10),
                                padding: EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: Colors.grey[100],
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(reply["name"],
                                        style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 16)),
                                    SizedBox(height: 4),
                                    Text(reply["message"],
                                        style: TextStyle(
                                            fontSize: 14,
                                            color: Colors.black87)),
                                    SizedBox(height: 4),
                                    Align(
                                      alignment: Alignment.bottomRight,
                                      child: Text(
                                          reply["timestamp"].split("T")[0],
                                          style: TextStyle(
                                              color: Colors.black45,
                                              fontSize: 12)),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                  ),
                ],
              ),
            ),
          ),

          // Reply Input Section
          Container(
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(color: Colors.black12, blurRadius: 4, spreadRadius: 1)
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: replyController,
                    decoration: InputDecoration(
                      hintText: "Write a reply...",
                      contentPadding:
                          EdgeInsets.symmetric(vertical: 10, horizontal: 16),
                      filled: true,
                      fillColor: Colors.grey[100],
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),
                ),
                SizedBox(width: 8),
                GestureDetector(
                  onTap: _sendReply,
                  child: Container(
                    padding: EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.blue,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(Icons.send, color: Colors.white),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

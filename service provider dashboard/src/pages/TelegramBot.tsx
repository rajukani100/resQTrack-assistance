
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Cookies from "js-cookie";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Send,
  MessageSquare,
  Bell,
  Settings,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Bot
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
const TelegramBot = () => {
  const [chatId, setChatId] = useState("");
  const [connected, setConnected] = useState(false);
  const [autoRespond, setAutoRespond] = useState(true);
  const [sendNotifications, setSendNotifications] = useState(true);



  useEffect(() => {
    const storedChatId = localStorage.getItem("chatId");
    if (storedChatId) {
      setChatId(storedChatId);
      setConnected(true);
    }
  }, []);


  const handleConnect = async () => {
    if (!chatId) {
      toast({
        title: "Error",
        description: "Please enter a valid Telegram Chat ID",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Connecting...",
      description: `Attempting to connect to Telegram chat ${chatId}`,
    });

    const token = Cookies.get("accessToken"); // Get token from cookies

    // Check if chatId already exists in localStorage
    const storedChatId = localStorage.getItem("chatId");
    if (storedChatId) {
      setChatId(storedChatId);
      toast({
        title: "Already Connected",
        description: `You are already connected to Telegram chat ${storedChatId}`,
      });
      return; // Stop further execution
    }

    try {
      const response = await fetch("https://resqtrackbackend.onrender.com/api/user/synctelebot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
        body: JSON.stringify({ chatId }),
      });

      if (response.ok) {
        setConnected(true);
        localStorage.setItem("chatId", chatId); // Store the actual chatId instead of `true`
        toast({
          title: "Connected!",
          description: `Successfully connected to Telegram chat ${chatId}`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Failed",
          description: errorData.message || "Unable to connect. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Error",
        description: "An error occurred while connecting.",
        variant: "destructive",
      });
    }
  };



  const handleDisconnect = () => {
    setConnected(false);
    toast({
      title: "Disconnected",
      description: "Telegram bot has been disconnected",
    });
  };

  const handleRequestAction = (requestId, action) => {
    toast({
      title: `Request ${action === "accept" ? "Accepted" : "Rejected"}`,
      description: `Telegram request ${requestId} has been ${action === "accept" ? "accepted" : "rejected"}`,
    });
  };

  const handleSettingChange = (setting, value) => {
    if (setting === "autoRespond") {
      setAutoRespond(value);
    } else if (setting === "sendNotifications") {
      setSendNotifications(value);
    }

    toast({
      title: "Setting Updated",
      description: `${setting === "autoRespond" ? "Auto-respond" : "Notifications"} setting has been ${value ? "enabled" : "disabled"}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Telegram Bot Integration</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-fleet-blue" />
              Bot Connection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!connected ? (
              <div className="space-y-4">
                <div className="p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center">
                  <Bot className="h-12 w-12 text-gray-400 mb-2" />
                  <h3 className="font-medium mb-1">Connect your Telegram Bot</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Enter your bot's chat ID to start receiving service requests via Telegram
                  </p>
                  <div className="w-full space-y-2">
                    <Label htmlFor="chat-id">Telegram Chat ID</Label>
                    <Input
                      id="chat-id"
                      placeholder="e.g., 123456789"
                      value={chatId}
                      onChange={(e) => setChatId(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      You can find your chat ID by messaging @MechAlert on Telegram
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={handleConnect}
                  disabled={!chatId}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Connect Bot
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-green-50 flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800">Bot Connected</h3>
                    <p className="text-sm text-green-700">
                      Connected to chat ID: {chatId}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="auto-respond">Auto-respond to requests</Label>
                    </div>
                    <Switch
                      id="auto-respond"
                      checked={autoRespond}
                      onCheckedChange={(checked) => handleSettingChange("autoRespond", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="notifications">Send notifications</Label>
                    </div>
                    <Switch
                      id="notifications"
                      checked={sendNotifications}
                      onCheckedChange={(checked) => handleSettingChange("sendNotifications", checked)}
                    />
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleDisconnect}
                >
                  Disconnect Bot
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Telegram Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="accepted">Accepted</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>

              <TabsContent value="pending">

              </TabsContent>

              <TabsContent value="accepted">

              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TelegramBot;

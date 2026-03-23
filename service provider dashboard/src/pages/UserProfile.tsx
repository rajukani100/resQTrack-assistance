
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Car,
  FileText,
  Edit,
  LogOut,
  Settings,
  Trash,
  Key,
  Lock,
  Bell,
  Globe,
  Shield,
  MessageCircle,
} from "lucide-react";

const profileFormSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  bio: z.string().max(160).optional(),
  phone: z.string().min(10, "Please enter a valid phone number."),
  location: z.string().min(5, "Please enter your location."),
});




const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get("accessToken");


      if (!token) {
        setError("No access token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://resqtrackbackend.onrender.com/api/user/getprofiledetails", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const userData = await response.json();
        setData(userData?.finduser);
        console.log(data);

      } catch (err) {
        console.error("Error fetching user data:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (data) {
      console.log("Updated Data:", data);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;



  const profileData = {
    name: `${data.name}`,
    username: "admin",
    email: `${data.email}`,
    avatar: "/placeholder.svg",
    role: `${data.role}`,
    phone: `${data.phone}`,
    location: "Gujarat , India ",
    joinDate: "April 2024",
    bio: "Fleet service professional with over 5 years of experience in the automotive industry.",
    serviceOfferings: [
      ...(Array.isArray(data?.servicesOffered)
        ? data.servicesOffered.map((value, index) => ({
          id: (index + 1).toString(),
          service: value || "Custom Service",
          status: "Available",
          price: "N/A",
          description: "Custom service provided by user",
        }))
        : []),
    ],
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    security: {
      twoFactor: true,
      lastPasswordChange: "3 months ago",
      sessions: 2,
    },
  };



  function onSubmit(values) {
    // This would update the profile in a real application
    console.log(values);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  }

  const updateServiceStatus = (serviceId, newStatus) => {
    // This would update the service status in a real application
    toast({
      title: "Service Status Updated",
      description: `Service status changed to ${newStatus}.`,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">User Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profileData.avatar} alt={profileData.name} />
                <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle>{profileData.name}</CardTitle>
              <CardDescription>{profileData.role}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{profileData.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{profileData.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{profileData.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Joined {profileData.joinDate}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t px-6 py-4">
            <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    View and update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isEditing ? (
                    <>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Username</h4>
                        <p>{profileData.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Email</h4>
                        <p>{profileData.email}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                        <p>{profileData.bio}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                        <p>{profileData.phone}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Location</h4>
                        <p>{profileData.location}</p>
                      </div>
                    </>
                  ) : ("")
                  }
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Offerings</CardTitle>
                  <CardDescription>
                    Manage your services and availability status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profileData.serviceOfferings.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">{service.service}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                service.status === "Available"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-red-100 text-red-800 border-red-200"
                              }
                            >
                              {service.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{service.price}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {service.description}
                          </TableCell>
                          <TableCell>
                            <Select
                              defaultValue={service.status}
                              onValueChange={(value) => updateServiceStatus(service.id, value)}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Available">Available</SelectItem>
                                <SelectItem value="Unavailable">Unavailable</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Add New Service
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for important updates
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={profileData.notifications.email}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your devices
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={profileData.notifications.push}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive text message alerts for critical updates
                      </p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={profileData.notifications.sms}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch checked={profileData.security.twoFactor} />
                  </div>
                  <Separator />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Password</Label>
                      <span className="text-sm text-muted-foreground">
                        Last changed {profileData.security.lastPasswordChange}
                      </span>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Key className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  </div>
                  <Separator />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Active Sessions</Label>
                      <span className="text-sm text-muted-foreground">
                        {profileData.security.sessions} devices
                      </span>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Globe className="mr-2 h-4 w-4" />
                      Manage Sessions
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out of All Devices
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-red-600">Delete Account</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and remove all data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Input type="text" placeholder="Type 'delete' to confirm" />
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button variant="destructive">Delete Account</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

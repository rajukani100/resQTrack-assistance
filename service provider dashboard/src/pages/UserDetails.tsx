
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
//  import Cookies from "js-cookie";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Cookies from "js-cookie";
import { UserMap } from "@/components/maps/UserMap";
import { Calendar, MapPin, Phone, Mail, Clock, Users, Newspaper } from "lucide-react";
import { log } from "console";


const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Requests, setRequests] = useState([]);
  const [data, setData] = useState();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get("accessToken");

      if (!token) {
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
        console.log(userData);

        setData(userData?.finduser);
        // console.log("User Data:", userData);

      } catch (err) {
        console.error("Error fetching user data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      const token = Cookies.get("accessToken");

      try {
        const response = await fetch("https://resqtrackbackend.onrender.com/api/user/getacceptedrequest", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {

          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const requestData = await response.json();
        setRequests(requestData.getallrequest || []); // Ensure it's an array
        // console.log("Requests Data:", requestData);

      } catch (err) {
        console.error("Error fetching requests:", err.message);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    if (!data) return;

    // console.log("Updated Data:", data);
    console.log(data?.location?.latitude, data?.location?.longitude);

    setUser({
      id: "USR-001",
      name: data?.name || "N/A",
      email: data?.email || "N/A",
      phone: data?.phone || "N/A",
      avatar: data?.avatar || "",
      status: "Active",
      lastActive: "Today at 10:30 AM",
      location: "1234 Main St, City, State",
      coordinates: [data?.location?.latitude, data?.location?.longitude],
      joinDate: "April 3, 2025",
      recentActivity: "Updated profile information",
      requests: Requests?.map((value, index) => ({
        id: value?.RequestId || `REQ-${index + 1}`,
        type: value?.serviceType || "Unknown",
        vehicle: value?.vehicleType || "Custom Service",
        date: "Available",
        time: value?.createdAt || "Unknown",
        status: value?.status || "Pending",
      })),
    });

    setLoading(false);
  }, [data, Requests]); // Ensure re-run when Requests changes

  if (loading) {
    return <div>Loading user details...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  // Generate initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const userInitials = getInitials(user.name);


  const updatelocation = () => {
    console.log("Updating location...");

    const token = Cookies.get("accessToken"); // Get token from cookies

    if (!token) {
      console.error("No access token found.");
      return;
    }

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("User Location:", latitude, longitude);

        try {
          const response = await fetch("https://resqtrackbackend.onrender.com/api/emergency/updateservicelocation", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Attach token in Authorization header
            },
            body: JSON.stringify({ latitude, longitude }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Location updated successfully:", data);
        } catch (error) {
          console.error("Error updating location:", error);
        }
      },
      (error) => {
        console.error("Error getting location:", error.message);
      }
    );
  };



  const handleStatusChange = async (requestId, newStatus) => {
    console.log("Updating request", requestId, "to", newStatus);

    const token = Cookies.get("accessToken"); // Make sure your token is stored under this key

    try {
      const response = await fetch(`https://resqtrackbackend.onrender.com/api/user/handlerequeststatus/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token here
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update request status");
      }

      const updatedRequest = await response.json();

      // Update local state with new status
      // setUser((prevUser) => ({
      //   ...prevUser,
      //   requests: prevUser.requests.map((req) =>
      //     req.id == requestId ? { ...req, status: updatedRequest.status } : req
      //   ),
      // }));

      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating request status:", error.message);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">User Details</h2>
        <div className="flex gap-2">
          <Button onClick={() => updatelocation()}>Update Location</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <Badge
                className={
                  user.status === "Active"
                    ? "bg-green-100 text-green-800 border-green-200 mt-1"
                    : "bg-gray-100 text-gray-800 border-gray-200 mt-1"
                }
              >
                {user.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{user.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{user.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Last active: {user.lastActive}</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-3">Location</h3>
              <div className="h-[200px] rounded-lg overflow-hidden">
                <UserMap location={user.coordinates} />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div>
                <h4 className="text-xs text-gray-500 uppercase">Joined</h4>
                <p className="text-sm">{user.joinDate}</p>
              </div>
              <div>
                <h4 className="text-xs text-gray-500 uppercase">Recent Activity</h4>
                <p className="text-sm">{user.recentActivity}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Service Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Requests</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Handle Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>{request.vehicle}</TableCell>
                        <TableCell>
                          {new Date(request.time).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              request.status === "completed"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : request.status === "Cancelled"
                                  ? "bg-red-100 text-red-800 border-red-200"
                                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
                            }
                          >
                            {request.status}
                          </Badge>
                        </TableCell><TableCell>
                          <select
                            value={request.status.toLowerCase()}
                            onChange={(e) => handleStatusChange(request.id, e.target.value)}
                            className="w-[140px] capitalize border rounded-md p-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="pending">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.requests
                      .filter((r) => r.status === "Pending")
                      .map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>{request.type}</TableCell>
                          <TableCell>{request.vehicle}</TableCell>
                          <TableCell>
                            {request.date} at {request.time}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              {request.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="completed">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.requests
                      .filter((r) => r.status === "completed")
                      .map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>{request.type}</TableCell>
                          <TableCell>{request.vehicle}</TableCell>
                          <TableCell>
                            {request.date} at {request.time}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              {request.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetails;

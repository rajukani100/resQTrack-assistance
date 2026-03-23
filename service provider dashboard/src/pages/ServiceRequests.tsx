
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Filter,
  Search,
  MoreHorizontal,
  MapPin,
  FileText,
  Car,
} from "lucide-react";
import { LiveRequestMap } from "@/components/maps/LiveRequestMap";
import { UserMap } from "@/components/maps/UserMap"; // Fixed import
import { generateInvoice } from "@/utils/invoiceGenerator";
import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie"
import { useEffect } from "react";

const ServiceRequests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Requests, setRequests] = useState([]);
  const [data, setData] = useState();

  useEffect(() => {
    const fetchRequests = async () => {
      const token = Cookies.get("accessToken");

      try {
        const response = await fetch("https://resqtrackbackend.onrender.com/api/user/getallrequest", {
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
        console.log("Requests Data:", requestData);

      } catch (err) {
        console.error("Error fetching requests:", err.message);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    if (!Requests) return;
    console.log(Requests);

    setLoading(false);
  }, [data, Requests]); // Ensure re-run when Requests changes

  if (loading) {
    return <div>Loading user details...</div>;
  }



  const requests = Requests.map((mechanic, index) => ({
    _ids: mechanic._id,
    id: mechanic.RequestId || index + 1,
    client: mechanic.userId.name || "Unknown",
    email: mechanic.userId.email,
    vehicle: mechanic?.vehicleType,
    phone: mechanic.userId.phone || "N/A",
    type: mechanic?.serviceType || "N/A", // Replace with actual distance if available
    address: mechanic.address || "Not Available",
    status: mechanic.RequestStatus || "Not Available",
    date: mechanic.createdAt || "Not Available",
    coordinates: mechanic.location
      ? [mechanic.location.latitude, mechanic.location.longitude]
      : [0, 0], // Default coordinates
    time: mechanic.createdAt || ["N/A"],
    location: mechanic.strengths || ["N/A"],
    notes: mechanic.additionalInfo || ["N/A"],
  })) || [];

  const filteredRequests = requests.filter(
    (request) =>
      (searchQuery === "" ||
        request.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.vehicle.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === "all" || request.status === statusFilter) &&
      (typeFilter === "all" || request.type === typeFilter)
  );


  // Function to handle accept/reject request
  const handleStatusChange = async (requestId, newStatus) => {
    const token = Cookies.get("accessToken");
    console.log("Request ID:", requestId);
    // console.log(token);
    // console.log(requestId);

    try {
      const response = await fetch(`https://resqtrackbackend.onrender.com/api/user/acceptrequest/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "in_progress" })  // ✅ Fix: Proper JSON body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const userData = await response.json();
      console.log("Response Data:", userData);  // ✅ Fix: Log the correct response

    } catch (err) {
      console.error("Error updating request status:", err.message);
    }

    toast({
      title: "Status Updated",
      description: `Request ${requestId} has been marked as ${newStatus.toLowerCase()}.`,
    });

  };

  const handleDeclinechange = async (requestId, newStatus) => {
    const token = Cookies.get("accessToken");
    console.log(requestId);

    try {
      const response = await fetch(`https://resqtrackbackend.onrender.com/api/user/rejectrequest/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "reject" })  // ✅ Fix: Proper JSON body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const userData = await response.json();
      console.log("Response Data:", userData);  // ✅ Fix: Log the correct response

    } catch (err) {
      console.error("Error updating request status:", err.message);
    }

    toast({
      title: "Status Updated",
      description: `Request ${requestId} has been marked as ${newStatus.toLowerCase()}.`,
    });
  }

  const handleGenerateInvoice = (request) => {
    generateInvoice(request);
    toast({
      title: "Invoice Generated",
      description: `Invoice for ${request.client} has been generated and downloaded.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Service Requests</h2>
        <Button>New Request</Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>All Requests</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search requests..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Test Drive">Test Drive</SelectItem>
                  <SelectItem value="Car Removal">Car Removal</SelectItem>
                  <SelectItem value="Car Delivery">Car Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table">
            <div className="flex justify-end mb-4">
              <TabsList>
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="map">Map</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="table">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.client}</TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>{request.vehicle}</TableCell>
                        <TableCell>
                          {new Date(request.time).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              request.status === "Accepted"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : request.status === "Cancelled"
                                  ? "bg-red-100 text-red-800 border-red-200"
                                  : request.status === "Processing"
                                    ? "bg-blue-100 text-blue-800 border-blue-200"
                                    : request.status === "Scheduled"
                                      ? "bg-purple-100 text-purple-800 border-purple-200"
                                      : "bg-yellow-100 text-yellow-800 border-yellow-200"
                            }
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedRequest(request)}
                                >
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>Request Details</DialogTitle>
                                </DialogHeader>
                                {selectedRequest && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <div className="space-y-4">
                                      <div>
                                        <h3 className="text-lg font-bold mb-1">
                                          {selectedRequest.client}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                          {selectedRequest.email} • {selectedRequest.phone}
                                        </p>
                                      </div>

                                      <div className="border rounded-lg p-4 space-y-3">
                                        <div>
                                          <span className="text-sm text-gray-500">Request Type</span>
                                          <p className="font-medium">{selectedRequest.type}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm text-gray-500">Vehicle</span>
                                          <p className="font-medium">{selectedRequest.vehicle}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm text-gray-500">
                                            Date & Time
                                          </span>
                                          <p className="font-medium">
                                            {new Date(selectedRequest.time).toLocaleString()}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="text-sm text-gray-500">Status</span>
                                          <Badge
                                            className={
                                              selectedRequest.status === "Completed"
                                                ? "bg-green-100 text-green-800 border-green-200 mt-1"
                                                : selectedRequest.status === "Cancelled"
                                                  ? "bg-red-100 text-red-800 border-red-200 mt-1"
                                                  : selectedRequest.status === "Processing"
                                                    ? "bg-blue-100 text-blue-800 border-blue-200 mt-1"
                                                    : selectedRequest.status === "Scheduled"
                                                      ? "bg-purple-100 text-purple-800 border-purple-200 mt-1"
                                                      : "bg-yellow-100 text-yellow-800 border-yellow-200 mt-1"
                                            }
                                          >
                                            {selectedRequest.status}
                                          </Badge>
                                        </div>
                                      </div>

                                      <div className="border rounded-lg p-4">
                                        <h4 className="font-medium mb-2">Notes</h4>
                                        <p className="text-gray-700 text-sm">
                                          {selectedRequest.notes}
                                        </p>
                                      </div>

                                      <div className="flex gap-2">
                                        {selectedRequest.status == "pending" && (
                                          <>
                                            <Button
                                              className="flex-1"
                                              onClick={() => handleStatusChange(selectedRequest.id, "Accepted")}
                                            >
                                              Accept
                                            </Button>
                                            <Button
                                              variant="outline"
                                              className="flex-1"
                                              onClick={() => handleDeclinechange(selectedRequest._ids, "Cancelled")}
                                            >
                                              Decline
                                            </Button>
                                          </>
                                        )}
                                        {(selectedRequest.status === "Scheduled" ||
                                          selectedRequest.status === "Processing") && (
                                            <Button
                                              className="flex-1"
                                              onClick={() => handleStatusChange(selectedRequest.id, "Completed")}
                                            >
                                              Mark as Completed
                                            </Button>
                                          )}
                                        {selectedRequest.status === "Completed" && (
                                          <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => handleGenerateInvoice(selectedRequest)}
                                          >
                                            Generate Invoice
                                          </Button>
                                        )}
                                      </div>
                                    </div>

                                    <div className="space-y-4">
                                      <div className="flex items-center gap-2 mb-1">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm font-medium">
                                          {selectedRequest.location}
                                        </span>
                                      </div>
                                      <div className="h-[300px] rounded-lg overflow-hidden">
                                        <UserMap location={selectedRequest.coordinates} />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleGenerateInvoice(request)}
                                >
                                  Generate Invoice
                                </DropdownMenuItem>
                                {request.status == "Pending" && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => handleStatusChange(request.id, "Accepted")}
                                    >
                                      Accept Request
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleStatusChange(request.id, "Cancelled")}
                                    >
                                      Decline Request
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {(request.status === "Scheduled" ||
                                  request.status === "Processing") && (
                                    <DropdownMenuItem
                                      onClick={() => handleStatusChange(request.id, "Completed")}
                                    >
                                      Mark as Completed
                                    </DropdownMenuItem>
                                  )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="map">
              <div className="h-[600px] rounded-lg overflow-hidden">
                <LiveRequestMap requests={filteredRequests} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceRequests;

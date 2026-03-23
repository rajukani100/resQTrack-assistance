
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileCheck, FileX, Car, Timer } from "lucide-react";
import { Link } from "react-router-dom";

const RecentRequests = () => {
  const requests = [
    {
      id: "REQ-001",
      client: "Wade Warren",
      email: "wade@gmail.com",
      type: "Test Drive",
      vehicle: "Nissan Maxima 3.5",
      status: "Pending",
      time: "10:30 AM",
    },
    {
      id: "REQ-002",
      client: "Devon Lane",
      email: "devon@gmail.com",
      type: "Car Removal",
      vehicle: "Mazda 3 2.5",
      status: "Processing",
      time: "Yesterday",
    },
    {
      id: "REQ-003",
      client: "Brooklyn Simmons",
      email: "brooklyn@gmail.com",
      type: "Test Drive",
      vehicle: "Volvo S90 2.0T",
      status: "Completed",
      time: "Yesterday",
    },
    {
      id: "REQ-004",
      client: "Guy Hawkins",
      email: "guy@gmail.com",
      type: "Test Drive",
      vehicle: "BMW 330i 3.0",
      status: "Cancelled",
      time: "3 days ago",
    },
  ];

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.id}
          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full shadow-sm">
              {request.type === "Test Drive" ? (
                <Car className="h-5 w-5 text-fleet-blue" />
              ) : (
                <Timer className="h-5 w-5 text-fleet-warning" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium">{request.client}</h3>
              <p className="text-xs text-gray-500">
                {request.type}: {request.vehicle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                request.status === "Completed"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : request.status === "Cancelled"
                  ? "bg-red-100 text-red-800 border-red-200"
                  : request.status === "Processing"
                  ? "bg-blue-100 text-blue-800 border-blue-200"
                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
              }
            >
              {request.status}
            </Badge>
            {request.status === "Pending" && (
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600">
                  <FileCheck className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-red-600">
                  <FileX className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="text-center mt-2">
        <Link to="/service-requests">
          <Button variant="outline" size="sm">
            View All Requests
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default RecentRequests;

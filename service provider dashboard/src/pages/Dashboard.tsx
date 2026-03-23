
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Car,
  Users,
  FileCheck,
  Clock,
  Calendar,
  ArrowUp,
  ArrowDown,
  XCircle,
  Circle
} from "lucide-react";
import CircularProgressBar, { RequestsChart } from "@/components/charts/RequestsChart";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
const Dashboard = () => {
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
        const response = await fetch("https://resqtrackbackend.onrender.com/api/user/getrequestdetails", {
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
        setData(userData);
        // console.log(data);

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
      // console.log("Updated Data:", data);
    }
  }, [data]);

  if (loading) return <p></p>;


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Last updated: {new Date(data.updatedAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-blue-100 p-3 rounded-full">
                <Car className="h-6 w-6 text-fleet-blue" />
              </div>

            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold">{data?.acceptedrequest + data?.Cancelledrequest}</h3>
              <p className="text-sm text-gray-500 mt-1">Total Requests</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-green-100 p-3 rounded-full">
                <FileCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold">{data?.acceptedrequest}</h3>
              <p className="text-sm text-gray-500 mt-1">Accepted Requests</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-indigo-100 p-3 rounded-full">
                <XCircle className="h-6 w-6 text-indigo-600" />
              </div>

            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold">{data?.Cancelledrequest}</h3>
              <p className="text-sm text-gray-500 mt-1">Cancelled Requests</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>

            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold">{data?.pendingrequest}</h3>
              <p className="text-sm text-gray-500 mt-1">Pending Requests</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Analytics Section */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Request Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Total Requests", value: data?.acceptedrequest + data?.Cancelledrequest, icon: <Car className="text-blue-600" />, color: "blue" },
                { title: "Accepted Requests", value: data?.acceptedrequest, icon: <FileCheck className="text-green-600" />, color: "green" },
                { title: "Cancelled Requests", value: data?.Cancelledrequest, icon: <ArrowDown className="text-red-600" />, color: "red" },
                { title: "Pending Requests", value: data?.pendingrequest, icon: <Clock className="text-orange-600" />, color: "orange" },
              ].map((item, index) => (
                <Card key={index} className="flex flex-col items-center p-4">

                  <CircularProgressBar value={item.value} total={data?.totalrequest || 1} />
                  <h3 className="text-3xl font-bold mt-2">{item.value}</h3>
                  <p className="text-sm text-gray-500">{item.title}</p>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Requests Section */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.recentRequest.map((value, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="bg-blue-100 p-1.5 rounded">
                    <Calendar className="h-4 w-4 text-fleet-blue" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">
                      {value.serviceType}: {value.vehicleType}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {value.userId.name} • {new Date(value.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  );
};

export default Dashboard;

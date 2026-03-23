import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Info, Star, Phone, Globe } from "lucide-react";
import { CompetitorsMap } from "@/components/maps/CompetitorsMap";
import Cookies from "js-cookie";
const Competitors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState(null); // Ensure it's initially null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [datas, setDatas] = useState();
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true)
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

        setDatas(userData?.finduser);
        // console.log("User Data:", userData);

      } catch (err) {
        console.error("Error fetching user data:", err.message);
      } finally {
        // setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);


  const userLocation = { latitude: 21.1714048, longitude: 72.7810048 };

  useEffect(() => {
    const fetchNearbyCompetitors = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://resqtrackbackend.onrender.com/api/emergency/nearbycompetitors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userLocation),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch competitors");
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching competitors:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyCompetitors();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  // Ensure data is structured correctly before mapping
  const competitors = data?.mechanics?.map((mechanic, index) => ({
    id: mechanic.id || index + 1,
    name: mechanic.name || "Unknown",
    type: "Service man",
    rating: mechanic.rating?.averageRating || "N/A",
    distance: mechanic?.distance || "N/A", // Replace with actual distance if available
    address: mechanic.address || "Not Available",
    phone: mechanic.phone || "Not Available",
    website: mechanic.website || "Not Available",
    coordinates: mechanic.location
      ? [mechanic.location.latitude, mechanic.location.longitude]
      : [0, 0], // Default coordinates
    brands: mechanic.brands || ["N/A"],
    strengths: mechanic.strengths || ["N/A"],
    weaknesses: mechanic.weaknesses || ["N/A"],
  })) || [];

  const filteredCompetitors = competitors.filter(
    (competitor) =>
      competitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competitor.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competitor.brands.some((brand) =>
        brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Nearby Competitors</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Competitors List</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search competitors..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {filteredCompetitors.map((competitor) => (
                <div
                  key={competitor.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedCompetitor?.id === competitor.id
                      ? "border-fleet-blue bg-blue-50"
                      : "hover:bg-gray-50"
                    }`}
                  onClick={() => setSelectedCompetitor(competitor)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{competitor.name}</h3>
                    <Badge variant="outline">{competitor.type}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span>{competitor.rating}/5</span>
                    <span className="mx-2">•</span>
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{competitor.distance} Km</span>
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Brands:</span>{" "}
                    {competitor.brands.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Competitor Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] rounded-lg overflow-hidden mb-4">
              <CompetitorsMap
                competitors={filteredCompetitors}
                selectedId={selectedCompetitor?.id}
                onSelect={setSelectedCompetitor}
              />
            </div>

            {selectedCompetitor && (
              <div className="border rounded-lg p-4 mt-4">
                <h3 className="text-xl font-bold mb-1">{selectedCompetitor.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Address:</strong> {selectedCompetitor.address}</p>
                    <p><strong>Phone:</strong> {selectedCompetitor.phone}</p>
                    <p><strong>Website:</strong> {selectedCompetitor.website}</p>
                  </div>
                  <div>
                    <p><strong>Brands:</strong> {selectedCompetitor.brands.join(", ")}</p>
                    <p><strong>Strengths:</strong> {selectedCompetitor.strengths.join(", ")}</p>
                    <p><strong>Weaknesses:</strong> {selectedCompetitor.weaknesses.join(", ")}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Competitors;

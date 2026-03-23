
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const ActiveDrivers = () => {
  const drivers = [
    {
      id: 1,
      name: "John Smith",
      avatar: "",
      initials: "JS",
      vehicle: "Toyota Camry",
      status: "Available",
      location: "Downtown",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      avatar: "",
      initials: "SJ",
      vehicle: "Honda Civic",
      status: "On Trip",
      location: "North Side",
    },
    {
      id: 3,
      name: "Michael Brown",
      avatar: "",
      initials: "MB",
      vehicle: "Ford Fusion",
      status: "Available",
      location: "East Side",
    },
    {
      id: 4,
      name: "Emily Davis",
      avatar: "",
      initials: "ED",
      vehicle: "Chevrolet Malibu",
      status: "On Trip",
      location: "South Side",
    },
  ];

  return (
    <div className="space-y-4">
      {drivers.map((driver) => (
        <div
          key={driver.id}
          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={driver.avatar} alt={driver.name} />
              <AvatarFallback className="bg-fleet-blue text-white">
                {driver.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-medium">{driver.name}</h3>
              <p className="text-xs text-gray-500">{driver.vehicle}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge
              variant="outline"
              className={
                driver.status === "Available"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-blue-100 text-blue-800 border-blue-200"
              }
            >
              {driver.status}
            </Badge>
            <span className="text-xs text-gray-500">{driver.location}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActiveDrivers;

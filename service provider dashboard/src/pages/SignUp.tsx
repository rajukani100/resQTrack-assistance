import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const serviceOptions = [
  { id: "towing", label: "Towing" },
  { id: "flat-tire", label: "Flat Tire" },
  { id: "jump-start", label: "Jump Start" },
  { id: "fuel-delivery", label: "Fuel Delivery" }
];

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: {
      latitude: "",
      longitude: ""
    },
    servicesOffered: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => {
      const currentServices = [...prev.servicesOffered];
      if (currentServices.includes(service)) {
        return { ...prev, servicesOffered: currentServices.filter((s) => s !== service) };
      } else {
        return { ...prev, servicesOffered: [...currentServices, service] };
      }
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      setFormData((prev) => ({ ...prev, location: locationData }));
      setIsLoading(true);

      try {
        if (!formData.name || !formData.email || !formData.password || !formData.phone) {
          throw new Error("Please fill in all required fields");
        }
        if (formData.servicesOffered.length === 0) {
          throw new Error("Please select at least one service");
        }

        const requestBody = JSON.stringify({ ...formData, location: locationData });

        const response = await fetch("https://resqtrackbackend.onrender.com/api/emergency/registerserviceprovider", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        });

        if (!response.ok) {
          throw new Error("Failed to create account. Please try again.");
        }

        toast({
          title: "Account Created!",
          description: "Your account has been successfully created.",
        });

        navigate("/signin");
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Something went wrong.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch location. Please enable location services.",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Enter your details to sign up.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" placeholder="123-456-7890" value={formData.phone} onChange={handleInputChange} required />
            </div>
            <div>
              <Label>Services Offered</Label>
              <div className="flex flex-wrap gap-4">
                {serviceOptions.map((service) => (
                  <div key={service.id} className="flex items-center">
                    <Checkbox id={service.id} checked={formData.servicesOffered.includes(service.label)} onCheckedChange={() => handleServiceToggle(service.label)} />
                    <Label htmlFor={service.id}>{service.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm">Already have an account? <Link to="/signin" className="text-blue-500">Sign in</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
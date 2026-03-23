
import { useState } from "react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Filter,
  Search,
  Plus,
  MoreHorizontal,
  ChevronDown,
  Grid,
  List as ListIcon,
  BarChart2,
  Table as TableIcon,
  PlusSquare,
  Grid3X3,
} from "lucide-react";

// Type definitions
type Priority = "High" | "Medium" | "Low";
type Status = "Hot" | "Warm" | "Cold" | "Deal";

interface Client {
  id: string;
  name: string;
  email: string;
  vehicle?: string;
  type: string;
  status: Status;
  assignee?: {
    id: string;
    initials: string;
    avatar?: string;
  };
  notes: string;
  priority: Priority;
  order?: string;
}

const SalesPipeline = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("prospects");
  
  // Sample data
  const prospects: Client[] = [
    {
      id: "1",
      name: "Wade Warren",
      email: "wade@gmail.com",
      vehicle: "Nissan Maxima 3.5",
      type: "Test Drive",
      status: "Hot",
      assignee: {
        id: "1",
        initials: "DA",
      },
      notes: "Client would like to test drive the car over the weekend",
      priority: "Medium",
      order: "Nissan Maxima 3.5",
    },
    {
      id: "2",
      name: "Devon Lane",
      email: "devon@gmail.com",
      vehicle: "Mazda 3 2.5",
      type: "Test Drive",
      status: "Warm",
      assignee: {
        id: "2",
        initials: "SK",
      },
      notes: "Made the first call to the client, sent a commercial proposal via email",
      priority: "High",
      order: "Mazda 3 2.5",
    },
  ];
  
  const offers: Client[] = [
    {
      id: "3",
      name: "Brooklyn Simmons",
      email: "simmons@gmail.com",
      vehicle: "Volvo S90 2.0T",
      type: "Test Drive",
      status: "Warm",
      assignee: {
        id: "3",
        initials: "BM",
      },
      notes: "Contact the client to confirm the meeting time at 11:00 AM",
      priority: "Low",
      order: "Volvo S90 2.0T",
    },
    {
      id: "4",
      name: "Guy Hawkins",
      email: "hawkins@gmail.com",
      vehicle: "BMW 330i 3.0",
      type: "Test Drive",
      status: "Cold",
      assignee: {
        id: "4",
        initials: "DM",
      },
      notes: "Made the first call to the client, sent a commercial proposal via email",
      priority: "Medium",
      order: "BMW 330i 3.0",
    },
  ];
  
  const deals: Client[] = [
    {
      id: "5",
      name: "Annette Black",
      email: "annette@gmail.com",
      vehicle: "Ford Focus ST 2.3",
      type: "Car Delivery",
      status: "Deal",
      assignee: {
        id: "5",
        initials: "YF",
      },
      notes: "The client prioritizes an integrated navigation system and a premium audio system",
      priority: "High",
      order: "Ford Focus ST 2.3",
    },
  ];
  
  // Render badge colors based on status
  const renderStatusBadge = (status: Status) => {
    switch(status) {
      case "Hot":
        return <Badge className="bg-red-100 text-red-800 border-red-200">{status}</Badge>;
      case "Warm":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">{status}</Badge>;
      case "Cold":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">{status}</Badge>;
      case "Deal":
        return <Badge className="bg-green-100 text-green-800 border-green-200">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Render priority badges
  const renderPriorityBadge = (priority: Priority) => {
    switch(priority) {
      case "High":
        return (
          <div className="flex items-center">
            <div className="h-3 w-1 bg-red-500 rounded-full mr-1"></div>
            <div className="h-3 w-1 bg-red-500 rounded-full mr-1"></div>
            <div className="h-3 w-1 bg-red-500 rounded-full"></div>
            <span className="ml-2 text-xs text-gray-500">High</span>
          </div>
        );
      case "Medium":
        return (
          <div className="flex items-center">
            <div className="h-3 w-1 bg-orange-500 rounded-full mr-1"></div>
            <div className="h-3 w-1 bg-orange-500 rounded-full mr-1"></div>
            <div className="h-3 w-1 bg-gray-200 rounded-full"></div>
            <span className="ml-2 text-xs text-gray-500">Medium</span>
          </div>
        );
      case "Low":
        return (
          <div className="flex items-center">
            <div className="h-3 w-1 bg-green-500 rounded-full mr-1"></div>
            <div className="h-3 w-1 bg-gray-200 rounded-full mr-1"></div>
            <div className="h-3 w-1 bg-gray-200 rounded-full"></div>
            <span className="ml-2 text-xs text-gray-500">Low</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Handle adding a new client
  const handleAddNew = (section: string) => {
    console.log(`Adding new client to ${section}`);
    // Implementation would go here
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-slate-800 rounded flex items-center justify-center">
            <Grid3X3 className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Salespipe Project</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <Avatar className="h-8 w-8 border-2 border-white">
              <AvatarImage src="/placeholder.svg" alt="Team member" />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8 border-2 border-white">
              <AvatarImage src="/placeholder.svg" alt="Team member" />
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8 border-2 border-white bg-green-100 text-green-800">
              <AvatarFallback>+3</AvatarFallback>
            </Avatar>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Lead
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <Tabs defaultValue="kanban" className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="kanban" className="flex items-center gap-1">
              <Grid className="h-4 w-4" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-1">
              <ListIcon className="h-4 w-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="gantt" className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              Gantt
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-1">
              <TableIcon className="h-4 w-4" />
              Table
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by name..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <BarChart2 className="h-4 w-4" rotate={90} />
            Sort
          </Button>
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Prospects Section */}
        <div className="border rounded-md">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setActiveSection(activeSection === "prospects" ? "" : "prospects")}
          >
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-green-500 rounded"></div>
              <h2 className="font-medium text-gray-800">Prospects</h2>
              <Badge variant="outline" className="bg-gray-100">{prospects.length}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={(e) => {
                e.stopPropagation();
                handleAddNew("prospects");
              }}>
                <Plus className="h-4 w-4" />
                Add new
              </Button>
              <ChevronDown className={`h-5 w-5 transition-transform ${activeSection === "prospects" ? "rotate-180" : ""}`} />
            </div>
          </div>
          
          {activeSection === "prospects" && (
            <div className="border-t">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]"></TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prospects.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="pr-0">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </TableCell>
                      <TableCell>{renderStatusBadge(client.status)}</TableCell>
                      <TableCell>{client.vehicle}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-1">
                            <AvatarFallback>{client.assignee?.initials}</AvatarFallback>
                          </Avatar>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{client.notes}</TableCell>
                      <TableCell>{renderPriorityBadge(client.priority)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Move to Offers</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        
        {/* Offers Section */}
        <div className="border rounded-md">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setActiveSection(activeSection === "offers" ? "" : "offers")}
          >
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-yellow-500 rounded"></div>
              <h2 className="font-medium text-gray-800">Offers</h2>
              <Badge variant="outline" className="bg-gray-100">{offers.length}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={(e) => {
                e.stopPropagation();
                handleAddNew("offers");
              }}>
                <Plus className="h-4 w-4" />
                Add new
              </Button>
              <ChevronDown className={`h-5 w-5 transition-transform ${activeSection === "offers" ? "rotate-180" : ""}`} />
            </div>
          </div>
          
          {activeSection === "offers" && (
            <div className="border-t">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]"></TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offers.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="pr-0">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </TableCell>
                      <TableCell>{renderStatusBadge(client.status)}</TableCell>
                      <TableCell>{client.vehicle}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-1">
                            <AvatarFallback>{client.assignee?.initials}</AvatarFallback>
                          </Avatar>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{client.notes}</TableCell>
                      <TableCell>{renderPriorityBadge(client.priority)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Move to Deals</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        
        {/* Deals Section */}
        <div className="border rounded-md">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setActiveSection(activeSection === "deals" ? "" : "deals")}
          >
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-blue-500 rounded"></div>
              <h2 className="font-medium text-gray-800">Deals</h2>
              <Badge variant="outline" className="bg-gray-100">{deals.length}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={(e) => {
                e.stopPropagation();
                handleAddNew("deals");
              }}>
                <Plus className="h-4 w-4" />
                Add new
              </Button>
              <ChevronDown className={`h-5 w-5 transition-transform ${activeSection === "deals" ? "rotate-180" : ""}`} />
            </div>
          </div>
          
          {activeSection === "deals" && (
            <div className="border-t">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]"></TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deals.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="pr-0">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </TableCell>
                      <TableCell>{renderStatusBadge(client.status)}</TableCell>
                      <TableCell>{client.vehicle}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-1">
                            <AvatarFallback>{client.assignee?.initials}</AvatarFallback>
                          </Avatar>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{client.notes}</TableCell>
                      <TableCell>{renderPriorityBadge(client.priority)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Archive</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesPipeline;

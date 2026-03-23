
import { jsPDF } from "jspdf";

export const generateInvoice = (request: any) => {
  const dateandtime = new Date(request.time).toLocaleDateString()

  // Create new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add logo or company name
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235); // fleet-blue
  doc.text("RESQTRACK", pageWidth / 2, 20, { align: "center" });
  
  // Add invoice title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("SERVICE INVOICE", pageWidth / 2, 30, { align: "center" });
  
  // Add invoice number and date
  doc.setFontSize(10);
  doc.text(`Invoice #: INV-${Date.now().toString().slice(-6)}`, 20, 45);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
  
  // Add separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 55, pageWidth - 20, 55);
  
  // Client information
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text("Client Information", 20, 65);
  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  doc.text(`Name: ${request.client}`, 20, 72);
  doc.text(`Email: ${request.email || "N/A"}`, 20, 77);
  doc.text(`Phone: ${request.phone || "N/A"}`, 20, 82);
  doc.text(`Address: ${request.location || "N/A"}`, 20, 87);
  
  // Service information
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text("Service Information", 20, 100);
  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  doc.text(`Service Type: ${request.type}`, 20, 107);
  doc.text(`Vehicle: ${request.vehicle}`, 20, 112);
  doc.text(`Date & Time: ${dateandtime}`, 20, 117);
  doc.text(`Status: ${request.status}`, 20, 122);
  
  // Service charges (dummy data for demonstration)
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text("Service Charges", 20, 135);
  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  
  let y = 142;
  let total = 0;
  
  if (request.type === "Test Drive") {
    doc.text("Test Drive Service Fee", 20, y);
    doc.text("$50.00", 170, y, { align: "right" });
    y += 5;
    total += 50;
  } else if (request.type === "Car Removal") {
    doc.text("Vehicle Removal Service", 20, y);
    doc.text("$120.00", 170, y, { align: "right" });
    y += 5;
    total += 120;
    
    doc.text("Distance Fee (10 miles)", 20, y);
    doc.text("$30.00", 170, y, { align: "right" });
    y += 5;
    total += 30;
  } else if (request.type === "Car Delivery") {
    doc.text("Vehicle Delivery Service", 20, y);
    doc.text("$150.00", 170, y, { align: "right" });
    y += 5;
    total += 150;
    
    doc.text("Distance Fee (10 miles)", 20, y);
    doc.text("$30.00", 170, y, { align: "right" });
    y += 5;
    total += 30;
  }
  
  // Additional dummy items based on vehicle
  if (request.vehicle.includes("BMW") || request.vehicle.includes("Mercedes")) {
    doc.text("Premium Vehicle Handling", 20, y);
    doc.text("$75.00", 170, y, { align: "right" });
    y += 5;
    total += 75;
  }
  
  doc.text("Processing Fee", 20, y);
  doc.text("250.00", 170, y, { align: "right" });
  y += 5;
  total += 25;
  
  // Subtotal, Tax and Total
  y += 5;
  doc.line(20, y, pageWidth - 20, y);
  y += 7;
  
  doc.text("Subtotal", 130, y);
  doc.text(`${total.toFixed(2)}`, 170, y, { align: "right" });
  y += 5;
  
  const tax = total * 0.07;
  doc.text("Tax (7%)", 130, y);
  doc.text(`${tax.toFixed(2)}`, 170, y, { align: "right" });
  y += 5;
  
  doc.setFont(undefined, "bold");
  doc.text("Total", 130, y);
  doc.text(`${(total + tax).toFixed(2)}`, 170, y, { align: "right" });
  
  // Notes section
  y += 15;
  doc.setFont(undefined, "normal");
  doc.text("Notes:", 20, y);
  y += 5;
  doc.setFontSize(9);
  const notes = request.notes || "Thank you for choosing Swift Fleet for your automotive needs!";
  doc.text(notes, 20, y, { maxWidth: pageWidth - 40 });
  
  // Footer
  doc.setFontSize(8);
  doc.text("resQTrack -  Surat, gujarat - 123 456 789 0 - www.resqtrack.com", pageWidth / 2, 270, { align: "center" });
  
  // Save the PDF
  doc.save(`invoice-${request.client.replace(/\s+/g, "-").toLowerCase()}.pdf`);
  
  return true;
};

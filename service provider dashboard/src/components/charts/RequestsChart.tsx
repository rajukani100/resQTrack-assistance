import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Users, FileCheck, Clock } from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#f59e0b"]; // Blue, Green, Red, Orange

// Circular Progress Bar Component
const CircularProgressBar = ({ value, total }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  const data = [
    { name: "Used", value },
    { name: "Remaining", value: total - value },
  ];

  return (
    <PieChart width={80} height={80}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={25}
        outerRadius={35}
        startAngle={90}
        endAngle={-270}
        dataKey="value"
        stroke="none"
      >
        <Cell key="used" fill={COLORS[0]} />
        <Cell key="remaining" fill="#e5e7eb" />
      </Pie>
      <text x="50%" y="50%" textAnchor="middle" dy={5} className="text-sm font-bold">
        {Math.round(percentage)}%
      </text>
    </PieChart>
  );
};

export default CircularProgressBar
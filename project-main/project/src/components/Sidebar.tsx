import React from "react";
import {
  Building2,
  Users,
  ClipboardList,
  Calendar,
  Settings,
  Clock,
  BarChart,
  LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { icon: Building2, label: "Hotels", path: "/hotels" },
    { icon: Users, label: "Housekeepers", path: "/housekeepers" },
    { icon: ClipboardList, label: "Assignments", path: "/assignments" },
    { icon: Clock, label: "Shift Hours", path: "/shifts" },
    { icon: Calendar, label: "Schedule", path: "/schedule" },
    { icon: BarChart, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: LogOut, label: "Logout", path: "/logout" },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="flex items-center p-4 border-b border-gray-200">
        <Building2 className="h-8 w-8 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-900 ml-2">Hotel Rover</h1>
      </div>

      <nav className="mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                isActive ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  isActive ? "text-blue-600" : "text-gray-500"
                }`}
              />
              <span className={`ml-3 ${isActive ? "font-medium" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

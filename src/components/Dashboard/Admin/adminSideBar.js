import React from 'react';
import Sidebar from '../../common/Sidebar';
import { Building2, Users, UserPlus, BarChart2,ChartNoAxesCombined } from "lucide-react"

const AdminSideBar = () => {

 const navItems = [
    { name: "Class", icon: Building2, path: "/dashboard/class" },
    { name: "Teacher", icon: Users, path: "/dashboard/teacher" },
    { name: "Student", icon: UserPlus, path: "/dashboard/student" },
    { name: "classAnalytics", icon: BarChart2, path: "/dashboard/class-analytics" },
    { name: "financialAnalytics", icon: ChartNoAxesCombined, path: "/dashboard/financial-analytics" },
  ]

  return (
    <div className="flex">
      <Sidebar
        items={navItems}
      />
    </div>
  );
};

export default AdminSideBar;

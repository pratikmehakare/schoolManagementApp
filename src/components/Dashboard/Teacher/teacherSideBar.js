import React from 'react';
import Sidebar from '../../common/Sidebar';
import { BookOpenText, Building2,NotepadText,Users } from "lucide-react"

const teacherSideBar = () => {

 const navItems = [
    { name: "Class", icon: Building2, path: "/teacher-dashboard/class" },
    { name: "Student", icon: Users, path: "/teacher-dashboard/student" },
    { name: "Assignment", icon: BookOpenText, path: "/teacher-dashboard/assignment" },
    { name: "Note", icon: NotepadText, path: "/teacher-dashboard/note" },
  ]

  return (
    <div className="flex">
      <Sidebar
        items={navItems}
      />
    </div>
  );
};

export default teacherSideBar;

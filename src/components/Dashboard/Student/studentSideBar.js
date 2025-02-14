import React from 'react';
import Sidebar from '../../common/Sidebar';
import { BookOpenText, Building2,NotepadText } from "lucide-react"

const studentSideBar = () => {

 const navItems = [
    { name: "Class", icon: Building2, path: "/student-dashboard/class" },
    { name: "Assignment", icon: BookOpenText, path: "/student-dashboard/assignment" },
    { name: "Note", icon: NotepadText, path: "/student-dashboard/note" },
  ]

  return (
    <div className="flex">
      <Sidebar
        items={navItems}
      />
    </div>
  );
};

export default studentSideBar;

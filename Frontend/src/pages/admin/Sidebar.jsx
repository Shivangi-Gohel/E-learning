import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="flex">
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700 bg-[#f0f0f0] p-5 sticky top-0 h-screen">
        <div className="mt-20 space-y-4">
          <div
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 space-x-2 cursor-pointer hover:bg-gray-200 p-2 rounded-md"
          >
            <ChartNoAxesColumn size={22} />
            <h1>Dashboard</h1>
          </div>
          <div
            onClick={() => navigate("/admin/courses")}
            className="flex items-center gap-2 space-x-2 cursor-pointer hover:bg-gray-200 p-2 rounded-md"
          >
            <SquareLibrary size={22} />
            <h1>Courses</h1>
          </div>
        </div>
      </div>
      <div className="flex-1 md:p-10 p-2 bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;

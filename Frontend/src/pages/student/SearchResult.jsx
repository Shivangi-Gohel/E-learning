import { Badge } from "@/components/ui/badge";
import React from "react";
import { useNavigate } from "react-router-dom";

const SearchResult = ({ course }) => {
  const navigate = useNavigate();
  const courseId = "shdg";
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-300 py-4 gap-4">
      <div
        onClick={() => navigate(`/course-details/${courseId}`)}
        className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
      >
        <img
          src={
            "https://miro.medium.com/v2/resize:fit:855/1*htQ__m0E2P0XuxSSQelBcQ.png"
          }
          alt="course-thumbnail"
          className="h-32 w-full md:w-56 object-cover rounded"
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-lg md:text-xl">Course Title</h1>
          <p className="text-sm text-gray-600">Subtitle</p>
          <p className="text-sm text-gray-700">Instructor: <span className="font-bold">Shivu</span></p>
          <Badge className='w-fit mt-2 md:mt-0'>Medium</Badge>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;

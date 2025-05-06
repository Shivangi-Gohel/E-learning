import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const Course = () => {
  return (
    <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 pt-0">
      <div className="relative">
        <img
          src="https://tse1.mm.bing.net/th?id=OIP.IED5iJnejJSbfKMzzXjkbgAAAA&pid=Api&P=0&h=180"
          className="w-full h-36 object-cover rounded-t-lg"
          alt="course"
        />
      </div>
      <CardContent className="px-5 space-y-3">
        <h1 className="hover:underline font-bold text-lg truncate">
          Nextjs complete course in Hindi 2024
        </h1>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="font-medium text-sm">Shivangi gohel</h1>
            </div>
            <Badge className="bg-blue-600 text-white px-2 py-1 text-xs rounded-full">
                Advance
            </Badge>
        </div>
        <div className="text-lg font-bold">
            <span>₹499</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Course;

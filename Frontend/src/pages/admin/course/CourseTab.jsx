import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import React, { use, useState } from "react";
import { useNavigate } from "react-router-dom";

const CourseTab = () => {
  const isPublished = true;
  const isLoading = false;
  const navigate = useNavigate();
  const [previewThumbnail, setPreviewThumbnail] = useState("");

  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const selectCategory = (value) => {
    setInput({
      ...input,
      category: value,
    });
  }

  const selectCourseLevel = (value) => {
    setInput({
      ...input,
      courseLevel: value,
    });
  }

  // get file
  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({
        ...input,
        courseThumbnail: file,
      });
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewThumbnail(fileReader.result);
      }
      fileReader.readAsDataURL(file);
    }
  }

  const updateCourseHandler = () => {
    console.log("Course updated with data:", input);
  }

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>Basic Course Information</CardTitle>
            <CardDescription>
              Make changes to your courses here. Click save when you're done.
            </CardDescription>
          </div>
          <div className="space-x-2">
            <Button variant="outline">
              {isPublished ? "Unpublished" : "Published"}
            </Button>
            <Button>Remove Course</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mt-5">
            <div>
              <Label className="mb-1">Title</Label>
              <Input
                type="text"
                name="courseTitle"
                value={input.courseTitle}
                onChange={changeEventHandler}
                placeholder="Enter course title here"
              />
            </div>
            <div>
              <Label className="mb-1">Subtitle</Label>
              <Input
                type="text"
                name="subTitle"
                value={input.subTitle}
                onChange={changeEventHandler}
                placeholder="Enter subTitle here"
              />
            </div>
            <div>
              <Label className="mb-1">Description</Label>
              <RichTextEditor input={input} setInput={setInput} />
            </div>
            <div className="flex items-center gap-5">
              <div>
                <Label className="mb-1">Category</Label>
                <Select onValueChange={selectCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      <SelectItem value="Next JS">Next JS</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Frontend Development">
                        Frontend Development
                      </SelectItem>
                      <SelectItem value="Fullstack Development">
                        Fullstack Development
                      </SelectItem>
                      <SelectItem value="MERN Stack Development">
                        MERN Stack Development
                      </SelectItem>
                      <SelectItem value="Javascript">Javascript</SelectItem>
                      <SelectItem value="Python">Python</SelectItem>
                      <SelectItem value="Docker">Docker</SelectItem>
                      <SelectItem value="MongoDB">MongoDB</SelectItem>
                      <SelectItem value="HTML">HTML</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1">Course Level</Label>
                <Select onValueChange={selectCourseLevel}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Course Level</SelectLabel>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Advance">Advance</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1">Price in (INR)</Label>
                <Input
                  type="number"
                  name="coursePrice"
                  value={input.coursePrice}
                  onChange={changeEventHandler}
                  placeholder="Enter course price here"
                  width="fit"
                />
              </div>
            </div>
            <div>
              <Label className="mb-1">Course Thumbnail</Label>
              <Input type="file" onChange={selectThumbnail} accept="image/*" className="w-fit" />
              {
                previewThumbnail && (
                  <img
                    src={previewThumbnail}
                    alt="Course Thumbnail"
                    className="w-75 h-40 my-2 rounded-2xl"
                  />
                )
              }
            </div>
            <div>
              <Button variant='outline' onClick={() => navigate("/admin/courses")}>Cancel</Button>
              <Button disabled={isLoading} onClick={updateCourseHandler} className="ml-2">
                {
                  isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                    </>
                  ) : "Save"
                }
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseTab;

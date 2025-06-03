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
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
  const isPublished = true;
  const navigate = useNavigate();
  const [previewThumbnail, setPreviewThumbnail] = useState("");

  const params = useParams();
  const courseId = params.courseId;
  

  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const [editCourse, {data, isLoading, isSuccess, error}] = useEditCourseMutation();

  const {data: courseData, isLoading: isCourseLoading, refetch} = useGetCourseByIdQuery(courseId, {skip: !courseId,refetchOnMountOrArgChange: true});

  const [publishCourse, {}] = usePublishCourseMutation();

  const course = courseData?.course;

  useEffect(() => {
    if(course) {
      setInput({
        courseTitle: course.courseTitle || "",
        subTitle: course.subTitle || "",
        description: course.description || "",
        category: course.category || "",
        courseLevel: course.courseLevel || "",
        coursePrice: course.coursePrice || "",
        courseThumbnail: "", // Reset thumbnail to null for file input
      });
      setPreviewThumbnail(course.courseThumbnail || "");
    }
  }, [course]);

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
      fileReader.readAsDataURL(file)
    }
  }

  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    if (input.courseThumbnail) {
      formData.append("courseThumbnail", input.courseThumbnail);
    }
    await editCourse({formData, courseId});
  }

  const publishStatusHandler = async (action) => {
    try {
      const res = await publishCourse({courseId, publish: action});
      if(res.data) {
        refetch();
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.data.message || "Failed to publish or unpublish course");
    }
  }

  useEffect(() => {
    if(isSuccess) {
      toast.success(data.message || "Course updated");
      navigate("/admin/courses");
    }
    if(error) {
      toast.error(error.data.message || "Failed to update course");
    }
  }, [isSuccess, error]);

  useEffect(() => {
      if (location.state?.refetch) {
        refetch();
        window.history.replaceState({}, document.title);
      }
    }, [location.state]);

  if(!courseId || isCourseLoading) return <Loader2 className="h-6 w-6 animate-spin" />;

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
            <Button disabled={course.lectures.length === 0} variant="outline" onClick={() => publishStatusHandler(course.isPublished ? "false" : "true")}>
              {course.isPublished ? "Unpublished" : "Published"}
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

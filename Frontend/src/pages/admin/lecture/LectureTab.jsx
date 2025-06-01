import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useEditLectureMutation } from "@/features/api/courseApi";
import { Label } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";

const MEDIA_API = "http://localhost:8000/api/v1/media"

const LectureTab = () => {
    const [title, setTitle] = useState("");
    const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
    const [isFree, setIsFree] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [btnDisabled, setBtnDisabled] = useState(true);

    const [editLecture, {data, isLoading, error, isSuccess}] = useEditLectureMutation();

    const fileChangeHandler = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            setMediaProgress(true);
            try {
                const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
                    onUploadProgress: ({loaded, total }) => {
                        setUploadProgress(Math.round((loaded * 100) / total));
                    }
                })

                if(res.data.success) {
                    setUploadVideoInfo({videoUrl:res.data.url, publicId:res.data.data.public_id});
                    setBtnDisabled(false);
                    toast.success(res.data.message);
                }
            } catch (error) {
                console.log(error);
                toast.error("Error while uploading video");
            } finally {
                setMediaProgress(false);
            }
        }
        
    };

  return (
    <Card>
      <CardHeader className="justify-between items-center">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make changes and click save when done.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="destructive">Remove Lecture</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Title</Label>
          <Input type="text" placeholder="Enter lecture title" />
        </div>
        <div className="my-5">
          <Label>
            Video <span className="text-red-500">*</span>
          </Label>
          <Input type="file" accept="video/*" className="w-fit" onChange={fileChangeHandler} />
        </div>
        <div className="flex items-center space-x-2 my-5">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Is this video FREE</Label>
        </div>

        {
            mediaProgress && (
                <div className="my-4">
                    <Progress value={uploadProgress} className="w-full" />
                    <p>{uploadProgress}% uploaded</p>
                </div>
            )
        }

        <div className="mt-5">
            <Button>Update Lecture</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;

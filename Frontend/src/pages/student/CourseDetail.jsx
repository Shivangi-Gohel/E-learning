import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useGetCourseByIdQuery
} from "@/features/api/courseApi";
import { useCheckIfPurchasedQuery, useCreateOrderMutation, useVerifyPaymentMutation } from "@/features/api/purchaseApi";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const purchasedCourse = false;

  const params = useParams();
  const courseId = params.courseId;

  const {
    data: courseData,
    isLoading: isCourseLoading,
    refetch,
  } = useGetCourseByIdQuery(courseId, {
    skip: !courseId,
    refetchOnMountOrArgChange: true,
  });

  const [createOrder, { data, isLoading }] = useCreateOrderMutation();
  console.log("order data: ", data);
  const [verifyPayment] = useVerifyPaymentMutation();

  const {data: purchaseCheckData, isLoading: isCheckLoading} = useCheckIfPurchasedQuery(courseId);
  console.log("purchased data: ", purchaseCheckData);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  const onPayment = async (price) => {
    try {
      // Call createOrder mutation
      const orderRes = await createOrder({ courseId, price }).unwrap();

      console.log("Order created: ", orderRes);

      const paymentObject = new window.Razorpay({
        key: "rzp_test_EeIxqirfrx0Q3k",
        ...orderRes, // should contain order_id, amount, currency, etc.

        handler: async function (response) {
          console.log("Payment successful:", response);

          try {
            const verificationRes = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              courseId,
            }).unwrap();

            if (verificationRes.success) {
              console.log("Payment verified successfully");
              // Handle post-verification (e.g., toast, redirect)
            }
          } catch (verificationError) {
            console.error("Payment verification failed:", verificationError);
          }
        },

        theme: {
          color: "#3399cc",
        },
      });

      paymentObject.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="mt-20 space-y-5">
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">Course Title</h1>
          <p className="text-base md:text-lg">Course Sub-title</p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              Shivangi Gohel
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated 11-11-2024</p>
          </div>
          <p>Student enrolled: 10</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p className="text-sm">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Porro
            dicta dolorem sunt error eveniet laudantium rem modi ex vel saepe
            officiis deserunt, tenetur unde cum dolores. Soluta aut vel ullam
            amet dignissimos nemo cumque id.
          </p>
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>4 lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((lecture, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span>
                    {true ? <PlayCircle size={14} /> : <Lock size={14} />}
                  </span>
                  <p>lecture title</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4">React Player Video</div>
              <h1>Lecture title</h1>
              <Separator className="my-2" />
              <h1 className="text-lg md:text-xl font-semibold">Course Price</h1>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {purchaseCheckData?.isPurchased ? (
                <Button className="w-full">Continue Course</Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => onPayment(courseData.course.coursePrice)}
                >
                  Purchase Course
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

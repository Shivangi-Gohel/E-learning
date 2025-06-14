import { Menu, School } from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const {user} = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [logoutUser, {data, isSuccess}] = useLogoutUserMutation();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    if(isSuccess) {
      toast.success(data?.message || "Logged out successfully");
      navigate("/login");
    }
  }, [isSuccess])

  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <School size={"30"} />
          <h1 className="hidden md:block font-extrabold text-2xl">
            E-learning
          </h1>
        </div>
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar>
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate("/my-learning")}>My learning</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>Edit Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuGroup>
                {
                  user.role == "instructor" && (
                    <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <div onClick={() => navigate("/admin/dashboard")}>Dashboard</div>
                    </DropdownMenuItem>
                    </>
                  )
                }
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/login")}>Signup</Button>
            </div>
          )}

          <DarkMode />
        </div>
      </div>
      {/* Mobile */}
      <div className="flex md:hidden items-center justify-between px-4 h-full ">
        <h1 className="font-extrabold text-2xl">E-learning</h1>
        <MobileNavbar />
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = () => {
  const role = "instructor"; // Replace with actual user role logic
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full bg-gray-200 hover:bg-gray-200"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex !flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle className="text-3xl mt-6">E-learning</SheetTitle>
          <DarkMode />
        </SheetHeader>
        <Separator className="mr-2" />
        <nav className="flex flex-col space-y-4 ml-4 text-xl">
          <span>My learning</span>
          <span>Edit Profile</span>
          <p>Log out</p>
        </nav>
        {role == "instructor" && (
          <SheetFooter className="mt-2">
            <SheetClose asChild>
              <Button className="p-4" type="submit">Dashboard</Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

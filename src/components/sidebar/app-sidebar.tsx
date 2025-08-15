"use client";

import { BoxIcon, Bus, FileQuestionIcon, Group, ImageIcon, MessageCircle, StarIcon, Ticket, User } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },

    navMain: [
      {
        title: "Hero",
        url: "/hero?type=hero",
        icon: ImageIcon,
        type: "hero",
      },
      {
        title: "About",
        url: "/about?type=about",
        icon: FileQuestionIcon,
        type: "about",
      },
      {
        title: "Testimonials",
        url: "/testimonials?type=testimonials",
        icon: StarIcon,
        type: "testimonials",
      },
      {
        title: "FAQ",
        url: "/faq?type=faq&page=1",
        icon: MessageCircle,
        type: "faq",
      },
  
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <SidebarHeader className=" flex items-start bg-white">
        <Image src="/images/logo.png" alt="logo" width={100} height={100} />
      </SidebarHeader> */}
      <SidebarContent className="!bg-white">
        <React.Suspense fallback={<div>Loading...</div>}>
          {" "}
          <NavMain items={data.navMain} />
        </React.Suspense>
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

// Menu items.
const items = [
  // {
  //   title: "Tìm Kiếm Nhập ",
  //   url: "/dashboard",
  //   icon: Search,
  // },
  // {
  //   title: "Import Nhập ",
  //   url: "/importExcel",
  //   icon: Inbox,
  // },
  // {
  //   title: "Import Xuất ",
  //   url: "/exportExcel",
  //   icon: Inbox,
  // },

  // {
  //   title: "SeawayMasterBill",
  //   url: "/SeawayMasterBill",
  //   icon: Inbox,
  // },
  
  // {
  //   title: "SeawayHouseBill",
  //   url: "/SeawayHouseBill",
  //   icon: Inbox,
  // },
  // {
  //   title: "AirMasterBill",
  //   url: "/AirMasterBill",
  //   icon: Inbox,
  // },
  // {
  //   title: "AirHouseBill",
  //   url: "/AirHouseBill",
  //   icon: Inbox,
  // },
  //   {
  //   title: "Vận Đơn",
  //   url: "/VanDon",
  //   icon: Inbox,
  // },
  {
    title: "Tìm Kiếm",
    url: "/SearchCheckBill",
    icon: Search,
  },

    {
    title: "Import File",
    url: "/importFile",
    icon: Inbox,
  },
  // {
  //   title: "Calendar",
  //   url: "#",
  //   icon: Calendar,
  // },
  // {
  //   title: "Search",
  //   url: "#",
  //   icon: Search,
  // },
  // {
  //   title: "Settings",
  //   url: "#",
  //   icon: Settings,
  // },
]

export function AppSidebar() {
  return (
   
    <Sidebar>
       
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold">Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} >
                  <SidebarMenuButton asChild>
                    <Link  href={item.url}>
                      <item.icon />
                      <span className="text-lg font-bold">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

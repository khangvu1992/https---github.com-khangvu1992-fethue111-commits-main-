"use client"

import {
  Calendar,
  FileText,
  Home,
  Inbox,
  List,
  Search,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

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
import React, { useState } from "react"

// Menu items.
const items = [
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
  {
    title: "Danh Mục",
    url: "/list",
    icon: List,
    children: [
      {
        title: "Doanh nghiệp trọng điểm",
        url: "/list",
        icon: FileText,
      },
      
          {
        title: "Mã HS trọng điểm",
        url: "/hsCode",
        icon: FileText,
      },
           {
        title: "Tuyến đường trọng điểm",
        url: "/listRoad",
        icon: FileText,
      },
    ],
  },
]

export function AppSidebar() {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const hasChildren = item.children && item.children.length > 0
                const isOpen = openMenus[item.title]

                return (
                  <React.Fragment key={item.title}>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => hasChildren ? toggleMenu(item.title) : undefined}
                        asChild={!hasChildren}
                      >
                        {hasChildren ? (
                          <div className="flex items-center w-full cursor-pointer">
                            <item.icon className="mr-2 h-5 w-5" />
                            <span className="text-lg font-bold flex-grow">{item.title}</span>
                            {isOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                        ) : (
                          <Link href={item.url}>
                            <item.icon className="mr-2 h-5 w-5" />
                            <span className="text-lg font-bold">{item.title}</span>
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Children nếu mở */}
                    {hasChildren && isOpen && item.children.map((child) => (
                      <SidebarMenuItem key={child.title} className="pl-10">
                        <SidebarMenuButton asChild>
                          <Link href={child.url}>
                            {child.icon && <child.icon className="mr-2 h-4 w-4" />}
                            <span className="text-base">{child.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </React.Fragment>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

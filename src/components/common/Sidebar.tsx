"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/core/lib/utils";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  active,
  collapsed,
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 ease-in-out whitespace-nowrap",
        active ? "bg-gray-200" : "hover:bg-gray-200"
      )}
    >
      <div className="w-6 h-6 flex items-center justify-center">
        <Image src={`/icons/${icon}.svg`} alt={label} width={24} height={24} />
      </div>
      {!collapsed && (
        <span
          className={cn(
            "text-base transition-all",
            active ? "text-gray-900 font-medium" : "text-gray-900"
          )}
        >
          {label}
        </span>
      )}
    </Link>
  );
};

const SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/" },
  { label: "Đơn hàng", href: "/orders" },
  { label: "Cài đặt", href: "/settings" },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Thêm theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
        setMobileOpen(false);
      } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setCollapsed(true);
        setMobileOpen(true);
      } else {
        setCollapsed(false);
        setMobileOpen(true);
      }
    };

    // Khởi tạo
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Xử lý khi toggle sidebar
  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <>
      {/* Backdrop cho mobile - sử dụng độ trong suốt để nhìn thấy nội dung bên dưới */}
      {mobileOpen &&
        typeof window !== "undefined" &&
        window.innerWidth < 768 && (
          <div
            className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-20 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

      {/* Mobile toggle button (outside sidebar) */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-30 p-2 rounded-md bg-white shadow-md md:hidden"
      >
        <Image
          src="/icons/sidebar-left-group.svg"
          alt="Menu"
          width={24}
          height={24}
        />
      </button>

      <aside
        className={cn(
          "h-screen fixed left-0 top-0 z-30 flex flex-col justify-between transition-all duration-300 ease-in-out",
          collapsed ? "w-[80px] px-3 py-5" : "w-[260px] px-6 py-5",
          !mobileOpen && "-translate-x-full",
          "bg-[#f9fafb] border-r border-[#d1d5db]",
          "md:relative md:translate-x-0",
          "max-md:bg-[#f9fafb]/95 max-md:backdrop-blur-md max-md:shadow-lg"
        )}
      >
        <div className="flex flex-col space-y-8">
          {/* Logo và Menu Button */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "font-extrabold text-[22px] leading-tight text-[#db551b] transition-all duration-300",
                  collapsed && "text-sm"
                )}
              >
                {!collapsed ? "Cúc Quy" : "CQ"}
              </span>
            </div>
            <button onClick={toggleSidebar} className="w-6 h-6 hidden md:block">
              <Image
                src={
                  collapsed
                    ? "/icons/sidebar-right-group.svg"
                    : "/icons/sidebar-left-group.svg"
                }
                alt="Toggle Sidebar"
                width={24}
                height={24}
              />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <SidebarItem
                  key={item.href}
                  icon="home-trend-up-group"
                  label={item.label}
                  href={item.href}
                  active={isActive}
                  collapsed={collapsed}
                />
              );
            })}
          </div>

          {/* Links Section */}
          <div className="flex flex-col space-y-1">
            {!collapsed && (
              <span className="text-sm text-gray-500 px-3 mb-1">Links</span>
            )}
            <SidebarItem
              icon="people-group"
              label="Community"
              href="/community"
              collapsed={collapsed}
            />
            <SidebarItem
              icon="video-play-group"
              label="Tutorial"
              href="/tutorials"
              collapsed={collapsed}
            />
          </div>
        </div>

        {/* User Profile */}
        <div className="flex justify-between items-center px-3 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
              <Image
                src="/icons/avatar-frame.svg"
                alt="Profile"
                width={32}
                height={32}
              />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-900">Elijah Scott</span>
                <span className="text-xs text-gray-500">
                  elijarscott@gmail.com
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
            <button className="w-6 h-6">
              <Image
                src="/icons/dots-horizontal.svg"
                alt="Menu"
                width={24}
                height={24}
              />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

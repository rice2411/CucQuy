import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "./Sidebar.module.css";

interface SidebarItemProps {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  active,
}) => {
  return (
    <Link
      href={href}
      className={cn(styles.sidebarItem, active && styles.sidebarItemActive)}
    >
      <div className="w-6 h-6 flex items-center justify-center">
        <Image src={`/icons/${icon}.svg`} alt={label} width={24} height={24} />
      </div>
      <span
        className={cn(
          "text-base",
          active ? "text-gray-900 font-medium" : "text-gray-900"
        )}
      >
        {label}
      </span>
    </Link>
  );
};

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className="flex flex-col space-y-8">
        {/* Logo và Menu Button */}
        <div className="flex justify-between items-center px-3">
          <div className="flex items-center gap-2">
            <span className={styles.logoText}>Cúc Quy</span>
          </div>
          <button className="w-6 h-6">
            <Image
              src="/icons/sidebar-left-group.svg"
              alt="Toggle Sidebar"
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col space-y-1">
          <SidebarItem
            icon="home-trend-up-group"
            label="Dashboard"
            href="/dashboard"
            active
          />
          <SidebarItem icon="receipt-2-group" label="Order" href="/orders" />
          <SidebarItem icon="shop-group" label="Listing" href="/listings" />
          <SidebarItem icon="user-octagon-group" label="Admin" href="/admin" />
          <SidebarItem
            icon="setting-3-group"
            label="Setting"
            href="/settings"
          />
        </div>

        {/* Links Section */}
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-gray-500 px-3 mb-1">Links</span>
          <SidebarItem
            icon="people-group"
            label="Community"
            href="/community"
          />
          <SidebarItem
            icon="video-play-group"
            label="Tutorial"
            href="/tutorials"
          />
        </div>
      </div>

      {/* User Profile */}
      <div className={styles.profileSection}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
            <Image
              src="/icons/avatar-frame.svg"
              alt="Profile"
              width={32}
              height={32}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-900">Elijah Scott</span>
            <span className="text-xs text-gray-500">elijarscott@gmail.com</span>
          </div>
        </div>
        <button className="w-6 h-6">
          <Image
            src="/icons/dots-horizontal.svg"
            alt="Menu"
            width={24}
            height={24}
          />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

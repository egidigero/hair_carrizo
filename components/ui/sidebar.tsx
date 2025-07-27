"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// --- Sidebar Context ---
interface SidebarContextType {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  collapsible: "icon" | "full" | false
  side: "left" | "right"
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  collapsible?: "icon" | "full" | false
  side?: "left" | "right"
  defaultCollapsed?: boolean
}

export function SidebarProvider({
  children,
  collapsible = "icon",
  side = "left",
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

  const value = React.useMemo(
    () => ({ collapsed, setCollapsed, collapsible, side }),
    [collapsed, setCollapsed, collapsible, side],
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

// --- Sidebar Root Component ---
const sidebarVariants = cva("flex flex-col h-full transition-all duration-300 ease-in-out", {
  variants: {
    side: {
      left: "border-r",
      right: "border-l",
    },
    collapsed: {
      true: "w-[var(--sidebar-width-icon)]",
      false: "w-[var(--sidebar-width)]",
    },
    collapsible: {
      icon: "",
      full: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      collapsed: true,
      collapsible: "full",
      className: "w-0 overflow-hidden",
    },
  ],
  defaultVariants: {
    side: "left",
    collapsed: false,
    collapsible: "icon",
  },
})

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sidebarVariants> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const { collapsed, collapsible, side } = useSidebar()

  return (
    <aside
      className={cn(sidebarVariants({ collapsed, collapsible, side }), className)}
      data-state={collapsed ? "collapsed" : "expanded"}
      {...props}
    />
  )
}

// --- Sidebar Header ---
interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return <div className={cn("flex items-center", className)} {...props} />
}

// --- Sidebar Content ---
interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarContent({ className, ...props }: SidebarContentProps) {
  return <div className={cn("flex-1 overflow-y-auto", className)} {...props} />
}

// --- Sidebar Menu ---
interface SidebarMenuProps extends React.HTMLAttributes<HTMLUListElement> {}

export function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return <ul className={cn("space-y-1 px-2", className)} {...props} />
}

// --- Sidebar Menu Item ---
interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {}

export function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  return <li className={cn("", className)} {...props} />
}

// --- Sidebar Menu Button ---
interface SidebarMenuButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  tooltip?: string
  asChild?: boolean
}

export function SidebarMenuButton({ className, children, tooltip, asChild = false, ...props }: SidebarMenuButtonProps) {
  const { collapsed } = useSidebar()
  const Comp = asChild ? "div" : Button

  const buttonContent = (
    <Comp
      variant="ghost"
      className={cn("w-full justify-start gap-3", collapsed ? "px-2" : "px-4", className)}
      {...props}
    >
      {children}
    </Comp>
  )

  if (collapsed && tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
          <TooltipContent side="right">{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return buttonContent
}

// --- Sidebar Trigger ---
interface SidebarTriggerProps extends React.ComponentPropsWithoutRef<typeof Button> {}

export function SidebarTrigger({ className, ...props }: SidebarTriggerProps) {
  const { collapsed, setCollapsed, collapsible } = useSidebar()

  if (collapsible === false) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setCollapsed(!collapsed)}
      className={cn("h-8 w-8", className)}
      {...props}
    >
      {collapsed ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-panel-right-open"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <line x1="15" x2="15" y1="3" y2="21" />
          <path d="m10 17-5-5 5-5" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-panel-left-close"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <path d="M9 3v18" />
          <path d="m14 17 5-5-5-5" />
        </svg>
      )}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

// --- Sidebar Inset ---
interface SidebarInsetProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarInset({ className, ...props }: SidebarInsetProps) {
  return <div className={cn("", className)} {...props} />
}

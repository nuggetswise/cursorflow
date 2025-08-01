"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import {
  Menu,
  Search,
  HelpCircle,
  Settings,
  Grid,
  Pencil,
  Inbox,
  Star,
  Clock,
  Send,
  FileText,
  ChevronDown,
  Users,
  Tag,
  Info,
  Mail,
  Trash2,
  Archive,
  CheckIcon as Report,
  Clock3,
  CheckSquare,
  Folder,
  MoreVertical,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

interface Email {
  id: string
  sender: string
  senderAvatar: string
  subject: string
  snippet: string
  date: string
  read: boolean
  starred: boolean
}

const emails: Email[] = [
  {
    id: "1",
    sender: "Google",
    senderAvatar: "/placeholder.svg?height=32&width=32",
    subject: "Security alert for your linked account",
    snippet: "Your Google Account was recently signed in on a new Windows device.",
    date: "Jul 29",
    read: false,
    starred: false,
  },
  {
    id: "2",
    sender: "Vercel",
    senderAvatar: "/placeholder.svg?height=32&width=32",
    subject: "Your deployment is ready!",
    snippet: "Your project 'my-next-app' has been successfully deployed.",
    date: "Jul 28",
    read: true,
    starred: true,
  },
  {
    id: "3",
    sender: "GitHub",
    senderAvatar: "/placeholder.svg?height=32&width=32",
    subject: "[GitHub] New pull request on vercel/next.js",
    snippet: "User 'johndoe' opened a pull request: 'feat: add new component'",
    date: "Jul 28",
    read: false,
    starred: false,
  },
  {
    id: "4",
    sender: "Stripe",
    senderAvatar: "/placeholder.svg?height=32&width=32",
    subject: "Your monthly invoice is ready",
    snippet: "View your invoice for July 2025.",
    date: "Jul 27",
    read: true,
    starred: false,
  },
  {
    id: "5",
    sender: "Newsletter",
    senderAvatar: "/placeholder.svg?height=32&width=32",
    subject: "Weekly Digest: Top Tech News",
    snippet: "Catch up on the latest in AI, web development, and more.",
    date: "Jul 26",
    read: false,
    starred: false,
  },
]

function SidebarContent({
  selectedTab,
  setSelectedTab,
}: { selectedTab: string; setSelectedTab: (tab: string) => void }) {
  return (
    <div className="p-4 flex flex-col h-full">
      <Button className="w-full justify-start gap-2 mb-4 rounded-full px-4 py-3 shadow-md bg-gmail-red text-white hover:bg-red-700 dark:bg-gmail-red dark:hover:bg-red-700">
        <Pencil className="h-5 w-5" />
        <span className="hidden sm:inline">Compose</span>
      </Button>
      <nav className="space-y-1 flex-1">
        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 rounded-r-full ${
            selectedTab === "primary"
              ? "bg-gmail-grey-bg dark:bg-gmail-dark-surface font-semibold text-gmail-blue dark:text-gmail-blue"
              : "text-gray-700 dark:text-gmail-dark-text hover:bg-gray-100 dark:hover:bg-gmail-dark-surface"
          }`}
          onClick={() => setSelectedTab("primary")}
        >
          <Inbox className="h-5 w-5 flex-shrink-0" />
          <span className="hidden sm:inline">Inbox</span>
          <span className="ml-auto text-sm font-normal hidden sm:inline">1,234</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-r-full text-gray-700 dark:text-gmail-dark-text hover:bg-gray-100 dark:hover:bg-gmail-dark-surface"
        >
          <Star className="h-5 w-5 flex-shrink-0" />
          <span className="hidden sm:inline">Starred</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-r-full text-gray-700 dark:text-gmail-dark-text hover:bg-gray-100 dark:hover:bg-gmail-dark-surface"
        >
          <Clock className="h-5 w-5 flex-shrink-0" />
          <span className="hidden sm:inline">Snoozed</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-r-full text-gray-700 dark:text-gmail-dark-text hover:bg-gray-100 dark:hover:bg-gmail-dark-surface"
        >
          <Send className="h-5 w-5 flex-shrink-0" />
          <span className="hidden sm:inline">Sent</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-r-full text-gray-700 dark:text-gmail-dark-text hover:bg-gray-100 dark:hover:bg-gmail-dark-surface"
        >
          <FileText className="h-5 w-5 flex-shrink-0" />
          <span className="hidden sm:inline">Drafts</span>
          <span className="ml-auto text-sm font-normal hidden sm:inline">5</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-r-full text-gray-700 dark:text-gmail-dark-text hover:bg-gray-100 dark:hover:bg-gmail-dark-surface"
        >
          <ChevronDown className="h-5 w-5 flex-shrink-0" />
          <span className="hidden sm:inline">More</span>
        </Button>
      </nav>
      <div className="hidden sm:block">
        <Separator className="my-4 dark:bg-gmail-dark-border" />
        <div className="text-sm font-semibold text-gray-600 dark:text-gmail-dark-text-secondary mb-2">Labels</div>
        <nav className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-r-full text-gray-700 dark:text-gmail-dark-text hover:bg-gray-100 dark:hover:bg-gmail-dark-surface"
          >
            <Users className="h-5 w-5 text-green-600 flex-shrink-0" />
            <span>Family</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-r-full text-gray-700 dark:text-gmail-dark-text hover:bg-gray-100 dark:hover:bg-gmail-dark-surface"
          >
            <Tag className="h-5 w-5 text-purple-600 flex-shrink-0" />
            <span>Work</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-r-full text-gray-700 dark:text-gmail-dark-text hover:bg-gray-100 dark:hover:bg-gmail-dark-surface"
          >
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <span>Important</span>
          </Button>
        </nav>
      </div>
    </div>
  )
}

export function InboxScreen() {
  const [selectedTab, setSelectedTab] = useState("primary")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const isMobile = useMobile()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen overflow-hidden bg-white dark:bg-gmail-dark-bg text-gray-800 dark:text-gmail-dark-text">
        {/* Header */}
        <header className="flex items-center justify-between p-2 lg:p-4 border-b border-gmail-border dark:border-gmail-dark-border bg-white dark:bg-gmail-dark-bg fixed top-0 left-0 right-0 z-10 h-14 lg:h-16">
          <div className="flex items-center gap-2">
            {isMobile ? (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full lg:hidden">
                    <Menu className="h-5 w-5 text-gray-600 dark:text-gmail-dark-text" />
                    <span className="sr-only">Main menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-64 p-0 bg-white dark:bg-gmail-dark-bg border-gmail-border dark:border-gmail-dark-border"
                >
                  <div className="flex items-center justify-between p-4 border-b border-gmail-border dark:border-gmail-dark-border">
                    <div className="flex items-center gap-1">
                      <Mail className="h-6 w-6 text-gmail-red" />
                      <span className="text-xl font-medium text-gray-700 dark:text-gmail-dark-text">Gmail</span>
                    </div>
                  </div>
                  <SidebarContent selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                </SheetContent>
              </Sheet>
            ) : (
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5 text-gray-600 dark:text-gmail-dark-text" />
                <span className="sr-only">Main menu</span>
              </Button>
            )}
            <div className="flex items-center gap-1">
              <Mail className="h-5 w-6 lg:h-6 lg:w-6 text-gmail-red" />
              <span className="text-lg lg:text-2xl font-medium text-gray-700 dark:text-gmail-dark-text">Gmail</span>
            </div>
          </div>

          <div className="flex-1 max-w-xl lg:max-w-2xl mx-2 lg:mx-4 relative">
            <Input
              type="search"
              placeholder="Search mail"
              className="w-full pl-8 lg:pl-10 pr-4 py-1.5 lg:py-2 rounded-full bg-gmail-grey-bg dark:bg-gmail-dark-surface border-none focus:ring-gmail-blue focus:ring-1 text-sm lg:text-base"
            />
            <Search className="absolute left-2 lg:left-3 top-1/2 -translate-y-1/2 h-4 w-4 lg:h-5 lg:w-5 text-gray-500 dark:text-gmail-dark-text-secondary" />
          </div>

          <div className="flex items-center gap-1 lg:gap-2">
            <div className="hidden sm:flex items-center gap-1 lg:gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 lg:h-10 lg:w-10">
                    <HelpCircle className="h-4 w-4 lg:h-5 lg:w-5 text-gray-600 dark:text-gmail-dark-text" />
                    <span className="sr-only">Support</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Support</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 lg:h-10 lg:w-10">
                    <Settings className="h-4 w-4 lg:h-5 lg:w-5 text-gray-600 dark:text-gmail-dark-text" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 lg:h-10 lg:w-10">
                    <Grid className="h-4 w-4 lg:h-5 lg:w-5 text-gray-600 dark:text-gmail-dark-text" />
                    <span className="sr-only">Google apps</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Google apps</TooltipContent>
              </Tooltip>
            </div>

            <Avatar className="h-6 w-6 lg:h-8 lg:w-8">
              <AvatarImage alt="User Avatar" src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback className="text-xs lg:text-sm">JD</AvatarFallback>
            </Avatar>

            {/* Dark mode toggle - now positioned at the very end (top right corner) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8 lg:h-10 lg:w-10 border-2 border-gmail-blue dark:border-yellow-500 bg-gmail-blue/10 dark:bg-yellow-500/10 hover:bg-gmail-blue/20 dark:hover:bg-yellow-500/20 transition-all duration-200"
                  onClick={toggleTheme}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-500" />
                  ) : (
                    <Moon className="h-4 w-4 lg:h-5 lg:w-5 text-gmail-blue" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle theme</TooltipContent>
            </Tooltip>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1 pt-14 lg:pt-16">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <aside className="w-16 lg:w-60 border-r border-gmail-border dark:border-gmail-dark-border bg-white dark:bg-gmail-dark-bg flex flex-col overflow-y-auto">
              <SidebarContent selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
            </aside>
          )}

          {/* Email List Area */}
          <main className="flex-1 flex flex-col bg-gmail-grey-bg dark:bg-gmail-dark-bg overflow-hidden">
            {/* Toolbar above email list */}
            <div className="flex items-center justify-between p-2 lg:p-3 border-b border-gmail-border dark:border-gmail-dark-border bg-white dark:bg-gmail-dark-bg">
              <div className="flex items-center gap-1 lg:gap-2">
                <Checkbox id="select-all" className="rounded h-4 w-4 lg:h-5 lg:w-5" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 lg:h-10 lg:w-10">
                      <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4 text-gray-600 dark:text-gmail-dark-text" />
                      <span className="sr-only">Select options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="dark:bg-gmail-dark-surface dark:border-gmail-dark-border"
                  >
                    <DropdownMenuItem className="dark:text-gmail-dark-text dark:hover:bg-gmail-dark-bg">
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem className="dark:text-gmail-dark-text dark:hover:bg-gmail-dark-bg">
                      None
                    </DropdownMenuItem>
                    <DropdownMenuItem className="dark:text-gmail-dark-text dark:hover:bg-gmail-dark-bg">
                      Read
                    </DropdownMenuItem>
                    <DropdownMenuItem className="dark:text-gmail-dark-text dark:hover:bg-gmail-dark-bg">
                      Unread
                    </DropdownMenuItem>
                    <DropdownMenuItem className="dark:text-gmail-dark-text dark:hover:bg-gmail-dark-bg">
                      Starred
                    </DropdownMenuItem>
                    <DropdownMenuItem className="dark:text-gmail-dark-text dark:hover:bg-gmail-dark-bg">
                      Unstarred
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Separator orientation="vertical" className="h-4 lg:h-6 mx-1 lg:mx-2 dark:bg-gmail-dark-border" />
                <div className="flex items-center gap-1 overflow-x-auto">
                  {[
                    { icon: Archive, tooltip: "Archive" },
                    { icon: Report, tooltip: "Report spam" },
                    { icon: Trash2, tooltip: "Delete" },
                    { icon: Mail, tooltip: "Mark as read" },
                    { icon: Clock3, tooltip: "Snooze" },
                    { icon: CheckSquare, tooltip: "Move to" },
                    { icon: Folder, tooltip: "Labels" },
                    { icon: MoreVertical, tooltip: "More" },
                  ].map(({ icon: Icon, tooltip }, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full h-8 w-8 lg:h-10 lg:w-10 flex-shrink-0"
                        >
                          <Icon className="h-3 w-3 lg:h-5 lg:w-5 text-gray-600 dark:text-gmail-dark-text" />
                          <span className="sr-only">{tooltip}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{tooltip}</TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs lg:text-sm text-gray-600 dark:text-gmail-dark-text-secondary">
                <span>1-50 of 1,234</span>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4 rotate-180" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </div>

            {/* Email Tabs */}
            <div className="flex border-b border-gmail-border dark:border-gmail-dark-border bg-white dark:bg-gmail-dark-bg">
              {[
                { id: "primary", label: "Primary" },
                { id: "social", label: "Social" },
                { id: "promotions", label: "Promotions" },
              ].map(({ id, label }) => (
                <Button
                  key={id}
                  variant="ghost"
                  className={`flex-1 rounded-none border-b-2 text-xs lg:text-sm py-2 lg:py-3 ${
                    selectedTab === id
                      ? "border-gmail-blue text-gmail-blue font-semibold"
                      : "border-transparent text-gray-600 dark:text-gmail-dark-text-secondary hover:bg-gray-50 dark:hover:bg-gmail-dark-surface"
                  }`}
                  onClick={() => setSelectedTab(id)}
                >
                  {label}
                </Button>
              ))}
            </div>

            {/* Email List */}
            <div className="flex-1 overflow-y-auto">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className={`flex items-center p-2 lg:p-3 border-b border-gmail-border dark:border-gmail-dark-border cursor-pointer hover:shadow-sm transition-colors ${
                    email.read
                      ? "bg-white dark:bg-gmail-dark-bg"
                      : "bg-blue-50 dark:bg-blue-900/20 bg-opacity-20 font-semibold"
                  } hover:bg-gray-50 dark:hover:bg-gmail-dark-surface`}
                >
                  <Checkbox id={`email-${email.id}`} className="mr-2 lg:mr-4 rounded h-4 w-4 flex-shrink-0" />
                  <Button variant="ghost" size="icon" className="h-6 w-6 mr-2 lg:mr-4 flex-shrink-0">
                    <Star
                      className={`h-3 w-3 lg:h-4 lg:w-4 ${email.starred ? "text-yellow-500 fill-yellow-500" : "text-gray-400 dark:text-gmail-dark-text-secondary"}`}
                    />
                    <span className="sr-only">Star email</span>
                  </Button>
                  <Avatar className="h-5 w-5 lg:h-6 lg:w-6 mr-2 lg:mr-4 flex-shrink-0">
                    <AvatarImage alt={email.sender} src={email.senderAvatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">{email.sender.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex flex-col lg:flex-row lg:items-center min-w-0">
                    <div className="w-full lg:w-32 text-xs lg:text-sm font-medium truncate mb-1 lg:mb-0">
                      {email.sender}
                    </div>
                    <div className="flex-1 flex flex-col lg:flex-row lg:items-center gap-0 lg:gap-2 lg:ml-4 min-w-0">
                      <span className="text-xs lg:text-sm font-medium truncate">{email.subject}</span>
                      <span className="text-xs lg:text-sm text-gmail-text-light dark:text-gmail-dark-text-secondary truncate">
                        {isMobile ? email.snippet.substring(0, 50) + "..." : `- ${email.snippet}`}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gmail-text-light dark:text-gmail-dark-text-secondary ml-2 lg:ml-4 flex-shrink-0">
                    {email.date}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { MapPin, Home, Search, User, Flag, Settings, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  
  const isCollapsed = state === "collapsed";
  const isActive = (path: string) => location.pathname === path;

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium w-full flex items-center p-2 rounded-md" : 
    "hover:bg-muted/50 w-full flex items-center p-2 rounded-md";

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
        <SidebarTrigger className="m-2 self-end" />
        
        <SidebarContent>
          <div className={`flex items-center justify-center py-4 ${isCollapsed ? 'px-2' : 'px-6'}`}>
            {!isCollapsed ? (
              <Link to="/" className="flex items-center space-x-2">
                <MapPin className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">CivicLens</span>
              </Link>
            ) : (
              <Link to="/" className="flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </Link>
            )}
          </div>

          <SidebarGroup>
            <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/" className={getNavCls({ isActive: isActive('/') })}>
                      <Home className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>Dashboard</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/explore" className={getNavCls({ isActive: isActive('/explore') })}>
                      <Search className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>Explore Issues</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/report" className={getNavCls({ isActive: isActive('/report') })}>
                      <Flag className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>Report Issue</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {user?.role === 'admin' && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/admin" className={getNavCls({ isActive: isActive('/admin') })}>
                        <Settings className="mr-2 h-4 w-4" />
                        {!isCollapsed && <span>Admin Panel</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/profile" className={getNavCls({ isActive: isActive('/profile') })}>
                      <User className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>Profile</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button 
                      onClick={logout} 
                      className="w-full flex items-center p-2 rounded-md hover:bg-muted/50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>Logout</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <div className="flex items-center">
            <SidebarTrigger className="mr-2" />
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm">{user.name}</span>
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

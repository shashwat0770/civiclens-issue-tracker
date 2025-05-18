
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { MapPin } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <MapPin className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">CivicLens</h1>
          </div>
          <p className="text-muted-foreground">Report and track civic issues in your community</p>
        </div>
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-r from-primary to-primary/70 bg-cover bg-center">
        <div className="flex flex-col h-full justify-center items-center p-12 text-white">
          <h2 className="text-4xl font-bold mb-6">Empower Your Community</h2>
          <p className="text-xl mb-8 max-w-md text-center">
            CivicLens connects citizens with local authorities to efficiently report and resolve community issues.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-bold mb-2">Report Issues</h3>
              <p className="text-sm">Submit detailed reports with photos and location data</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-bold mb-2">Track Progress</h3>
              <p className="text-sm">Follow the status of your reports from submission to resolution</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-bold mb-2">View Community Issues</h3>
              <p className="text-sm">Discover and support reports in your neighborhood</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-bold mb-2">Stay Informed</h3>
              <p className="text-sm">Get notifications when your issues are addressed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

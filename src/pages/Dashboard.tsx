
import React from 'react';
import { Link } from 'react-router-dom';
import { useIssues } from '@/context/IssueContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Flag, Info, Plus } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { issues, userIssues } = useIssues();

  const pendingIssues = issues.filter(issue => issue.status === 'pending').length;
  const inProgressIssues = issues.filter(issue => issue.status === 'inprogress').length;
  const resolvedIssues = issues.filter(issue => issue.status === 'resolved').length;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inprogress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <Button asChild>
          <Link to="/report">
            <Plus className="mr-2 h-4 w-4" /> Report New Issue
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingIssues}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{inProgressIssues}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resolved Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{resolvedIssues}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Your Recent Reports</CardTitle>
            <CardDescription>
              Issues you've reported recently
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userIssues.length > 0 ? (
              userIssues.slice(0, 3).map((issue) => (
                <div key={issue.id} className="flex items-start gap-4 p-3 rounded-md hover:bg-muted/50">
                  <div className="mt-1">
                    <Flag className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{issue.title}</div>
                      <Badge className={getStatusBadgeClass(issue.status)}>
                        {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{issue.description}</p>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{issue.location.address}</span>
                      <span className="ml-auto">
                        {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">You haven't reported any issues yet</p>
                <Button className="mt-4" asChild>
                  <Link to="/report">Report an Issue</Link>
                </Button>
              </div>
            )}
          </CardContent>
          {userIssues.length > 0 && (
            <CardFooter>
              <Button variant="ghost" asChild className="w-full">
                <Link to="/profile">View All Reports</Link>
              </Button>
            </CardFooter>
          )}
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Nearby Issues</CardTitle>
            <CardDescription>
              Recent issues reported in your area
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {issues.slice(0, 3).map((issue) => (
              <div key={issue.id} className="flex items-start gap-4 p-3 rounded-md hover:bg-muted/50">
                <div className="mt-1">
                  <Flag className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{issue.title}</div>
                    <Badge className={getStatusBadgeClass(issue.status)}>
                      {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{issue.description}</p>
                  <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{issue.location.address}</span>
                    </div>
                    <div className="flex items-center">
                      <span>Reported by {issue.createdByName}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" asChild className="w-full">
              <Link to="/explore">Explore All Issues</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Learn how to use CivicLens to report and track civic issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Flag className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Report an Issue</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Submit details about the problem including photos and location
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Info className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Track Progress</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Follow updates as authorities address and resolve the issue
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Explore Community</h3>
              <p className="text-sm text-muted-foreground mt-2">
                View and support issues reported in your neighborhood
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

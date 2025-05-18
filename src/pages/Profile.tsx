
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useIssues } from '@/context/IssueContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { MapPin } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { userIssues } = useIssues();

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

  const pendingIssues = userIssues.filter(issue => issue.status === 'pending');
  const inProgressIssues = userIssues.filter(issue => issue.status === 'inprogress');
  const resolvedIssues = userIssues.filter(issue => issue.status === 'resolved');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account and view your reported issues</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-4xl">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user?.name.charAt(0)
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="font-medium">{user?.name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="font-medium">{user?.email}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
              <p className="font-medium capitalize">{user?.role}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Issues Reported</h3>
              <p className="font-medium">{userIssues.length}</p>
            </div>
            
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Reports</CardTitle>
            <CardDescription>
              Track and manage the issues you've reported
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="all">
                  All ({userIssues.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({pendingIssues.length})
                </TabsTrigger>
                <TabsTrigger value="inprogress">
                  In Progress ({inProgressIssues.length})
                </TabsTrigger>
                <TabsTrigger value="resolved">
                  Resolved ({resolvedIssues.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {userIssues.length > 0 ? (
                  userIssues.map(issue => (
                    <div key={issue.id} className="border rounded-md p-4 hover:bg-muted/50">
                      <div className="flex justify-between">
                        <div className="font-medium">{issue.title}</div>
                        <Badge className={getStatusBadgeClass(issue.status)}>
                          {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{issue.location.address}</span>
                        <span className="ml-auto">
                          {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">You haven't reported any issues yet</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                {pendingIssues.length > 0 ? (
                  pendingIssues.map(issue => (
                    <div key={issue.id} className="border rounded-md p-4 hover:bg-muted/50">
                      <div className="flex justify-between">
                        <div className="font-medium">{issue.title}</div>
                        <Badge className={getStatusBadgeClass(issue.status)}>
                          {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{issue.location.address}</span>
                        <span className="ml-auto">
                          {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No pending issues</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="inprogress" className="space-y-4">
                {inProgressIssues.length > 0 ? (
                  inProgressIssues.map(issue => (
                    <div key={issue.id} className="border rounded-md p-4 hover:bg-muted/50">
                      <div className="flex justify-between">
                        <div className="font-medium">{issue.title}</div>
                        <Badge className={getStatusBadgeClass(issue.status)}>
                          {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{issue.location.address}</span>
                        <span className="ml-auto">
                          {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No issues in progress</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="resolved" className="space-y-4">
                {resolvedIssues.length > 0 ? (
                  resolvedIssues.map(issue => (
                    <div key={issue.id} className="border rounded-md p-4 hover:bg-muted/50">
                      <div className="flex justify-between">
                        <div className="font-medium">{issue.title}</div>
                        <Badge className={getStatusBadgeClass(issue.status)}>
                          {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{issue.location.address}</span>
                        <span className="ml-auto">
                          {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No resolved issues</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

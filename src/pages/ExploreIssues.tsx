
import React, { useState } from 'react';
import { useIssues } from '@/context/IssueContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { IssueStatus } from '@/types';

const ExploreIssues: React.FC = () => {
  const { issues } = useIssues();
  
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  const categories = Array.from(new Set(issues.map(issue => issue.category)));
  
  // Filter issues based on selected filters and search query
  const filteredIssues = issues.filter(issue => {
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    const matchesSearch = 
      searchQuery === '' || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesSearch;
  });
  
  const getStatusBadgeClass = (status: IssueStatus) => {
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
      <div>
        <h1 className="text-3xl font-bold">Explore Issues</h1>
        <p className="text-muted-foreground">
          Browse and discover civic issues in your community
        </p>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filter Issues</CardTitle>
          <CardDescription>
            Refine the list to find specific issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inprogress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 border-t">
          <div className="flex justify-between items-center w-full">
            <span className="text-sm text-muted-foreground">
              Found {filteredIssues.length} issues
            </span>
            <div className="space-x-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                size="sm"
              >
                List View
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                onClick={() => setViewMode('map')}
                size="sm"
              >
                Map View
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredIssues.length > 0 ? (
            filteredIssues.map(issue => (
              <Card key={issue.id}>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                  <div className="md:col-span-2 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold mb-2">{issue.title}</h2>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className={getStatusBadgeClass(issue.status)}>
                            {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                          </Badge>
                          <Badge variant="outline">{issue.category}</Badge>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{issue.description}</p>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{issue.location.address}</span>
                    </div>
                  </div>
                  
                  <div className="md:col-span-1 p-6">
                    <div className="h-40 mb-4 overflow-hidden rounded-md bg-muted">
                      {issue.imageUrl ? (
                        <img
                          src={issue.imageUrl}
                          alt={issue.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Reported by:</span> {issue.createdByName}
                      </div>
                      
                      {issue.assignedToName && (
                        <div className="text-sm">
                          <span className="font-medium">Assigned to:</span> {issue.assignedToName}
                        </div>
                      )}
                      
                      <div className="text-sm">
                        <span className="font-medium">Upvotes:</span> {issue.upvotes.length}
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium">Comments:</span> {issue.comments.length}
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-xl font-medium">No issues found</p>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      ) : (
        <Card className="h-[500px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">Map View Coming Soon</p>
            <p className="text-muted-foreground">
              Map integration for visualizing issue locations will be available in a future update.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ExploreIssues;

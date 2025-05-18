
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Issue, IssueStatus, Comment } from '../types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface IssueContextType {
  issues: Issue[];
  userIssues: Issue[];
  isLoading: boolean;
  createIssue: (issueData: Partial<Issue>) => Promise<Issue>;
  updateIssueStatus: (id: string, status: IssueStatus) => Promise<void>;
  assignIssue: (id: string, assignedToId: string, assignedToName: string) => Promise<void>;
  addComment: (issueId: string, text: string) => Promise<void>;
  upvoteIssue: (issueId: string) => Promise<void>;
  getIssueById: (id: string) => Issue | undefined;
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

// Mock data for demo purposes
const MOCK_ISSUES: Issue[] = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic delays and potential vehicle damage',
    imageUrl: 'https://images.unsplash.com/photo-1592227810269-08454cb127a0?q=80&w=2159&auto=format&fit=crop',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: '123 Main St, New York, NY'
    },
    status: 'pending',
    createdById: '2',
    createdByName: 'Citizen User',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    upvotes: ['1', '3', '4'],
    comments: [
      {
        id: '1',
        text: 'This is getting worse by the day!',
        userId: '1',
        userName: 'Admin User',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      }
    ],
    category: 'Roads'
  },
  {
    id: '2',
    title: 'Broken Street Light',
    description: 'Street light not working, creating safety concerns at night',
    imageUrl: 'https://images.unsplash.com/photo-1589574770951-a5a58404f344?q=80&w=2070&auto=format&fit=crop',
    location: {
      lat: 40.7142,
      lng: -74.0119,
      address: '456 Park Ave, New York, NY'
    },
    status: 'inprogress',
    createdById: '2',
    createdByName: 'Citizen User',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    assignedToId: '1',
    assignedToName: 'Admin User',
    upvotes: ['1', '3'],
    comments: [],
    category: 'Lighting'
  },
  {
    id: '3',
    title: 'Overflowing Garbage Bin',
    description: 'Garbage bin has not been collected for days causing sanitation issues',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=1974&auto=format&fit=crop',
    location: {
      lat: 40.7112,
      lng: -74.0024,
      address: '789 Broadway, New York, NY'
    },
    status: 'resolved',
    createdById: '3',
    createdByName: 'Jane Smith',
    createdAt: new Date(Date.now() - 3600000 * 168).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    assignedToId: '1',
    assignedToName: 'Admin User',
    upvotes: ['2', '4'],
    comments: [
      {
        id: '2',
        text: 'This has been resolved',
        userId: '1',
        userName: 'Admin User',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      }
    ],
    category: 'Sanitation'
  }
];

export const IssueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate API call to fetch issues
    const fetchIssues = async () => {
      setIsLoading(true);
      try {
        // Simulate API request delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIssues(MOCK_ISSUES);
      } catch (error) {
        console.error('Error fetching issues:', error);
        toast.error('Failed to load issues');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // Get issues created by the current user
  const userIssues = user ? issues.filter(issue => issue.createdById === user.id) : [];

  const createIssue = async (issueData: Partial<Issue>): Promise<Issue> => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) {
        throw new Error('User must be authenticated to create an issue');
      }
      
      const newIssue: Issue = {
        id: `${issues.length + 1}`,
        title: issueData.title || '',
        description: issueData.description || '',
        imageUrl: issueData.imageUrl,
        location: issueData.location || { lat: 0, lng: 0, address: '' },
        status: 'pending',
        createdById: user.id,
        createdByName: user.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: [],
        comments: [],
        category: issueData.category || 'Other',
      };
      
      setIssues(prev => [...prev, newIssue]);
      toast.success('Issue reported successfully');
      return newIssue;
    } catch (error) {
      console.error('Error creating issue:', error);
      toast.error('Failed to report issue');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateIssueStatus = async (id: string, status: IssueStatus) => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIssues(prev => prev.map(issue => {
        if (issue.id === id) {
          return {
            ...issue,
            status,
            updatedAt: new Date().toISOString(),
          };
        }
        return issue;
      }));
      
      toast.success(`Issue status updated to ${status}`);
    } catch (error) {
      console.error('Error updating issue status:', error);
      toast.error('Failed to update issue status');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const assignIssue = async (id: string, assignedToId: string, assignedToName: string) => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIssues(prev => prev.map(issue => {
        if (issue.id === id) {
          return {
            ...issue,
            assignedToId,
            assignedToName,
            updatedAt: new Date().toISOString(),
          };
        }
        return issue;
      }));
      
      toast.success('Issue assigned successfully');
    } catch (error) {
      console.error('Error assigning issue:', error);
      toast.error('Failed to assign issue');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async (issueId: string, text: string) => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) {
        throw new Error('User must be authenticated to add a comment');
      }
      
      const newComment: Comment = {
        id: `comment_${Date.now()}`,
        text,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        createdAt: new Date().toISOString(),
      };
      
      setIssues(prev => prev.map(issue => {
        if (issue.id === issueId) {
          return {
            ...issue,
            comments: [...issue.comments, newComment],
            updatedAt: new Date().toISOString(),
          };
        }
        return issue;
      }));
      
      toast.success('Comment added');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const upvoteIssue = async (issueId: string) => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) {
        throw new Error('User must be authenticated to upvote');
      }
      
      setIssues(prev => prev.map(issue => {
        if (issue.id === issueId) {
          const hasUpvoted = issue.upvotes.includes(user.id);
          
          return {
            ...issue,
            upvotes: hasUpvoted
              ? issue.upvotes.filter(id => id !== user.id)
              : [...issue.upvotes, user.id],
          };
        }
        return issue;
      }));
      
      toast.success('Vote recorded');
    } catch (error) {
      console.error('Error upvoting issue:', error);
      toast.error('Failed to record vote');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getIssueById = (id: string) => {
    return issues.find(issue => issue.id === id);
  };

  return (
    <IssueContext.Provider
      value={{
        issues,
        userIssues,
        isLoading,
        createIssue,
        updateIssueStatus,
        assignIssue,
        addComment,
        upvoteIssue,
        getIssueById,
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};

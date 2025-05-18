
export type UserRole = 'citizen' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type IssueStatus = 'pending' | 'inprogress' | 'resolved';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  location: Location;
  status: IssueStatus;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  assignedToId?: string;
  assignedToName?: string;
  upvotes: string[];
  comments: Comment[];
  category: string;
}

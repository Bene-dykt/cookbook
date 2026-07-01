import { Timestamp } from "firebase/firestore";

export interface Recipe {
  id?: string;
  title: string;
  ingredients: string[];
  steps: string[];
  authorId: string;
  isPublic: boolean;
  createdAt: Timestamp;
}

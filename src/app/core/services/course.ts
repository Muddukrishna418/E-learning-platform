export interface Course {
  id?: number;
  title: string;
  description: string;
  price: number;
  thumbnailUrl?: string;
  instructorId?: number;
}
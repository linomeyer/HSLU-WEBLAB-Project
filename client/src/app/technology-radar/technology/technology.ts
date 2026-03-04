export interface Technology {
  _id?: string;
  name: string;
  category: string;
  ring: string;
  description: string;
  reason: string;
  isPublished: boolean;
  createdAt: Date;
  changedAt?: Date;
}

export interface TechnologyCreateOrUpdate {
  name: string;
  category: string;
  ring?: string | null;
  description: string;
  reason?: string | null;
  isPublished: boolean;
}

export interface IClassification {
  _id?: string;
  category: Category;
  driverName: string;
  points: number;
  position?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IClassificationResponse {
  _id: string;
  category: Category;
  driverName: string;
  points: number;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateClassificationRequest {
  category: Category;
  driverName: string;
  points: number;
}

export interface IUpdateClassificationRequest {
  category?: Category;
  driverName?: string;
  points?: number;
}

export interface IBulkClassificationRequest {
  _id?: string; // Se tem ID, é update. Se não tem, é create
  category: Category;
  driverName: string;
  points: number;
}

export interface IBulkUpdateClassificationsRequest {
  classifications: IBulkClassificationRequest[];
}

export interface IBulkUpdateResult {
  created: IClassificationResponse[];
  updated: IClassificationResponse[];
  deleted: string[];
  total: {
    created: number;
    updated: number;
    deleted: number;
  };
}

export enum Category {
  PREMIUM = 'PREMIUM',
  OURO = 'OURO',
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F'
}

export interface IClassificationQuery {
  category?: Category;
  driverName?: string;
  minPoints?: number;
  maxPoints?: number;
  limit?: number;
  page?: number;
}

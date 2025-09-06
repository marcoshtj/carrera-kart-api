export interface IOperatingHour {
  _id: string;
  group: 'header' | 'footer';
  slot: number;
  label: string;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOperatingHourResponse {
  _id: string;
  group: 'header' | 'footer';
  slot: number;
  label: string;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateOperatingHourRequest {
  label?: string;
  visible?: boolean;
}

export interface IBulkUpdateOperatingHourRequest {
  id: string;
  label?: string;
  visible?: boolean;
}

export interface IBulkUpdateOperatingHoursRequest {
  operatingHours: IBulkUpdateOperatingHourRequest[];
}

export interface IBulkUpdateOperatingHoursResult {
  updated: IOperatingHourResponse[];
  errors: Array<{
    id: string;
    error: string;
  }>;
  total: {
    updated: number;
    errors: number;
  };
}

export interface OrgNode {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  email?: string;
  department?: string;
  children?: OrgNode[];
  directReports?: number;
}

export interface OrgChartData {
  root: OrgNode;
  totalEmployees: number;
  lastUpdated?: Date;
}

export interface BulkUploadData {
  name: string;
  role: string;
  email: string;
  managerEmail?: string;
  department?: string;
  avatar?: string;
}

export type LeadStatus = "new" | "in_progress" | "done" | "rejected";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  description: string | null;
  status: LeadStatus;
  source: string;
  ipHash: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadStore = {
  leads: Lead[];
};

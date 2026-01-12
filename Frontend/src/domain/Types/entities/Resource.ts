import type { Qualification } from "./Qualification";

export type Resource = {
  alphanumericCode: string;
  description: string;
  status: string;
  setupTimeMinutes: number;
  qualifications: Qualification[];
};

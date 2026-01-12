export type CreateIncidentCommand = {
  typeCode: string;
  startISO: string;
  endISO?: string;
  description: string;
  responsibleUserEmail: string;
  afectedVVECodes: number[];
};

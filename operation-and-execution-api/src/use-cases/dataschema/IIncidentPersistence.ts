export interface IIncidentPersistence {
  _id?: string;
  code: string;
  startISO: string;
  endISO: string | undefined;
  description: string;
  responsibleUserEmail: string;
  status: string;
  typeCode: string;
  duration?: {
    hour: number;
    minute: number;
  };
}

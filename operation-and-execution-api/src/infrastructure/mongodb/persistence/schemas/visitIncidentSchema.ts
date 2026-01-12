import mongoose from 'mongoose';
import { IVisitIncidentPersistence } from '../../../../use-cases/dataschema/IVisitIncidentPersistence';

const VisitIncident = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    incidentCode: { type: String, required: true },
    vveCode: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IVisitIncidentPersistence & mongoose.Document>('VisitIncident', VisitIncident);

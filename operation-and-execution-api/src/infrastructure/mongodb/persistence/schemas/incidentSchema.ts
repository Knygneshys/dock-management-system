import mongoose from 'mongoose';
import { IncidentStatus } from '../../../../domain/enums/incidentStatus';
import { IIncidentPersistence } from '../../../../use-cases/dataschema/IIncidentPersistence';

const Incident = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    startISO: { type: String, required: true },
    endISO: { type: String, required: false },
    description: { type: String, required: true },
    responsibleUserEmail: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: {
        values: Object.values(IncidentStatus),
        message: 'Invalid status',
      },
      default: IncidentStatus.Active,
    },
    typeCode: { type: String, required: true },
    duration: {
      type: {
        hour: { type: Number, required: true },
        minute: { type: Number, required: true },
      },
      required: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IIncidentPersistence & mongoose.Document>('Incident', Incident);

import mongoose from 'mongoose';
import { IIncidentTypePersistence } from '../../../../use-cases/dataschema/IIncidentTypePersistence';

const IncidentTypeSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  name: String,
  description: String,
  severity: String,
  parentIncidentTypeCode: String,
});

export default mongoose.model<IIncidentTypePersistence & mongoose.Document>('IncidentType', IncidentTypeSchema);

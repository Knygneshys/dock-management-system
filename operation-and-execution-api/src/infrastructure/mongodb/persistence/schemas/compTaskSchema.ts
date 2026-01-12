import mongoose from 'mongoose';
import { ICompTaskPersistence } from "../../../../use-cases/dataschema/ICompTaskPersistence";

const CompTask = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true },
    categoryCode: { type: String, required: true },
    vveCode: { type: Number, required: true },
    team: { type: String, required: true },
    status: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: false },
    impactOnOperations: { type: Boolean, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<ICompTaskPersistence & mongoose.Document>('CompTask', CompTask);
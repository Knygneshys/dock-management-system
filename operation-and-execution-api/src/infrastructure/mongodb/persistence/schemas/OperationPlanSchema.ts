import mongoose from 'mongoose';
import { IOperationPlanPersistence } from '../../../../use-cases/dataschema/IOperationPlanPersistance';

const OperationPlanSchema = new mongoose.Schema(
  {
    vvnCode: { type: Number, unique: true },
    dockCode: String,
    craneCodes: [String],
    staffCodes: [Number],
    storageAreaCode: String,
    start: Date,
    end: Date,
    usedAlgorithm: String,
    creatorUserEmail: String,
    isRegenerated: { type: Boolean, default: false },
    regeneratedAt: { type: Date },
    plannedOperations: [
      {
        start: Date,
        end: Date,
        from: {
          bay: Number,
          row: Number,
          tier: Number,
        },
        to: {
          bay: Number,
          row: Number,
          tier: Number,
        },
        containerId: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<IOperationPlanPersistence & mongoose.Document>('OperationPlan', OperationPlanSchema);

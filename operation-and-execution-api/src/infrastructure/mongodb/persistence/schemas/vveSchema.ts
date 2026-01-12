import mongoose from 'mongoose';
import { IVVEPersistence } from '../../../../use-cases/dataschema/IVVEPersistence';
import { VVEStatus } from '../../../../domain/enums/vveStatus';

const VVE = new mongoose.Schema(
  {
    code: { type: Number, unique: true },
    vvnCode: { type: Number, unique: true },
    vesselImo: String,
    arrivalTime: Date,
    creatorUserEmail: String,
    status: {
      type: String,
      required: true,
      enum: {
        values: Object.values(VVEStatus),
        message: 'Invalid status',
      },
      default: VVEStatus.InProgress,
    },
    dockCode: String,
    notes: [{ type: String }],
    executedOperations: [
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

export default mongoose.model<IVVEPersistence & mongoose.Document>('VVE', VVE);

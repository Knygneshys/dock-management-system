import mongoose from 'mongoose';
import { ICompTaskCategoryPersistence } from '../../../../use-cases/dataschema/ICompTaskCategoryPersistence';

const CompTaskCategory = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    defaultDelay: {
      type: {
        hour: { type: Number, required: true },
        minute: { type: Number, required: true },
      },
      required: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ICompTaskCategoryPersistence & mongoose.Document>('CompTaskCategory', CompTaskCategory);

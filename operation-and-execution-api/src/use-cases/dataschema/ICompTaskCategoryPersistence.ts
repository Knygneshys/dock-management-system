export interface ICompTaskCategoryPersistence {
  _id?: string;
  code: string;
  name: string;
  description: string;
  defaultDelay?: {
    hour: number;
    minute: number;
  };
}

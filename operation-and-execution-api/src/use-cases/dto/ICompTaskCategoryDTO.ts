export interface ICompTaskCategoryDTO {
  code?: string;
  name: string;
  description: string;
  defaultDelay?: {
    hour: number;
    minute: number;
  };
}

export type SortDir = 'asc' | 'desc';
export type OperationPlanSortBy = 'start' | 'end' | 'vvnCode' | 'createdAt';

export type SearchOperationPlansQuery = {
  from?: Date;
  to?: Date;
  vvnCode?: number;
  sortBy?: OperationPlanSortBy;
  sortDir?: SortDir;
};

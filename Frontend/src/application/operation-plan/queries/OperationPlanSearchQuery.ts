import { OperationPlanSearchSortBy } from "../../../domain/Enums/operationPlanSearchSortBy";
import { SearchSortDir } from "../../../domain/Enums/searchSortDir";

export type OperationPlanSearchQuery = {
  from?: Date;
  to?: Date;
  vvnCode?: number;
  sortBy?: OperationPlanSearchSortBy;
  sortDir?: SearchSortDir;
};

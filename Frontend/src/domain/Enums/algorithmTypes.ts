export const algorithmTypes = {
  Auto: "Auto",
  Optimal: "Optimal",
  OptimalMultiCrane: "OptimalMultiCrane",
  Heuristic: "Heuristic",
  HeuristicMultiCrane: "HeuristicMultiCrane",
  Genetic: "Genetic",
  GeneticMultiCrane: "GeneticMultiCrane",
} as const;

export type AlgorithType = keyof typeof algorithmTypes;

:- ['schedulingGeneticSingleCraneAlg.pl'].

% visit(Id,ProcessTime,FromTime,DueTime,PenaltyWeight).
visit(vv1, 8, 0, 10, 1).
visit(vv2, 8, 4, 9, 1).
visit(vv3, 4, 6, 23, 1).
visit(vv4, 9, 8, 14, 1).
visit(vv5, 3, 10, 15, 1).
visit(vv6, 10, 5, 13, 1).
visit(vv7, 8, 7, 12, 1).

crane(crane1).

staff_window(s1, 0, 23).
staff_window(s1, 24, 47).
staff_window(s2, 48, 71).
staff_window(s2, 72, 80).

% visits(NVisits).
visits(7).

% params
generations(100).
population(15).
prob_crossover(0.5).
prob_mutation(0.2).

%{
%  "best_sequence": ["vv1", "vv2", "vv3", "vv5", "vv7", "vv4", "vv6" ],
%  "total_delay_cost":92,
%  "schedule": [
%    {"visit":"vv1","start":0,"finish":7,"due":10,"delay":0,"penalty":0,"crane":"crane1","staff":"s1"},
%    {"visit":"vv2","start":8,"finish":15,"due":9,"delay":6,"penalty":6,"crane":"crane1","staff":"s1"},
%    {"visit":"vv3","start":16,"finish":19,"due":23,"delay":0,"penalty":0,"crane":"crane1","staff":"s1"},
%    {"visit":"vv5","start":20,"finish":22,"due":15,"delay":7,"penalty":7,"crane":"crane1","staff":"s1"},
%    {"visit":"vv7","start":24,"finish":31,"due":12,"delay":19,"penalty":19,"crane":"crane1","staff":"s1"},
%    {"visit":"vv4","start":32,"finish":40,"due":14,"delay":26,"penalty":26,"crane":"crane1","staff":"s1"},
%    {"visit":"vv6","start":48,"finish":57,"due":13,"delay":44,"penalty":44,"crane":"crane1","staff":"s2"}
%  ],
%  "computeTime":26
%}
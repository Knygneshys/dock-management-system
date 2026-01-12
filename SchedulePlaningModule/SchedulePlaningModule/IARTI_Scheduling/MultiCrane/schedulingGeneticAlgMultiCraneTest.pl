:- ['schedulingGeneticAlgMultiCrane.pl'].

% visit(Id,ProcessTime,FromTime,DueTime,PenaltyWeight).
visit(vv1, 8, 0, 10, 1).
visit(vv2, 8, 4, 9, 1).
visit(vv3, 4, 6, 23, 1).
visit(vv4, 9, 8, 14, 1).
visit(vv5, 3, 10, 15, 1).
visit(vv6, 10, 5, 13, 1).
visit(vv7, 8, 7, 12, 1).

crane(crane1).
crane(crane2).
crane(crane3).

staff_window(s1, 0, 23).
staff_window(s1, 24, 47).
staff_window(s2, 0, 23).
staff_window(s2, 24, 47).
staff_window(s3, 0, 23).
staff_window(s3, 24, 47).

% visits(NVisits).
visits(7).

% params
generations(100).
population(15).
prob_crossover(0.5).
prob_mutation(0.2).

%{
%  "best_sequence": ["vv1", "vv2", "vv7", "vv3", "vv5", "vv6", "vv4" ],
%  "total_delay_cost":8,
%  "schedule": [
%    {
%      "visit":"vv1",
%      "start":0,
%      "finish":2,
%      "due":10,
%      "delay":0,
%      "penalty":0,
%      "cranes": ["crane1", "crane2", "crane3" ],
%      "staffs": ["s1", "s2", "s3" ]
%    },
%    {
%      "visit":"vv2",
%      "start":4,
%      "finish":6,
%      "due":9,
%      "delay":0,
%      "penalty":0,
%      "cranes": ["crane1", "crane2", "crane3" ],
%      "staffs": ["s1", "s2", "s3" ]
%    },
%    {
%      "visit":"vv7",
%      "start":7,
%      "finish":9,
%      "due":12,
%      "delay":0,
%      "penalty":0,
%      "cranes": ["crane1", "crane2", "crane3" ],
%      "staffs": ["s1", "s2", "s3" ]
%    },
%    {
%      "visit":"vv3",
%      "start":10,
%      "finish":11,
%      "due":23,
%      "delay":0,
%      "penalty":0,
%      "cranes": ["crane1", "crane2" ],
%      "staffs": ["s1", "s2" ]
%    },
%    {
%      "visit":"vv5",
%      "start":12,
%      "finish":12,
%      "due":15,
%      "delay":0,
%      "penalty":0,
%      "cranes": ["crane1", "crane2", "crane3" ],
%      "staffs": ["s1", "s2", "s3" ]
%    },
%    {
%      "visit":"vv6",
%      "start":13,
%      "finish":16,
%      "due":13,
%      "delay":3,
%      "penalty":3,
%      "cranes": ["crane1", "crane2", "crane3" ],
%      "staffs": ["s1", "s2", "s3" ]
%    },
%    {
%      "visit":"vv4",
%      "start":17,
%      "finish":19,
%      "due":14,
%      "delay":5,
%      "penalty":5,
%      "cranes": ["crane1", "crane2", "crane3" ],
%      "staffs": ["s1", "s2", "s3" ]
%    }
%  ],
%  "computeTime":70
%}
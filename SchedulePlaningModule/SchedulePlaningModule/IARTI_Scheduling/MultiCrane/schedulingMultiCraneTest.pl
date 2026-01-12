% test_multi.pl
:- ['schedulingMultiCrane.pl'].

vvn(vvn1, 0, 10, 8, 0).
vvn(vvn2, 4, 9, 6, 2).
vvn(vvn3, 6, 23, 0, 4).
vvn(vvn4, 8, 14, 4, 5).
vvn(vvn5, 10, 15, 1, 2).
vvn(vvn6, 5, 13, 4, 6).
vvn(vvn7, 7, 12, 5, 3).

crane(crane1).
crane(crane2).
crane(crane3).

staff_window(s1, 0, 23).
staff_window(s1, 24, 47).
staff_window(s2, 0, 23).
staff_window(s2, 24, 47).
staff_window(s3, 0, 23).
staff_window(s3, 24, 47).

% instructions:
% ?- schedule_json('optimal').
% ?- schedule_json('edt').
%results: (old data)
%{ "ok": true, "algorithm": "auto", "delay": 6, "multiIntensity": 5, "computeTime": 207.81, "items": [
%{"vessel":"vessel1","start":0,"end":7,"cranes":["crane1"],"staffs":["s1"],"dock":"dock1"},
%{"vessel":"vessel2","start":8,"end":15,"cranes":["crane4"],"staffs":["s2"],"dock":"dock3"},
%{"vessel":"vessel3","start":10,"end":13,"cranes":["crane3"],"staffs":["s1"],"dock":"dock2"},
%{"vessel":"vessel4","start":12,"end":16,"cranes":["crane1","crane2"],"staffs":["s3","s6"],"dock":"dock1"}] }

% new results:
%{
%  "algorithm":"edt",
%  "computeTime":1,
%  "delay":17,
%  "items": [
%    {
%      "cranes": ["crane1", "crane2", "crane3" ],
%      "end":6,
%      "staffs": ["s1", "s2", "s3" ],
%      "start":4,
%      "vvn":"vvn2"
%    },
%    {
%      "cranes": ["crane1", "crane2", "crane3" ],
%      "end":9,
%      "staffs": ["s1", "s2", "s3" ],
%      "start":7,
%      "vvn":"vvn1"
%    },
%    {
%      "cranes": ["crane1", "crane2", "crane3" ],
%      "end":12,
%      "staffs": ["s1", "s2", "s3" ],
%      "start":10,
%      "vvn":"vvn7"
%    },
%    {
%      "cranes": ["crane1", "crane2", "crane3" ],
%      "end":16,
%      "staffs": ["s1", "s2", "s3" ],
%      "start":13,
%      "vvn":"vvn6"
%    },
%    {
%      "cranes": ["crane1", "crane2", "crane3" ],
%      "end":19,
%      "staffs": ["s1", "s2", "s3" ],
%      "start":17,
%      "vvn":"vvn4"
%    },
%    {
%      "cranes": ["crane1", "crane2", "crane3" ],
%      "end":20,
%      "staffs": ["s1", "s2", "s3" ],
%      "start":20,
%      "vvn":"vvn5"
%    },
%    {
%      "cranes": ["crane1", "crane2" ],
%      "end":22,
%      "staffs": ["s1", "s2" ],
%      "start":21,
%      "vvn":"vvn3"
%    }
%  ],
%  "ok":true
%}

%{
%  "algorithm":"optimal",
%  "computeTime":301,
%  "delay":5,
%  "items": [
%    {
%      "cranes": ["crane1", "crane2", "crane3" ],
%      "end":2,
%      "staffs": ["s1", "s2", "s3" ],
%      "start":0,
%      "vvn":"vvn1"
%    },
%    {
%      "cranes": ["crane1", "crane2", "crane3" ],
%      "end":6,
%      "staffs": ["s1", "s2", "s3" ],
%      "start":4,
%      "vvn":"vvn2"
%    },
%    {
%      "cranes": ["crane1", "crane2", "crane3" ],
%      "end":9,
%      "staffs": ["s1", "s2", "s3" ],
%      "start":7,
%      "vvn":"vvn7"
%    },
%    {
%      "cranes": ["crane1", "crane2", "crane3" ],
%      "end":12,
%      "staffs": ["s1", "s2", "s3" ],
%      "start":10,
%      "vvn":"vvn4"
%    },
%    {
%      "cranes": ["crane1", "crane2", "crane3" ],
%      "end":13,
%      "staffs": ["s1", "s2", "s3" ],
%      "start":13,
%      "vvn":"vvn5"
%    },
%    {
%      "cranes": ["crane1", "crane2", "crane3" ],
%      "end":17,
%      "staffs": ["s1", "s2", "s3" ],
%      "start":14,
%      "vvn":"vvn6"
%    },
%    {
%      "cranes": ["crane1", "crane2" ],
%      "end":19,
%      "staffs": ["s1", "s2" ],
%      "start":18,
%      "vvn":"vvn3"
%    }
%  ],
%  "ok":true
%}
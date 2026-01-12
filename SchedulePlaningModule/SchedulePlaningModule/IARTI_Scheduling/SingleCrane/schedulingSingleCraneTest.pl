% test_scheduling.pl
:- ['schedulingSingleCrane.pl'].  

vvn(vvn1, 0, 10, 8, 0).
vvn(vvn2, 4, 9, 6, 2).
vvn(vvn3, 6, 23, 0, 4).
vvn(vvn4, 8, 14, 4, 5).
vvn(vvn5, 10, 15, 1, 2).
vvn(vvn6, 5, 13, 4, 6).
vvn(vvn7, 7, 12, 5, 3).

crane(uniqueCrane).

staff_window(s1, 0, 23).
staff_window(s1, 24, 47).
staff_window(s2, 48, 71).
staff_window(s2, 72, 80).


% instructions:
% ?- schedule_json('optimal').
% ?- schedule_json('edt').

% results: (old data)

%{ "ok": true, "algorithm": "edt", "delay": 25, "computeTime": 0.00, "items": [
%{"vessel":"vessel1","start":0,"end":7,"crane":"crane1","staff":"s1","dock":"dock1"},
%{"vessel":"vessel2","start":24,"end":31,"crane":"crane3","staff":"s1","dock":"dock3"},
%{"vessel":"vessel5","start":8,"end":10,"crane":"crane3","staff":"s2","dock":"dock3"},
%{"vessel":"vessel4","start":12,"end":20,"crane":"crane1","staff":"s3","dock":"dock1"},
%{"vessel":"vessel3","start":10,"end":13,"crane":"crane2","staff":"s1","dock":"dock2"}] }

%{ "ok": true, "algorithm": "optimal", "delay": 11, "computeTime": 288.56, "items": [
%{"vessel":"vessel1","start":0,"end":7,"crane":"crane1","staff":"s1","dock":"dock1"},
%{"vessel":"vessel2","start":12,"end":19,"crane":"crane3","staff":"s3","dock":"dock3"},
%{"vessel":"vessel3","start":10,"end":13,"crane":"crane2","staff":"s1","dock":"dock2"},
%{"vessel":"vessel4","start":10,"end":18,"crane":"crane1","staff":"s6","dock":"dock1"},
%{"vessel":"vessel5","start":8,"end":10,"crane":"crane3","staff":"s2","dock":"dock3"}] },

% new results:
%{
%  "algorithm":"edt",
%  "computeTime":0,
%  "delay":191,
%  "items": [
%    {
%      "crane":"uniqueCrane",
%      "end":11,
%      "staff":"s1",
%      "start":4,
%      "vvn":"vvn2"
%    },
%    {
%      "crane":"uniqueCrane",
%      "end":19,
%      "staff":"s1",
%      "start":12,
%      "vvn":"vvn1"
%    },
%    {
%      "crane":"uniqueCrane",
%      "end":31,
%      "staff":"s1",
%      "start":24,
%      "vvn":"vvn7"
%    },
%    {
%      "crane":"uniqueCrane",
%      "end":41,
%      "staff":"s1",
%      "start":32,
%      "vvn":"vvn6"
%    },
%    {
%      "crane":"uniqueCrane",
%      "end":56,
%      "staff":"s2",
%      "start":48,
%      "vvn":"vvn4"
%    },
%    {
%      "crane":"uniqueCrane",
%      "end":59,
%      "staff":"s2",
%      "start":57,
%      "vvn":"vvn5"
%    },
%    {
%      "crane":"uniqueCrane",
%      "end":63,
%      "staff":"s2",
%      "start":60,
%      "vvn":"vvn3"
%    }
%  ],
%  "ok":true
%}

%{
%  "algorithm":"optimal",
%  "computeTime":1272,
%  "delay":103,
%  "items": [
%    {
%      "crane":"uniqueCrane",
%      "end":7,
%      "staff":"s1",
%      "start":0,
%      "vvn":"vvn1"
%    },
%    {
%      "crane":"uniqueCrane",
%      "end":15,
%      "staff":"s1",
%      "start":8,
%      "vvn":"vvn2"
%    },
%    {
%      "crane":"uniqueCrane",
%      "end":18,
%      "staff":"s1",
%      "start":16,
%      "vvn":"vvn5"
%    },
%    {
%      "crane":"uniqueCrane",
%      "end":22,
%      "staff":"s1",
%      "start":19,
%      "vvn":"vvn3"
%    },
%    {
%      "crane":"uniqueCrane",
%      "end":31,
%      "staff":"s1",
%      "start":24,
%      "vvn":"vvn7"
%    },
%    {
%      "crane":"uniqueCrane",
%      "end":40,
%      "staff":"s1",
%      "start":32,
%      "vvn":"vvn4"
%    },
%    {
%      "crane":"uniqueCrane",
%      "end":57,
%      "staff":"s2",
%      "start":48,
%      "vvn":"vvn6"
%    }
%  ],
%  "ok":true
%}

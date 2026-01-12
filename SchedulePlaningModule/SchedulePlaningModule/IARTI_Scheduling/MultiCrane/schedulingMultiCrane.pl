:- use_module(library(http/json)).

:- dynamic vvn/5.           % vvn(code, Arrival, DesiredDep, TUnload, TLoad)
:- dynamic crane/1.         % crane(CraneId)
:- dynamic staff_window/3.  % staff_window(Staff, Start, End)
:- dynamic shortest_delay/2.

%%%%%%%%%%%%%%%%%%%%% SEQUENCE TEMPORIZATION %%%%%%%%%%%%%%%%%%%%%

sequence_temporization(LV, Seq) :-
    sequence_temporization1(0, LV, Seq).

sequence_temporization1(_, [], []).

sequence_temporization1(PrevEnd,
                        [V|LV],
                        [(V, TStart, TEnd, CranesUsed, StaffsUsed)|Rest]) :-
    vvn(V, Arrival, _DesiredDep, TUnload, TLoad),
    BaseDuration is TUnload + TLoad,

    best_k_cranes(BaseDuration, K, Duration),

    TStart is max(Arrival, PrevEnd),
    TEnd is TStart + Duration - 1,

    cranes_used(K, CranesUsed),
    select_k_staffs(K, TStart, TEnd, StaffsUsed),

    NextPrevEnd is TEnd + 1,
    sequence_temporization1(NextPrevEnd, LV, Rest).


%%%%%%%%%%%%%%%%%%%%% RESOURCE SELECTION %%%%%%%%%%%%%%%%%%%%%

num_cranes(N) :-
    findall(C, crane(C), LC),
    length(LC, N).

duration_with_k_cranes(Base, K, Duration) :-
    Duration is ceiling(Base / K).

best_k_cranes(BaseDuration, BestK, BestDuration) :-
    num_cranes(MaxK),
    findall(
        Duration-K,
        ( between(1, MaxK, K),
          duration_with_k_cranes(BaseDuration, K, Duration)
        ),
        Pairs
    ),
    sort(Pairs, [BestDuration-BestK | _]).

cranes_used(K, Used) :-
    findall(C, crane(C), All),
    length(Used, K),
    append(Used, _, All).

staff_available(Staff, TStart, TEnd) :-
    staff_window(Staff, SStart, SEnd),
    SStart =< TStart,
    SEnd   >= TEnd.

available_staffs(TStart, TEnd, Staffs) :-
    findall(
        Staff,
        staff_available(Staff, TStart, TEnd),
        Staffs
    ).

select_k_staffs(K, TStart, TEnd, Selected) :-
    available_staffs(TStart, TEnd, Staffs),
    length(Staffs, N),
    N >= K,
    length(Selected, K),
    append(Selected, _, Staffs).

%%%%%%%%%%%%%%%%%%%%% DELAY CALCULATION %%%%%%%%%%%%%%%%%%%%%

sum_delays([], 0).

sum_delays([(V, _, TEnd, _, _) | Rest], Total) :-
    vvn(V, _, DesiredDeparture, _, _),
    PossibleDep is TEnd + 1,
    (PossibleDep > DesiredDeparture -> Delay is PossibleDep - DesiredDeparture ; Delay is 0),
    sum_delays(Rest, RestDelay),
    Total is Delay + RestDelay.

%%%%%%%%%%%%%%%%%%%%% OPTIMAL ALGORITHM (PERMUTATION) %%%%%%%%%%%%%%%%%%%%%

obtain_seq_shortest_delay(SeqBest, SBest) :-
    retractall(shortest_delay(_, _)),
    asserta(shortest_delay([], 1000000000)),
    findall(V, vvn(V, _, _, _, _), LV),
    LV \= [],
    (   permutation(LV, SeqV),
        sequence_temporization(SeqV, SeqTimed),
        sum_delays(SeqTimed, S),
        compare_shortest_delay(SeqTimed, S),
        fail
    ;   true
    ),
    shortest_delay(SeqBest, SBest).

compare_shortest_delay(SeqNew, SNew) :-
    shortest_delay(_, SLower),
    (   SNew < SLower
    ->  retract(shortest_delay(_, _)),
        asserta(shortest_delay(SeqNew, SNew))
    ;   true
    ).

%%%%%%%%%%%%%%%%%%%%% HEURISTIC: EARLY DEPARTURE TIME (EDT) %%%%%%%%%%%%%%%%%%%%%

heuristic_early_departure_time(SeqTriplets, SDelays) :-
    findall((DesiredDep, V), vvn(V, _, DesiredDep, _, _), LDV),
    sort(LDV, LDVSorted),
    obtain_visits(LDVSorted, SeqV),
    sequence_temporization(SeqV, SeqTriplets),
    sum_delays(SeqTriplets, SDelays), !.

obtain_visits([], []).
obtain_visits([(_,V)|Rest], [V|LV]) :-
    obtain_visits(Rest, LV).

%%%%%%%%%%%%%%%%%%%%% JSON PRINTER %%%%%%%%%%%%%%%%%%%%%

schedule_json(Algorithm) :-
    get_time(StartTime),
    (   call_algorithm(Algorithm, Seq, Delay),
        Seq \= [],
        Delay < 1000000000
    ->  get_time(EndTime),
        ComputeTimeMs is round((EndTime - StartTime) * 1000),
        items_to_json(Seq, JsonItems),
        Reply = _{
            ok: true,
            algorithm: Algorithm,
            delay: Delay,
            computeTime: ComputeTimeMs,
            items: JsonItems
        }
    ;   Reply = _{
            ok: false,
            reason: "no_feasible_schedule",
            algorithm: Algorithm
        }
    ),
    json_write_dict(current_output, Reply),
    nl.


call_algorithm('optimal', Seq, Delay) :-
    obtain_seq_shortest_delay(Seq, Delay).

call_algorithm('edt', Seq, Delay) :-
    heuristic_early_departure_time(Seq, Delay).

items_to_json([], []).
items_to_json([Item|Rest], [JsonItem|JsonRest]) :-
    item_to_json(Item, JsonItem),
    items_to_json(Rest, JsonRest).

item_to_json((V, Start, End, Cranes, Staffs),
    _{
        vvn: V,
        start: Start,
        end: End,
        cranes: Cranes,
        staffs: Staffs
    }).

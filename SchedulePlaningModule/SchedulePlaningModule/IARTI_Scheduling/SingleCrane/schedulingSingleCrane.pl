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
                        [(V, TStart, TEnd, Crane, Staff)|Rest]) :-
    vvn(V, Arrival, _DesiredDep, TUnload, TLoad),
    Duration is TUnload + TLoad,
    Earliest is max(Arrival, PrevEnd),
    choose_start_and_resources(Earliest, Duration, TStart, TEnd, Crane, Staff),
    NextPrevEnd is TEnd + 1,
    sequence_temporization1(NextPrevEnd, LV, Rest).

%%%%%%%%%%%%%%%%%%%%% RESOURCE SELECTION %%%%%%%%%%%%%%%%%%%%%

choose_start_and_resources(TStart0, Duration, TStart, TEnd, Crane, Staff) :-
    once((
        crane(Crane),
        staff_window(Staff, SStart, SEnd),
        TmpStart is max(TStart0, SStart),
        TmpEnd is TmpStart + Duration - 1,
        TmpEnd =< SEnd,
        TStart = TmpStart,
        TEnd = TmpEnd
    )).

%%%%%%%%%%%%%%%%%%%%% DELAY CALCULATION %%%%%%%%%%%%%%%%%%%%%

sum_delays([], 0).

sum_delays([(V, _, TEnd, _, _) | Rest], Total) :-
    vvn(V, _, DesiredDeparture, _, _),
    PossibleDep is TEnd + 1,
    (PossibleDep > DesiredDeparture -> Delay is PossibleDep - DesiredDeparture ; Delay is 0),
    sum_delays(Rest, RestDelay),
    Total is Delay + RestDelay.

%%%%%%%%%%%%%%%%%%%%% CONFLICTS %%%%%%%%%%%%%%%%%%%%%

overlapping(T1S, T1E, T2S, T2E) :-
    T1S =< T2E, T2S =< T1E.

resource_conflict((_, S1, E1, _, _), (_, S2, E2, _, _)) :-
    overlapping(S1, E1, S2, E2).

resource_conflict((_, S1, E1, Crane, _), (_, S2, E2, Crane, _)) :-
    overlapping(S1, E1, S2, E2).

resource_conflict((_, S1, E1, _, Staff), (_, S2, E2, _, Staff)) :-
    overlapping(S1, E1, S2, E2).

valid_sequence([]).
valid_sequence([_]).
valid_sequence([Item | Rest]) :-
    \+ (member(Other, Rest), resource_conflict(Item, Other)),
    valid_sequence(Rest).

%%%%%%%%%%%%%%%%%%%%% OPTIMAL ALGORITHM (PERMUTATION) %%%%%%%%%%%%%%%%%%%%%

obtain_seq_shortest_delay(SeqBest, SBest) :-
    retractall(shortest_delay(_, _)),
    asserta(shortest_delay([], 1000000000)),
    findall(V, vvn(V, _, _, _, _), LV),
    LV \= [],
    (   permutation(LV, SeqV),
        sequence_temporization(SeqV, SeqTimed),
        valid_sequence(SeqTimed),
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
    valid_sequence(SeqTriplets),
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

item_to_json((V, Start, End, Crane, Staff),
    _{
        vvn: V,
        start: Start,
        end: End,
        crane: Crane,
        staff: Staff
    }).
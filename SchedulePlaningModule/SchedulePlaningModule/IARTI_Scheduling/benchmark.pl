% benchmark.pl (SWI-Prolog)
:- use_module(library(lists)).
:- use_module(library(apply)).
:- use_module(library(random)).

:- consult('scheduling.pl').
:- consult('schedulingGeneticAlg.pl').

now_ms(MS) :- statistics(walltime, [MS, _]).


min_list_num([H|T], Min) :- foldl(min_, T, H, Min).
max_list_num([H|T], Max) :- foldl(max_, T, H, Max).
avg_list_num(L, Avg) :-
    sum_list(L, S),
    length(L, N),
    ( N =:= 0 -> Avg is 0 ; Avg is S / N ).

min_(X, Acc, Out) :- Out is min(X, Acc).
max_(X, Acc, Out) :- Out is max(X, Acc).


reset_scheduling_facts :-
    retractall(vessel(_,_,_,_,_,_)),
    retractall(dock_crane(_,_)),
    retractall(staff_window(_,_,_)),
    retractall(shortest_delay(_, _)),
    % GA facts
    retractall(visit(_,_,_,_,_)),
    retractall(visits(_)),
    retractall(generations(_)),
    retractall(population(_)),
    retractall(prob_crossover(_)),
    retractall(prob_mutation(_)).

assert_basic_resources :-
    Dock = d1,
    asserta(dock_crane(Dock, c1)),
    asserta(staff_window(s1, 0, 100000)),
    asserta(staff_window(s2, 0, 100000)).

assert_ga_params :-
    asserta(population(40)),
    asserta(generations(60)),
    asserta(prob_crossover(0.7)),
    asserta(prob_mutation(0.2)).

generate_instance(N) :-
    reset_scheduling_facts,
    assert_basic_resources,
    assert_ga_params,
    Seed is 12345 + N,
    set_random(seed(Seed)),
    generate_chain_vessels_and_visits(1, N, 0),
    asserta(visits(N)).


generate_chain_vessels_and_visits(I, N, CurrentTime) :-
    ( I > N -> true
    ;   format(atom(VCode), 'v~w', [I]),
        Dock = d1,

        random_between(5, 15, TUnload),
        random_between(5, 15, TLoad),
        Dur is TUnload + TLoad,

        Arrival is CurrentTime,

        random_between(-20, 10, Slack),
        Desired0 is Arrival + Dur + Slack,
        Desired is max(Arrival + 1, Desired0),


        asserta(vessel(VCode, Arrival, Desired, TUnload, TLoad, Dock)),

        asserta(visit(I, Dur, Arrival, Desired, 1)),

        Gap = 0,
        NextTime is Arrival + Dur + Gap,

        I1 is I + 1,
        generate_chain_vessels_and_visits(I1, N, NextTime)
    ).

% ---------------- Run algorithms ----------------
run_algo(optimal, Delay) :-
    obtain_seq_shortest_delay(_Seq, Delay).

run_algo(edt, Delay) :-
    heuristic_early_departure_time(_Seq, Delay).

run_algo(genetic, Delay) :-
    generate_population(Pop),
    evaluate_population(Pop, PopValue),
    order_population(PopValue, PopOrd),
    generations(NG),
    generate_generation(0, NG, PopOrd, FinalPop),
    FinalPop = [_BestSeq*BestVal|_],
    Delay is BestVal.

% ---------------- Run many times ----------------
no_feasible_value(1000000000).

run_many(_Algo, 0, [], []) :- !.
run_many(Algo, Runs, [Tms|TRest], [D|DRest]) :-
    Runs > 0,
    now_ms(T0),
    (   catch(run_algo(Algo, D0), _E, fail)
    ->  D = D0
    ;   no_feasible_value(D)
    ),
    now_ms(T1),
    Tms is T1 - T0,
    Runs1 is Runs - 1,
    run_many(Algo, Runs1, TRest, DRest).

stats_from_lists(Times, Delays,
                 Tmin, Tavg, Tmax,
                 Dmin, Davg, Dmax) :-
    min_list_num(Times, Tmin),
    max_list_num(Times, Tmax),
    avg_list_num(Times, Tavg),
    min_list_num(Delays, Dmin),
    max_list_num(Delays, Dmax),
    avg_list_num(Delays, Davg).

% ---------------- CSV ----------------
write_csv_header(S) :-
    format(S,
           "n_vessels, algorithm, time_min_ms, time_avg_ms, time_max_ms, delay_min, delay_avg, delay_max~n", []).

write_csv_row(S, N, Algo, Tmin, Tavg, Tmax, Dmin, Davg, Dmax) :-
    format(S,
           "~w, ~w, ~2f, ~2f, ~2f, ~2f, ~2f, ~2f~n",
           [N, Algo, Tmin, Tavg, Tmax, Dmin, Davg, Dmax]).

% ---------------- Main ----------------
run_benchmark(Ns, Runs, OutCsv) :-
    open(OutCsv, write, S),
    write_csv_header(S),
    forall(member(N, Ns),
           (   format("== N=~w ==~n", [N]),
               generate_instance(N),

               run_many(optimal, Runs, Topt, Dopt),
               stats_from_lists(Topt, Dopt, TminO, TavgO, TmaxO, DminO, DavgO, DmaxO),
               write_csv_row(S, N, optimal, TminO, TavgO, TmaxO, DminO, DavgO, DmaxO),

               run_many(edt, Runs, Tedt, Dedt),
               stats_from_lists(Tedt, Dedt, TminE, TavgE, TmaxE, DminE, DavgE, DmaxE),
               write_csv_row(S, N, edt, TminE, TavgE, TmaxE, DminE, DavgE, DmaxE),

               run_many(genetic, Runs, Tga, Dga),
               stats_from_lists(Tga, Dga, TminG, TavgG, TmaxG, DminG, DavgG, DmaxG),
               write_csv_row(S, N, genetic, TminG, TavgG, TmaxG, DminG, DavgG, DmaxG)
           )),
    close(S),
    format("Done. CSV written to ~w~n", [OutCsv]).


% RUN: swipl -q -l benchmark.pl -g "run_benchmark([5,6,7,8],3,'results.csv'),halt."

% Results:
% n_vessels, algorithm, time_min_ms, time_avg_ms, time_max_ms, delay_min, delay_avg, delay_max
% 5, optimal, 32.00, 33.33, 35.00, 18.00, 18.00, 18.00
% 5, edt, 0.00, 0.00, 0.00, 18.00, 18.00, 18.00
% 5, genetic, 59.00, 108.67, 207.00, 18.00, 18.00, 18.00
% 6, optimal, 551.00, 576.33, 596.00, 15.00, 15.00, 15.00
% 6, edt, 0.00, 0.00, 0.00, 15.00, 15.00, 15.00
% 6, genetic, 29.00, 31.00, 32.00, 15.00, 41.00, 54.00
% 7, optimal, 9188.00, 9472.00, 9722.00, 68.00, 68.00, 68.00
% 7, edt, 0.00, 0.00, 0.00, 68.00, 68.00, 68.00
% 7, genetic, 29.00, 29.67, 30.00, 68.00, 92.33, 141.00
% 8, optimal, 183546.00, 187171.67, 190737.00, 66.00, 66.00, 66.00
% 8, edt, 0.00, 0.00, 0.00, 66.00, 66.00, 66.00
% 8, genetic, 31.00, 32.00, 33.00, 66.00, 154.00, 200.00

% The benchmark results show that the optimal scheduling algorithm exhibits factorial growth,
% becoming impractical for problem sizes above 6 vessels. Although the EDT heuristic
% and the Genetic Algorithm present similar delay values under the current scheduling model,
% their execution times remain stable and significantly lower. Based on these results,
% an automatic algorithm selection strategy was defined to ensure system responsiveness
% while preserving solution quality whenever possible.
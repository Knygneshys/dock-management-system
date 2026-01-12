:- use_module(library(http/json)).

:-dynamic generations/1.
:-dynamic population/1.
:-dynamic prob_crossover/1.
:-dynamic prob_mutation/1.
:-dynamic visit/5. % visit(Id,ProcessTime,FromTime,DueTime,PenaltyWeight).
:-dynamic visits/1.

:- dynamic crane/1.         % crane(CraneId)
:- dynamic staff_window/3.  % staff_window(Staff, Start, End)

%%%%%% RESOURCE VERIFICATION %%%%%%

resources_available :-
    crane(_),
    staff_window(_, _, _).

%%%%%% INITIAL POPULATION %%%%%%

generate :-
    (   resources_available
    ->  generate_ok
    ;   print_no_resources_json
    ).

generate_ok:-
    get_time(StartTime),
    generate_population(Pop),
    evaluate_population(Pop,PopValue),
    order_population(PopValue,PopOrd),
    generations(NG),
    generate_generation(0,NG,PopOrd,FinalPop),
    FinalPop = [BestSeq*BestVal|_],
    (   calculate_schedule(BestSeq, Schedule)
    ->  get_time(EndTime),
        ComputeTimeMs is round((EndTime - StartTime) * 1000),
        print_json_result(BestSeq, BestVal, Schedule, ComputeTimeMs)
    ;   print_no_resources_json
    ).

calculate_schedule(Seq, Schedule):-
    calculate_schedule(Seq, 0, [], RevSchedule),
    reverse(RevSchedule, Schedule).

calculate_schedule([], _, Schedule, Schedule).

calculate_schedule([T|Rest], PrevEnd, Acc, Schedule):-
    visit(T, Dur, From, Due, Pen),

    Earliest is max(PrevEnd, From),

    choose_start_and_resources(
        Earliest,
        Dur,
        StartTime,
        EndTime,
        Crane,
        Staff
    ),

    Delay is max(0, EndTime - Due),
    Penalty is Delay * Pen,
    NextPrevEnd is EndTime + 1,

    calculate_schedule(
        Rest,
        NextPrevEnd,
        [ visit(T, StartTime, EndTime, Due, Delay, Penalty, Crane, Staff)
        | Acc ],
        Schedule
    ).


generate_population(Pop):-
    population(PopSize),
    visits(NumT),
    findall(Visit,visit(Visit,_,_,_,_),VisitsList),
    generate_population(PopSize,VisitsList,NumT,Pop).

generate_population(0,_,_,[]):-!.
generate_population(PopSize,VisitsList,NumT,[Ind|Rest]):-
    PopSize1 is PopSize-1,
    generate_population(PopSize1,VisitsList,NumT,Rest),
    generate_individual(VisitsList,NumT,Ind),
    not(member(Ind,Rest)).
generate_population(PopSize,VisitsList,NumT,L):-
    generate_population(PopSize,VisitsList,NumT,L).
    


generate_individual([G],1,[G]):-!.

generate_individual(VisitsList,NumT,[G|Rest]):-
    NumTemp is NumT + 1, % to use with random
    random(1,NumTemp,N),
    remove(N,VisitsList,G,NewList),
    NumT1 is NumT-1,
    generate_individual(NewList,NumT1,Rest).

remove(1,[G|Rest],G,Rest).
remove(N,[G1|Rest],G,[G1|Rest1]):- N1 is N-1,
            remove(N1,Rest,G,Rest1).

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

%%%%%% JSON PRINTER %%%%%%

schedule_to_json([], []).
schedule_to_json(
    [visit(Id, Start, Finish, Due, Delay, Penalty, Crane, Staff)|Rest],
    [ json([
        visit=Id,
        start=Start,
        finish=Finish,
        due=Due,
        delay=Delay,
        penalty=Penalty,
        crane=Crane,
        staff=Staff
      ])
    | RestJson]
) :-
    schedule_to_json(Rest, RestJson).

print_json_result(BestSeq, BestVal, Schedule, ComputeTime) :-
    schedule_to_json(Schedule, ScheduleJson),
    Result = json([
        best_sequence = BestSeq,
        total_delay_cost = BestVal,
        schedule = ScheduleJson,
        computeTime = ComputeTime
    ]),
    json_write_dict(current_output, Result, [width(128)]).

print_no_resources_json :-
    Reply = json([
        ok = false,
        reason = "no_feasible_schedule"
    ]),
    json_write_dict(current_output, Reply),
    nl.

%%%%%% EVALUATION/FITNESS FUNCTION %%%%%%

evaluate_population([],[]).
evaluate_population([Ind|Rest],[Ind*V|Rest1]):-
    evaluate(Ind,V),
    evaluate_population(Rest,Rest1).

evaluate(Seq,V):- evaluate(Seq,0,V).

evaluate([ ],_,0).
evaluate([T|Rest],CurrentTime,V):-
    visit(T,Dur,From,Due,Pen),
    StartTime is max(CurrentTime,From),
    FinInst is StartTime + Dur - 1,
    NextTime is FinInst + 1,
    evaluate(Rest,NextTime,VRest),
    ( FinInst =< Due
      -> VT is 0
      ;  VT is (FinInst - Due) * Pen
    ),
    V is VT + VRest.

%%%%%% SELECTION %%%%%%

order_population(PopValue,PopValueOrd):-
    bsort(PopValue,PopValueOrd).

bsort([X],[X]):-!.
bsort([X|Xs],Ys):-
    bsort(Xs,Zs),
    bchange([X|Zs],Ys).


bchange([X],[X]):-!.

bchange([X*VX,Y*VY|L1],[Y*VY|L2]):-
    VX>VY,!,
    bchange([X*VX|L1],L2).

bchange([X|L1],[X|L2]):-bchange(L1,L2).
    
%%%%%% MAIN %%%%%%

generate_generation(G,G,Pop,Pop):-!.
generate_generation(N,G,Pop, FinalPop):-
	crossover(Pop,NPop1),
	mutation(NPop1,NPop),
	evaluate_population(NPop,NPopValue),
	order_population(NPopValue,NPopOrd),
	N1 is N+1,
	generate_generation(N1,G,NPopOrd, FinalPop).

%%%%%% CROSSOVER %%%%%%

generate_crossover_points(P1,P2):- generate_crossover_points1(P1,P2).

generate_crossover_points1(P1,P2):-
	visits(N),
	NTemp is N+1,
	random(1,NTemp,P11),
	random(1,NTemp,P21),
	P11\==P21,!,
	((P11<P21,!,P1=P11,P2=P21);P1=P21,P2=P11).
generate_crossover_points1(P1,P2):-
	generate_crossover_points1(P1,P2).


crossover([Elite*_|Rest], [Elite|NewRest]):-
    crossover_rest(Rest, NewRest).

crossover_rest([], []).
crossover_rest([Ind*_], [Ind]).
crossover_rest([Ind1*_,Ind2*_|Rest],[NInd1,NInd2|Rest1]):-
    generate_crossover_points(P1,P2),
    prob_crossover(Pcruz),random(0.0,1.0,Pc),
    ((Pc =< Pcruz,!,
        cross(Ind1,Ind2,P1,P2,NInd1),
        cross(Ind2,Ind1,P1,P2,NInd2))
    ;
    (NInd1=Ind1,NInd2=Ind2)),
    crossover_rest(Rest,Rest1).

fillh([ ],[ ]).

fillh([_|R1],[h|R2]):-
	fillh(R1,R2).

sublist(L1,I1,I2,L):-I1 < I2,!,
    sublist1(L1,I1,I2,L).

sublist(L1,I1,I2,L):-sublist1(L1,I2,I1,L).

sublist1([X|R1],1,1,[X|H]):-!, fillh(R1,H).

sublist1([X|R1],1,N2,[X|R2]):-!,N3 is N2 - 1,
	sublist1(R1,1,N3,R2).

sublist1([_|R1],N1,N2,[h|R2]):-N3 is N1 - 1,
		N4 is N2 - 1,
		sublist1(R1,N3,N4,R2).

rotate_right(L,K,L1):- visits(N),
	T is N - K,
	rr(T,L,L1).

rr(0,L,L):-!.

rr(N,[X|R],R2):- N1 is N - 1,
	append(R,[X],R1),
	rr(N1,R1,R2).

remove([],_,[]):-!.

remove([X|R1],L,[X|R2]):- not(member(X,L)),!,
        remove(R1,L,R2).

remove([_|R1],L,R2):-
    remove(R1,L,R2).

insert([],L,_,L):-!.
insert([X|R],L,N,L2):-
    visits(T),
    ((N>T,!,N1 is N mod T);N1 = N),
    insert1(X,N1,L,L1),
    N2 is N + 1,
    insert(R,L1,N2,L2).


insert1(X,1,L,[X|L]):-!.
insert1(X,N,[Y|L],[Y|L1]):-
    N1 is N-1,
    insert1(X,N1,L,L1).

cross(Ind1,Ind2,P1,P2,NInd11):-
    sublist(Ind1,P1,P2,Sub1),
    visits(NumT),
    R is NumT-P2,
    rotate_right(Ind2,R,Ind21),
    remove(Ind21,Sub1,Sub2),
    P3 is P2 + 1,
    insert(Sub2,Sub1,P3,NInd1),
    removeh(NInd1,NInd11).


removeh([],[]).

removeh([h|R1],R2):-!,
    removeh(R1,R2).

removeh([X|R1],[X|R2]):-
    removeh(R1,R2).


%%%%%% MUTATION %%%%%%

mutation([Elite|Rest], [Elite|NewRest]):- 
    mutation_rest(Rest, NewRest).

mutation_rest([], []).
mutation_rest([Ind|Rest],[NInd|Rest1]):-
    prob_mutation(Pmut),
    random(0.0,1.0,Pm),
    ((Pm < Pmut,!,mutacao1(Ind,NInd));NInd = Ind),
    mutation_rest(Rest,Rest1).

mutacao1(Ind,NInd):-
	generate_crossover_points(P1,P2),
	mutacao22(Ind,P1,P2,NInd).

mutacao22([G1|Ind],1,P2,[G2|NInd]):-
	!, P21 is P2-1,
	mutacao23(G1,P21,Ind,G2,NInd).
mutacao22([G|Ind],P1,P2,[G|NInd]):-
	P11 is P1-1, P21 is P2-1,
	mutacao22(Ind,P11,P21,NInd).

mutacao23(G1,1,[G2|Ind],G2,[G1|Ind]):-!.
mutacao23(G1,P,[G|Ind],G2,[G|NInd]):-
	P1 is P-1,
	mutacao23(G1,P1,Ind,G2,NInd).

:- include('scheduling.pl').
:- include('schedulingMultiCrane.pl').

:- dynamic vessel/6.
:- dynamic dock/2.
:- dynamic dock_assignment/3.

sort_vessels_by_arrival(SortedVessels) :-
    findall((Arrival, V), vessel(V, Arrival, _, _, _, _), VesselsWithArrival),
    sort(VesselsWithArrival, Sorted),
    extract_vessel_codes(Sorted, SortedVessels).

extract_vessel_codes([], []).
extract_vessel_codes([(_, V)|Rest], [V|VRest]) :-
    extract_vessel_codes(Rest, VRest).
    
initialize_dock_assignments([], []).
initialize_dock_assignments([(DockCode, NumCranes)|RestDocks], 
                            [(DockCode, [], 0, NumCranes)|RestAssignments]) :-
    initialize_dock_assignments(RestDocks, RestAssignments).
    
    
assign_vessels_greedy([], Assignments, Assignments).

assign_vessels_greedy([V|RestVessels], CurrentAssignments, FinalAssignments) :-
    vessel(V, _, _, TUnload, TLoad, _),
    WorkTime is TUnload + TLoad,
    find_least_loaded_dock(CurrentAssignments, ChosenDock, NumCranes),
    add_vessel_to_dock(V, WorkTime, ChosenDock, NumCranes, CurrentAssignments, UpdatedAssignments),
    assign_vessels_greedy(RestVessels, UpdatedAssignments, FinalAssignments).
    
find_least_loaded_dock(Assignments, ChosenDock, NumCranes) :-
    find_min_load(Assignments, MinLoad),
    member((ChosenDock, _, MinLoad, NumCranes), Assignments).

find_min_load([(_, _, Load, _)], Load).
find_min_load([(_, _, Load, _)|Rest], MinLoad) :-
    find_min_load(Rest, RestMin),
    MinLoad is min(Load, RestMin).
    
add_vessel_to_dock(V, WorkTime, ChosenDock, NumCranes, CurrentAssignments, UpdatedAssignments) :-
    select((ChosenDock, VesselList, OldLoad, NumCranes), CurrentAssignments, RestAssignments),
    NewLoad is OldLoad + (WorkTime / NumCranes),
    UpdatedAssignments = [(ChosenDock, [V|VesselList], NewLoad, NumCranes)|RestAssignments].
    
rebalance_vessels(AllDocks, FinalAssignments) :-
    sort_vessels_by_arrival(SortedVessels),
    initialize_dock_assignments(AllDocks, InitialAssignments),
    assign_vessels_greedy(SortedVessels, InitialAssignments, FinalAssignments).
    
    
schedule_all_docks([], []).
schedule_all_docks([(DockCode, Vessels, _, NumCranes)|RestDocks], 
                   [(DockCode, Schedule, Delay)|RestSchedules]) :-
    setup_vessels_for_dock(Vessels, DockCode),
    choose_and_run_algorithm(NumCranes, Schedule, Delay),
    cleanup_vessels,
    schedule_all_docks(RestDocks, RestSchedules).

choose_and_run_algorithm(1, Schedule, Delay) :-
    % Single crane - use scheduling.pl
    call_algorithm('edt', Schedule, Delay).

choose_and_run_algorithm(NumCranes, Schedule, Delay) :-
    NumCranes > 1,
    % Multi-crane - use schedulingMultiCrane.pl in auto mode
    call_algorithm('auto', Schedule, Delay, _Intensity).
    
    
setup_vessels_for_dock([], _).
setup_vessels_for_dock([V|Rest], DockCode) :-
    vessel(V, Arrival, DesiredDep, TUnload, TLoad, _OriginalDock),
    assertz(vessel(V, Arrival, DesiredDep, TUnload, TLoad, DockCode)),
    setup_vessels_for_dock(Rest, DockCode).

cleanup_vessels :-
    retractall(vessel(_, _, _, _, _, _)).
    
    
rebalance_and_schedule_all(AllDocks, CompleteSchedule, TotalDelay) :-
    rebalance_vessels(AllDocks, Assignments),
    schedule_all_docks(Assignments, CompleteSchedule),
    calculate_total_delay(CompleteSchedule, TotalDelay).

calculate_total_delay([], 0).
calculate_total_delay([(_, _, Delay)|Rest], Total) :-
    calculate_total_delay(Rest, RestTotal),
    Total is Delay + RestTotal.
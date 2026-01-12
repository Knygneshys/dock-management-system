% Test vessels
vessel(ship1, 0, 15, 5, 3, unassigned).
vessel(ship2, 2, 20, 4, 4, unassigned).
vessel(ship3, 5, 25, 6, 2, unassigned).
vessel(ship4, 8, 30, 3, 3, unassigned).

% Test docks with crane availability windows
dock(dock_a, 1).
dock(dock_b, 2).

dock_crane_window(dock_a, crane1, 0, 100).
dock_crane_window(dock_b, crane2, 0, 100).
dock_crane_window(dock_b, crane3, 0, 100).

% Staff availability
staff_window(staff1, 0, 100).
staff_window(staff2, 0, 100).
staff_window(staff3, 0, 100).
# US227 – Approve or Reject Vessel Visit Notifications

## 1. User Story Description
As a **Port Authority Officer**, I want to **review pending Vessel Visit Notifications** and either **approve or reject them**, so that docking schedules remain under port control.

**Acceptance Criteria:**
- When a notification is approved, the officer must assign a temporary dock where the vessel should berth.
- When a notification is rejected, the officer must provide a reason for rejection.
- Rejected notifications can be reviewed and updated by the shipping agent for a new decision.
- All decisions (approve/reject) must be logged with timestamp, officer ID, and decision outcome.

---

## 2. System Overview
This functionality allows port officers to manage the status of `VesselVisitNotification` entities by approving or rejecting them.  
Approving a notification triggers dock assignment and vessel scheduling; rejecting it records feedback and sets the notification status accordingly.

---

## 3. Architecture

The main components involved are:
- **VesselVisitNotificationsController**
    - Exposes endpoints to approve and reject notifications.
    - Handles status updates and coordinates the services/repositories.
- **VVNRepository**
    - Retrieves and updates `VesselVisitNotification` entities.
- **FeedbackRepository**
    - Logs officer decisions (timestamp, officer, reason, outcome).
- **DockAvailabilityService**
    - Finds and assigns available docks upon approval.
- **DockRecordRepository**
    - Manages the dock allocation records.
- **VesselVisitRepository**
    - Persists approved vessel visits in the port scheduling system.

---

## 4. UML – Class Diagram

![VVNApproval Class Diagram](docs/Layer4/US227/classDiagram/Us227svg.svg)

---

## 5. Sequence Diagram

```mermaid
sequenceDiagram
    title US227 – Approve or Reject Vessel Visit Notification

    actor Officer as "Port Authority Officer"
    participant Controller as "VVN Controller"
    participant DockService as "Dock Availability Service"
    participant Repositories as "VVN / Feedback / Schedule Repos"
    participant DB as "Database"

    Officer->>Controller: PUT /ApproveVVN or /RejectVVN\n(VVNFeedbackDTO)
    Controller->>Controller: Verify authorization (PortAuthorityOffice)
    Controller->>Repositories: GetByCodeAsync(code)
    alt VVN not found
        Controller-->>Officer: 404 Not Found
    else VVN found and status valid
        alt Approve Request
            Controller->>DockService: FindAvailableDockAsync()
            DockService-->>Controller: Dock or null
            alt Dock available
                Controller->>Repositories: Create VesselVisit + Schedule
                Controller->>Repositories: CreateFeedback(Type = Approved)
                Controller-->>Officer: 200 OK (VVN Approved)
            else No dock available
                Controller-->>Officer: 400 Bad Request
            end
        else Reject Request
            Controller->>Repositories: CreateFeedback(Type = Rejected)
            Controller-->>Officer: 200 OK (VVN Rejected)
        end
    end


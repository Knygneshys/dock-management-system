# US2210 – View and Filter Vessel Visit Notifications

## 1. User Story Description
As a **Shipping Agent Representative**, I want to **view the status of all my submitted Vessel Visit Notifications (VVNs)** — including those in progress, pending, approved with dock assignments, or rejected with reasons — so that I am always informed about the Port Authority’s decisions.

**Acceptance Criteria:**
- The Shipping Agent Representative may also view VVNs submitted by other representatives from the same shipping agent company.
- VVNs must be searchable and filterable by vessel, status, representative, and time.

---

## 2. System Overview
This functionality allows authorized **Shipping Agent Representatives** to view the status of their Vessel Visit Notifications and monitor their progress within the port management workflow.  
Through the provided endpoint, users can query VVNs with filters such as vessel IMO, representative, time interval, and status.

---

## 3. Architecture

**Main Components:**
- **VesselVisitNotificationsController**
    - Handles requests for fetching filtered Vessel Visit Notifications.
- **VVNService**
    - Implements the filtering logic for VVNs based on user and company context.
- **VVNRepository**
    - Executes data access and filtering queries at the persistence layer.
- **VesselVisitNotification**
    - Domain entity representing a vessel visit notification, including its status and related details.

---

## 4. UML – Class Diagram


![VVNFilter Class Diagram](docs/Layer4/US2210/ClassDiagram/US2210cd.svg)

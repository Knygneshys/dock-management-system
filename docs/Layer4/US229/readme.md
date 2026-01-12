# **US229 – VVN Edition/Completion**

## 1. User Story Description
As a **Shipping Agent Representative**, I want to **change or complete a Vessel Visit Notification (VVN)** while it is still *in progress*, so that I can correct errors or withdraw requests if necessary.

**Acceptance Criteria:**
- The VVN status can remain **“in progress”** or be changed to **“submitted / approval pending.”**  
- Representatives can modify VVN details only while the status is *in progress.*  
- Once submitted, the VVN becomes read-only until reviewed by a Port Authority Officer.  
- Withdrawal or resubmission actions must be logged with timestamps and user information.

---

## 2. System Overview
This functionality enables shipping agents to update or finalize `VesselVisitNotification` entities that have not yet been approved.  
It allows corrections, partial updates, and controlled submission of requests, ensuring data accuracy before port review.  
Once a VVN is marked as *submitted*, it transitions to the approval workflow managed by port officers.

---

## 3. Architecture
The main components involved are:
- **VesselVisitNotificationsController**  
  - Exposes endpoints to update or submit VVNs.  
  - Restricts edits to VVNs with status “in progress.”  
  - Handles status transitions and authorization checks.
- **VVNRepository**  
  - Retrieves and updates VVN records in the database.  
  - Ensures status integrity during updates.
- **VesselVisitNotification Entity**  
  - Represents the core model for vessel visit requests, including status, vessel, dock, and scheduling details.
- **VVNDto**  
  - Defines the structure for update and submission payloads exchanged through the API.

---

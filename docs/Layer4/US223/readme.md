# **US223 – Dock Registry and Update**

## 1. User Story Description
As a **Port Authority Officer**, I want to **register and update docks**, so that the system accurately reflects the docking capacity of the port.

**Acceptance Criteria:**
- A dock record must include a unique identifier, name, location, and physical characteristics (length, depth, max draft).  
- The officer must specify which vessel types are allowed to berth there.  
- Docks must be searchable and filterable by name, vessel type, and location.

---

## 2. System Overview
This functionality allows port officers to create and update `DockRecord` entities representing physical docking areas.  
It ensures accurate capacity management by linking docks to compatible vessel types and enabling search and filtering functions for efficient planning.

---

## 3. Architecture
The main components involved are:
- **DockRecordController**  
  - Exposes endpoints to create, update, and search docks.  
  - Handles authorization and coordinates repository/service calls.
- **DockRecordRepository**  
  - Performs database operations for creating, updating, and retrieving dock records.  
  - Ensures code uniqueness and manages vessel type assignments.
- **DockRecordService**  
  - Implements search logic for filtering docks by name, vessel type, or location.
- **DockRecord Entity**  
  - Represents dock data in the domain model, including physical dimensions and allowed vessel types.
- **DockRecordCreationDto**  
  - Defines the data structure for dock creation and update requests.

---

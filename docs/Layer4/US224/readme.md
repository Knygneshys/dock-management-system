# **US224 – Storage Areas Registry and Update**

## 1. User Story Description
As a **Port Authority Officer**, I want to **register and update storage areas**, so that (un)loading and storage operations can be assigned to the correct locations.

**Acceptance Criteria:**
- Each storage area must have a unique identifier, type (e.g., yard, warehouse), and location within the port.  
- Storage areas must specify maximum capacity (in TEUs) and current occupancy.  
- By default, a storage area serves the entire port (all docks).  
- Some storage areas (e.g., yards) may be limited to specific docks, usually the nearest ones.  
- The distance between docks and storage areas must be manually recorded for logistics planning.  
- Updates must not allow the current occupancy to exceed the maximum capacity.

---

## 2. System Overview
This functionality enables port officers to manage `StorageArea` entities that represent physical storage zones in the port.  
When a storage area is created, it is automatically linked to all docks by default, while officers can later specify restricted connections.  
Distances between docks and storage areas are manually registered to support optimization and planning for loading operations.

---

## 3. Architecture
The main components involved are:
- **StorageAreasController**  
  - Exposes endpoints to create and update storage areas.  
  - Validates capacity limits and assigns default dock links if none are provided.  
  - Automatically generates `DockStorageDistance` records upon creation.
- **DockStorageDistanceController**  
  - Manages manual creation and updates of distances between docks and storage areas.  
  - Ensures referential integrity and authorization checks.
- **StorageAreaRepository**  
  - Handles persistence for storage areas (create, update, find, and query operations).  
  - Uses EF Core for data access.
- **DockStorageDistanceRepository**  
  - Stores and retrieves relationships between docks and storage areas, including distance metrics.  
  - Includes dock and storage area references via EF Core `Include` statements.
- **StorageAreaDto**  
  - Defines input/output structure for storage area data (code, type, location, capacity, occupancy).
- **DockStorageDistanceDto**  
  - Defines the data model for distance entries between docks and storage areas.

---

# US2212 – Register and Manage Physical Resources

## 1. User Story Description
As a **Logistics Operator**, I want to **register and manage physical resources** (create, update, deactivate), so that they can be accurately considered during planning and scheduling operations.

**Acceptance Criteria:**

- Resources include cranes (fixed and mobile), trucks, and other equipment directly involved in vessel and yard operations.
- Each resource must have a unique alphanumeric code and a description.
- Each resource must store its operational capacity, which varies according to the type of resource, and, if applicable, the assigned area (e.g., Dock A, Yard B).
- Additional properties must include:
    - Current availability status (active, inactive, under maintenance).
    - Setup time (in minutes), if relevant, before starting operations.
    - Qualification requirements, ensuring that only certified staff can be assigned.
- Deactivation/reactivation must not delete data but preserve it for audit and historical planning.
- Resources must be searchable and filterable by code, description, type, and status.

---

## 2. System Overview
This functionality allows **Logistics Operators** to maintain a registry of all physical port resources, such as cranes, trucks, and other operational equipment.  
Each resource is uniquely identified by an alphanumeric code and contains attributes that define its operational capacity, current status, and qualification requirements.

Operators can create new resources, update their information, or deactivate/reactivate them as needed — without data loss, ensuring historical consistency.  
Filtering operations allow quick retrieval of resources based on type, description, or status, supporting efficient planning and scheduling of port operations.

---

## 3. Architecture

**Main Components:**

- **ResourceController**  
  Handles HTTP requests related to physical resource management, including creation, retrieval, filtering, and reactivation/deactivation of resources.

- **ResourceService**  
  Implements business logic for filtering and validation.  
  Provides methods to retrieve resources by description, type, or status, ensuring only valid filters and operators are processed.

- **ResourceRepository**  
  Manages persistence and retrieval of `Resource` entities from the database, providing queryable access for filtering and updates.

- **Resource (Entity)**  
  Represents a physical resource with shared properties such as description, alphanumeric code, setup time, status, and qualification requirements.  
  Specialized resource types extend this class:
    - `STSCrane` – Ship-to-Shore Crane
    - `YardCrane` – Crane operating within the yard
    - `TerminalTruck` – Truck used for internal transport and loading/unloading operations

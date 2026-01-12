# US2201 – Create and Update Vessel Types

## 1. User Story Description
As a **Port Authority Officer**, I want to **create and update vessel types**, so that vessels can be classified consistently and their operational constraints are properly defined.

**Acceptance Criteria:**

- Vessel types must include attributes such as name, description, capacity, and operational constraints (e.g., maximum number of rows, bays, and tiers).
- Vessel types must be available for reference when registering vessel records.
- Vessel types must be searchable and filterable by name and description.

---

## 2. System Overview
This functionality enables **Port Authority Officers** to manage standardized classifications of vessel types within the port system.  
Each vessel type defines specific operational parameters such as capacity and structural constraints, ensuring that vessel records are consistent and comply with port limitations.

Through this feature, authorized officers can create new vessel types, update existing ones, and search for types using name or description filters.  
This ensures that all vessel records reference consistent, valid, and predefined vessel type data during registration and planning.

---

## 3. Architecture

**Main Components:**

- **VesselTypeController**  
  Handles HTTP requests related to vessel type management, including creation, updating, and retrieval of vessel type records.

- **VesselTypeService**  
  Contains business logic for validation and filtering of vessel type data, ensuring proper consistency and uniqueness of entries.

- **VesselTypeRepository**  
  Manages persistence and data access operations for `VesselType` entities, supporting search and filter functionality.

- **VesselType (Entity)**  
  Represents a vessel type within the system.  
  Contains key attributes such as name, description, capacity, and operational constraints (maximum rows, bays, and tiers).

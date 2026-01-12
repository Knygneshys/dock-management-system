# US2202 – Register Vessel

## 1. User Story Description
As a **Shipping Agent Representative**, I want to **register vessels** in the system, so that their details can be consistently stored and later used for scheduling and port operation planning.

**Acceptance Criteria:**

- Each vessel must include identifying attributes such as **IMO number**, **name**, **capacity**, **vessel type**, and **associated shipping company**.
- The **IMO number** must be unique and comply with international standards.
- The selected **vessel type** must correspond to an existing registered vessel type.
- Vessel records must be **searchable and filterable** by name, IMO number, vessel type, or company.
- Only **authorized Shipping Agent Representatives** can register vessels associated with their own company.

---

## 2. System Overview
This functionality allows **Shipping Agent Representatives** to register new vessels in the port management system.  
Each vessel record includes its identification, technical details, and associations with a specific vessel type and company.

By centralizing vessel registration, the system ensures consistent and validated data for scheduling operations and cargo management.  
The functionality also allows authorized users to retrieve and filter existing vessels using multiple criteria.

---

## 3. Architecture

**Main Components:**

- **VesselController**  
  Handles HTTP requests related to vessel management, including creation, updating, and retrieval of vessel data.

- **VesselService**  
  Implements business logic for vessel validation (e.g., IMO format compliance, uniqueness) and ensures that the associated vessel type and company exist.

- **VesselRepository**  
  Manages persistence and retrieval of `Vessel` entities from the database, supporting filtering by IMO number, name, or vessel type.

- **Vessel (Entity)**  
  Represents a vessel registered in the system.  
  Includes attributes such as `IMO`, `Name`, `Capacity`, `VesselTypeCode`, and `CompanyCode`.

- **VesselType (Entity)**  
  Defines the classification and operational parameters associated with each vessel.

- **Company (Entity)**  
  Identifies the shipping company that owns or operates the vessel.

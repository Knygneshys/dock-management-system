# US2211 – Register and Manage Operating Staff Members

## 1. User Story Description
As a **Logistics Operator**, I want to **register and manage operating staff members** (create, update, deactivate), so that the system can accurately reflect staff availability and ensure that only qualified personnel are assigned to resources during scheduling.

**Acceptance Criteria:**

- Each staff member must have a unique mecanographic number (ID), short name, contact details (email, phone), qualifications, operational window, and current status (e.g., available, unavailable).
- Deactivation/reactivation must not delete staff data but preserve it for audit and historical planning purposes.
- Staff members must be searchable and filterable by ID, name, status, and qualifications.

---

## 2. System Overview
This functionality allows **Logistics Operators** to manage and maintain records of port staff members, including their contact details, qualifications, and operational status.  
Each staff member is uniquely identified by a mecanographic number and can be activated or deactivated without data loss.  
The system ensures that only qualified and available personnel are considered for scheduling operations, maintaining full traceability through soft-state changes.  
Filtering and search capabilities allow operators to locate staff by identifiers, qualifications, and availability status.

---

## 3. Architecture

**Main Components:**

- **StaffController**  
  Handles the creation, update, deactivation, reactivation, and retrieval of staff member data.

- **StaffService**  
  Implements business logic for validating staff information, enforcing unique identifiers, and managing active/inactive states.

- **StaffRepository**  
  Executes persistence operations and supports search and filtering queries at the data layer.

- **StaffMember**  
  Domain entity representing an individual staff member, including mecanographic number, contact details, qualifications, operational window, and current status.

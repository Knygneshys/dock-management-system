# US2213 – Register and Manage Qualifications

## 1. User Story Description
As a **Logistics Operator**, I want to **register and manage qualifications** (create, update), so that staff members and resources can be consistently associated with the correct skills and certifications required for port operations.

**Acceptance Criteria:**

- Each qualification has a unique code and a descriptive name (e.g., "STS Crane Operator," "Truck Driver").
- Qualifications must be searchable and filterable by code or name.
- A qualification must exist before it can be assigned to staff members or resources.

---

## 2. System Overview
This functionality enables **Logistics Operators** to maintain a controlled registry of qualifications that define operational competencies within the port.  
Each qualification includes a unique code and a name that identifies a specific operational skill or certification.

The system ensures that only existing qualifications can be associated with staff members or resources, enforcing consistency and validation during resource and personnel management.  
Filtering and search mechanisms provide quick access to relevant qualifications for assignment or verification purposes.

---

## 3. Architecture

**Main Components:**

- **QualificationController**  
  Handles HTTP requests related to qualification management, including creation, updating, and retrieval (with optional filtering).

- **QualificationService**  
  Implements business rules for qualification creation and validation, ensuring uniqueness and consistent updates.

- **QualificationRepository**  
  Responsible for data persistence and retrieval, supporting filtering and lookup operations by code or name.

- **Qualification (Entity)**  
  Represents a port qualification or certification, characterized by a unique code and descriptive name.  
  Used as a reference entity in both **StaffMember** and **Resource** to ensure proper certification assignment.

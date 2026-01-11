# Software Requirements Specification (SRS)
# Blood Donation Management System (BloodBridge)
## Part 1: Introduction and Functional Requirements

**Document Version:** 1.0  
**Date:** January 7, 2026  
**Prepared By:** System Analysis Team

---

## Table of Contents - Part 1

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features (Functional Requirements)](#3-system-features-functional-requirements)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document provides a complete description of the Blood Donation Management System (BloodBridge). It details the functional and non-functional requirements, system architecture, database design, and API specifications for the blood donation management platform that connects donors, hospitals, and administrators.

### 1.2 Document Conventions
- **API Endpoints** are denoted in `code format`
- **User Roles** are capitalized: Admin, User (Donor), Hospital
- **Database Tables** are written in lowercase with underscores: `users`, `blood_requests`
- **Blood Groups** follow medical notation: A+, A-, B+, B-, AB+, AB-, O+, O-

### 1.3 Intended Audience
- Project Managers
- Software Developers (Frontend & Backend)
- Database Administrators
- Quality Assurance Teams
- System Administrators
- Stakeholders and Clients

### 1.4 Project Scope
BloodBridge is a comprehensive web-based blood donation management system designed to:
- Streamline the blood donation process
- Connect blood donors with those in need
- Enable hospitals to manage blood bank inventories
- Facilitate emergency blood requests from public and hospitals
- Provide administrators with complete system oversight
- Track donation history and generate reports
- Send automated notifications to donors

**Key Objectives:**
- Reduce the time to find blood donors during emergencies
- Maintain accurate blood bank inventory across hospitals
- Track donor history and eligibility
- Generate comprehensive reports and statistics
- Ensure data security and privacy compliance

---

## 2. Overall Description

### 2.1 Product Perspective
BloodBridge operates as a standalone web application with the following architecture:
- **Frontend:** React 18.3 with Vite build tool
- **Backend:** Laravel 10 (PHP 8.1+) RESTful API
- **Database:** MySQL/MariaDB relational database
- **Authentication:** Laravel Sanctum token-based authentication
- **Email Service:** Laravel Mail with SMTP configuration
- **State Management:** Redux Toolkit with RTK Query

### 2.2 Product Functions

#### 2.2.1 For Blood Donors (Users)
- Register as blood donor with complete profile
- Login and manage personal account
- View personalized dashboard with donation statistics
- Track complete donation history with filtering options
- Update profile information and preferences
- Change account password securely
- View blood requests from public and hospitals
- Receive email notifications for blood donation opportunities
- Export donation history as PDF certificates
- View eligibility criteria and donation process information

#### 2.2.2 For Hospitals
- Register hospital with complete institutional details
- Login and access hospital-specific dashboard
- Manage blood bank inventory (all 8 blood groups)
- Submit blood requests to the system
- View and track hospital-specific blood requests
- Update hospital profile information
- Change account password
- View request statistics (total, pending, approved, rejected)

#### 2.2.3 For Administrators
- Secure admin login with static token authentication
- Comprehensive dashboard with system-wide statistics
- Manage all registered users (view, edit, delete)
- Manage all hospitals (view, edit, delete)
- View and manage all blood requests (public and hospital)
- Update blood request statuses (Pending, Accepted, Declined)
- Manage donor donation records (create, update, view)
- View total blood inventory across all hospitals
- Access detailed reports with monthly trends
- View blood group distribution statistics
- Send email notifications to specific donors
- View donor counts by blood group
- Search and filter donors by blood group
- Create new admin accounts
- Change admin passwords

#### 2.2.4 For Public (Unauthenticated Users)
- View landing page with system information
- Access blood donation process steps
- Check eligibility criteria for donation
- Submit emergency blood requests
- View available donor counts by blood group
- Browse donor list by blood group with pagination
- Register as donor or hospital
- Login to existing accounts
- Password reset via OTP verification

### 2.3 User Classes and Characteristics

#### 2.3.1 Blood Donors (Users)
- **Technical Expertise:** Basic to intermediate computer skills
- **Frequency of Use:** Occasional (after donations or when checking history)
- **Age Range:** 18-65 years
- **Primary Goals:** Track donations, maintain health records, help others
- **Key Characteristics:** Health-conscious, altruistic, mobile-friendly preference

#### 2.3.2 Hospital Staff
- **Technical Expertise:** Intermediate computer skills
- **Frequency of Use:** Daily to weekly
- **Primary Goals:** Manage inventory, fulfill requests, maintain records
- **Key Characteristics:** Time-sensitive operations, accuracy-focused

#### 2.3.3 System Administrators
- **Technical Expertise:** Advanced computer and system knowledge
- **Frequency of Use:** Daily
- **Primary Goals:** Monitor system, manage users, generate reports, ensure smooth operations
- **Key Characteristics:** Tech-savvy, detail-oriented, security-conscious

#### 2.3.4 Public/Emergency Requesters
- **Technical Expertise:** Basic computer skills
- **Frequency of Use:** One-time or rare emergency use
- **Primary Goals:** Find blood donors quickly during emergencies
- **Key Characteristics:** Urgent need, minimal time for complex processes

### 2.4 Operating Environment
- **Client-Side:** Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Server-Side:** 
  - PHP 8.1+ with required extensions
  - Node.js 18+ for frontend build
  - Composer for PHP dependency management
  - npm/yarn for JavaScript dependencies
- **Database:** MySQL 8.0+ or MariaDB 10.5+
- **Web Server:** Apache 2.4+ or Nginx 1.18+
- **Operating System:** Windows, Linux, or macOS
- **Minimum Screen Resolution:** 1024x768 (responsive down to 320px mobile)

### 2.5 Design and Implementation Constraints

#### 2.5.1 Technical Constraints
- Must use Laravel 10 framework for backend
- Must use React 18.3 for frontend
- Database must be relational (MySQL/MariaDB)
- Token-based authentication using Laravel Sanctum
- RESTful API architecture mandatory
- Must support responsive design (mobile-first approach)

#### 2.5.2 Regulatory Constraints
- HIPAA compliance for health data (if applicable in jurisdiction)
- GDPR compliance for European users
- Data privacy laws compliance
- Medical data retention policies
- Age verification (18+ for blood donation)

#### 2.5.3 Security Constraints
- All passwords must be hashed using bcrypt
- HTTPS required for production deployment
- CORS policies must be properly configured
- Input validation on both client and server
- Protection against SQL injection, XSS, CSRF attacks
- Rate limiting on authentication endpoints

#### 2.5.4 Business Rules
- Donors must wait minimum duration between donations (tracked via lastDonationDate)
- Blood groups limited to 8 standard types: A+, A-, B+, B-, AB+, AB-, O+, O-
- Request IDs auto-generated with prefixes (BR- for public, HR- for hospital)
- Admin tokens prefixed with 'admin_token_' or 'admin_static_token_'
- OTP validity: 10 minutes maximum
- Password requirements: minimum 6 characters (can be configured to 8-12)

### 2.6 User Documentation
- User registration guide with eligibility criteria
- Blood donation process walkthrough
- Dashboard navigation tutorials
- PDF export and certificate generation guide
- FAQ section for common queries
- Terms of service and privacy policy
- Safety guidelines for donors

### 2.7 Assumptions and Dependencies

#### 2.7.1 Assumptions
- Users have access to internet-connected devices
- Users have valid email addresses for communication
- Hospitals have authorized staff to manage the system
- Blood group information is accurately provided by donors
- Server infrastructure is available 24/7
- Regular database backups are performed

#### 2.7.2 Dependencies
- Laravel Framework 10.x
- React 18.3.x
- MySQL/MariaDB database server
- SMTP email service provider
- PHP extensions: OpenSSL, PDO, Mbstring, Tokenizer, XML, Ctype, JSON, BCMath
- Composer package manager
- npm package manager
- Internet connectivity for API calls

---

## 3. System Features (Functional Requirements)

### 3.1 User Authentication and Authorization

#### 3.1.1 User Registration (FR-001)
**Description:** Allow new donors to register in the system with complete profile information.

**Priority:** High  
**Stimulus/Response:** User fills registration form → System validates and creates account

**Functional Requirements:**
- **FR-001.1:** System shall accept user registration with the following mandatory fields:
  - First Name (string, max 255 characters)
  - Last Name (string, max 255 characters)
  - Blood Group (dropdown: A+, A-, B+, B-, AB+, AB-, O+, O-)
  - Gender (dropdown: Male, Female, Other)
  - Email (unique, valid email format)
  - Contact Number (string)
  - Area/Location (string)
  - Password (min 6 characters, must be confirmed)

- **FR-001.2:** System shall accept optional field:
  - Last Donation Date (date picker, only if user has donated before)

- **FR-001.3:** System shall validate email uniqueness against existing users table

- **FR-001.4:** System shall hash password using bcrypt before storage

- **FR-001.5:** System shall assign default role 'user' to registered donors

- **FR-001.6:** System shall display success message and redirect to login page

- **FR-001.7:** System shall display appropriate error messages for:
  - Duplicate email addresses
  - Invalid input formats
  - Password mismatch
  - Network errors

- **FR-001.8:** System shall display terms and conditions with checkbox acceptance

- **FR-001.9:** System shall display eligibility criteria and safety guidelines before registration

**API Endpoint:** `POST /api/register`

---

#### 3.1.2 Hospital Registration (FR-002)
**Description:** Enable hospitals to register with institutional details.

**Priority:** High  
**Stimulus/Response:** Hospital staff fills registration form → System validates and creates hospital account

**Functional Requirements:**
- **FR-002.1:** System shall accept hospital registration with mandatory fields:
  - Hospital Name (string, max 255)
  - Registration ID (unique, max 255)
  - Hospital Type (dropdown: Government, Private, Charitable, Military, Research)
  - Year Established (integer, 4 digits)
  - Complete Address (string)
  - City (string)
  - District (dropdown of districts)
  - Email (unique, valid format)
  - Contact Number (string)
  - Has Blood Bank (Yes/No selection)
  - Password (min 6 characters, confirmed)

- **FR-002.2:** System shall accept optional fields:
  - Emergency Hotline Number
  - Available Blood Groups (multi-select if has blood bank)

- **FR-002.3:** System shall validate registration ID uniqueness

- **FR-002.4:** System shall validate email uniqueness against hospitals table

- **FR-002.5:** System shall assign default role 'hospital'

- **FR-002.6:** System shall hash password using bcrypt

- **FR-002.7:** System shall store available blood groups as JSON array

- **FR-002.8:** System shall redirect to login after successful registration

**API Endpoint:** `POST /api/hospital-register`

---

#### 3.1.3 User Login (FR-003)
**Description:** Authenticate users, hospitals, and admins with email and password.

**Priority:** Critical  
**Stimulus/Response:** User enters credentials → System validates and grants access

**Functional Requirements:**
- **FR-003.1:** System shall accept login credentials:
  - Email (required, valid format)
  - Password (required)

- **FR-003.2:** System shall check credentials in following order:
  1. Admin table first
  2. Users table second
  3. Hospitals table third

- **FR-003.3:** System shall generate authentication token upon successful login:
  - Admin: Static token with prefix 'admin_token_' + timestamp
  - User/Hospital: Laravel Sanctum token

- **FR-003.4:** System shall return user information in response:
  - User ID
  - Name (firstname/lastname or hospitalName)
  - Email
  - User Type (admin/user/hospital)
  - Access Token
  - Token Type (Bearer)
  - Additional profile fields

- **FR-003.5:** System shall store token in localStorage on client side

- **FR-003.6:** System shall redirect based on user type:
  - Admin → `/admin/dashboard`
  - Hospital → `/hospital/dashboard`
  - User → `/user/dashboard`

- **FR-003.7:** System shall return 401 error for invalid credentials

- **FR-003.8:** System shall handle case-insensitive email for admins

**API Endpoint:** `POST /api/login`

---

#### 3.1.4 Password Reset with OTP (FR-004)
**Description:** Allow users to reset forgotten passwords via OTP verification.

**Priority:** High  
**Stimulus/Response:** User requests password reset → Receives OTP → Verifies → Resets password

**Functional Requirements:**
- **FR-004.1:** System shall provide OTP send functionality:
  - Accept email address
  - Generate 6-digit random OTP (100000-999999)
  - Store OTP in database with 10-minute expiry
  - Send OTP via email notification
  - Delete any previous OTPs for same user

- **FR-004.2:** System shall verify OTP:
  - Accept email and 6-digit OTP code
  - Validate OTP against database
  - Check expiry timestamp
  - Mark OTP as used upon successful verification
  - Return error for invalid or expired OTP

- **FR-004.3:** System shall reset password:
  - Accept email, new password, and confirmation
  - Verify recent OTP verification (within 5 minutes)
  - Hash new password using bcrypt
  - Update password in users or hospitals table
  - Delete all OTPs for the user
  - Return success confirmation

- **FR-004.4:** System shall work for both users and hospitals

- **FR-004.5:** System shall track OTP attempts to prevent abuse

**API Endpoints:**
- `POST /api/password-reset/send-otp`
- `POST /api/password-reset/verify-otp`
- `POST /api/password-reset/reset`

---

#### 3.1.5 Legacy Password Reset (FR-005)
**Description:** Backward compatible password reset without OTP (kept for compatibility).

**Priority:** Low  
**Stimulus/Response:** User provides email and new password → System updates password

**Functional Requirements:**
- **FR-005.1:** System shall accept email and new password with confirmation
- **FR-005.2:** System shall search in users table first, then hospitals table
- **FR-005.3:** System shall hash and update password
- **FR-005.4:** System shall return 404 if email not found

**API Endpoint:** `POST /api/forgot-password`

---

### 3.2 User Profile Management

#### 3.2.1 Update User Profile (FR-006)
**Description:** Allow authenticated donors to update their profile information.

**Priority:** Medium  
**Stimulus/Response:** User modifies profile fields → System validates and updates

**Functional Requirements:**
- **FR-006.1:** System shall require authentication via Sanctum token
- **FR-006.2:** System shall allow updating:
  - First Name (required, string, max 255)
  - Last Name (required, string, max 255)
  - Blood Group (required)
  - Gender (required)
  - Area (required)
  - Contact Number (required)
  - Email (required, unique except current user)

- **FR-006.3:** System shall validate email uniqueness excluding current user ID
- **FR-006.4:** System shall return updated user object
- **FR-006.5:** System shall return validation errors if any field is invalid

**API Endpoint:** `PUT /api/user/profile` (Protected)

---

#### 3.2.2 Update User Password (FR-007)
**Description:** Allow users to change their account password.

**Priority:** High  
**Stimulus/Response:** User provides current and new password → System validates and updates

**Functional Requirements:**
- **FR-007.1:** System shall require:
  - Current password (required)
  - New password (required, 8-12 characters)

- **FR-007.2:** System shall verify current password against hashed password
- **FR-007.3:** System shall return 401 if current password is incorrect
- **FR-007.4:** System shall hash new password using bcrypt
- **FR-007.5:** System shall update password in database
- **FR-007.6:** System shall return success message

**API Endpoint:** `PUT /api/user/password` (Protected)

---

#### 3.2.3 Update Hospital Profile (FR-008)
**Description:** Allow hospitals to update their institutional information.

**Priority:** Medium  
**Stimulus/Response:** Hospital staff updates information → System validates and saves

**Functional Requirements:**
- **FR-008.1:** System shall require authentication
- **FR-008.2:** System shall allow updating:
  - Hospital Name, Registration ID, Hospital Type
  - Year Established, Address, City, District
  - Email (unique except current hospital)
  - Contact Number, Emergency Hotline
  - Has Blood Bank (yes/no)

- **FR-008.3:** System shall validate email uniqueness
- **FR-008.4:** System shall return updated hospital object

**API Endpoint:** `PUT /api/hospital/profile` (Protected)

---

#### 3.2.4 Update Hospital Password (FR-009)
**Description:** Allow hospital users to change account password.

**Priority:** High  
**Stimulus/Response:** Hospital provides current and new password → System updates

**Functional Requirements:**
- **FR-009.1:** System shall follow same logic as user password update
- **FR-009.2:** System shall require current password verification
- **FR-009.3:** System shall enforce 8-12 character limit for new password
- **FR-009.4:** System shall hash and store new password

**API Endpoint:** `PUT /api/hospital/password` (Protected)

---

### 3.3 Blood Request Management

#### 3.3.1 Submit Public Blood Request (FR-010)
**Description:** Allow anyone (public or authenticated users) to submit emergency blood requests.

**Priority:** Critical  
**Stimulus/Response:** Requester fills blood request form → System creates request with unique ID

**Functional Requirements:**
- **FR-010.1:** System shall accept blood request with fields:
  - Patient Name (optional, for public requests)
  - Hospital Name (optional, for hospital requests)
  - Blood Group (required, dropdown)
  - Units Required (required, integer, min 1)
  - Requested By (required, name of requester)
  - Contact Number (required)

- **FR-010.2:** System shall auto-generate unique Request ID:
  - Format: `BR-XXX` for public requests (with patient_name)
  - Format: `HR-XXX` for hospital requests (with hospital_name)
  - XXX = auto-incremented 3-digit number with zero padding

- **FR-010.3:** System shall set default status as 'Pending'

- **FR-010.4:** System shall store timestamp of request creation

- **FR-010.5:** System shall return created request with Request ID

- **FR-010.6:** System shall be accessible without authentication

**API Endpoint:** `POST /api/blood-requests`

---

#### 3.3.2 View All Blood Requests (FR-011)
**Description:** Display all blood requests (admin and public view).

**Priority:** High  
**Stimulus/Response:** User/Admin accesses blood requests → System returns all requests

**Functional Requirements:**
- **FR-011.1:** System shall return all blood requests ordered by creation date (newest first)
- **FR-011.2:** System shall include all request fields:
  - Request ID, Patient Name, Hospital Name
  - Blood Group, Units, Requested By
  - Contact, Status, Created At, Updated At

- **FR-011.3:** System shall be accessible without authentication

**API Endpoint:** `GET /api/blood-requests`

---

#### 3.3.3 Update Blood Request Status (FR-012)
**Description:** Allow admin to update status of blood requests.

**Priority:** High  
**Stimulus/Response:** Admin changes request status → System updates database

**Functional Requirements:**
- **FR-012.1:** System shall accept status update for specific request ID
- **FR-012.2:** System shall validate status value (pending, accepted, declined, Pending, Accepted, Declined, Accept, Decline)
- **FR-012.3:** System shall update status and timestamp
- **FR-012.4:** System shall return 404 if request not found
- **FR-012.5:** System shall return updated request object

**API Endpoint:** `PATCH /api/blood-requests/{id}`

---

#### 3.3.4 View Hospital-Specific Requests (FR-013)
**Description:** Allow hospitals to view only their submitted requests.

**Priority:** Medium  
**Stimulus/Response:** Hospital accesses requests → System filters by hospital name

**Functional Requirements:**
- **FR-013.1:** System shall accept hospital_name as query parameter
- **FR-013.2:** System shall return 400 if hospital_name not provided
- **FR-013.3:** System shall filter requests WHERE hospital_name matches
- **FR-013.4:** System shall order by creation date (newest first)
- **FR-013.5:** System shall calculate statistics:
  - Total requests count
  - Pending requests count
  - Approved requests count
  - Rejected requests count

- **FR-013.6:** System shall return requests array and stats object

**API Endpoint:** `GET /api/hospital/blood-requests?hospital_name={name}`

---

### 3.4 Blood Bank Inventory Management

#### 3.4.1 Update Blood Bank Inventory (FR-014)
**Description:** Allow hospitals to update their blood bank inventory.

**Priority:** High  
**Stimulus/Response:** Hospital updates units → System saves inventory

**Functional Requirements:**
- **FR-014.1:** System shall accept inventory update with:
  - Hospital Name (required)
  - Units for all 8 blood groups (required, integer, min 0):
    - a_positive, a_negative
    - b_positive, b_negative
    - ab_positive, ab_negative
    - o_positive, o_negative

- **FR-014.2:** System shall use UPSERT logic (update if exists, create if not)
- **FR-014.3:** System shall update timestamp automatically
- **FR-014.4:** System shall return updated inventory data

**API Endpoint:** `POST /api/hospital/blood-bank`

---

#### 3.4.2 View Hospital Blood Inventory (FR-015)
**Description:** Retrieve blood bank inventory for specific hospital.

**Priority:** Medium  
**Stimulus/Response:** Request inventory → System returns current stock

**Functional Requirements:**
- **FR-015.1:** System shall accept hospital_name as query parameter
- **FR-015.2:** System shall return 400 if hospital_name missing
- **FR-015.3:** System shall search inventory by hospital name
- **FR-015.4:** System shall return zero values for all groups if no inventory exists
- **FR-015.5:** System shall return current inventory with all 8 blood group units

**API Endpoint:** `GET /api/hospital/blood-bank?hospital_name={name}`

---

#### 3.4.3 View Total Blood Inventory (Admin) (FR-016)
**Description:** Display aggregated blood inventory across all hospitals.

**Priority:** High  
**Stimulus/Response:** Admin views inventory → System aggregates all hospitals

**Functional Requirements:**
- **FR-016.1:** System shall require admin authentication
- **FR-016.2:** System shall calculate SUM of each blood group across all hospitals
- **FR-016.3:** System shall return formatted data:
  - 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-' as keys
  - Integer unit counts as values

- **FR-016.4:** System shall return zero if no inventory exists

**API Endpoint:** `GET /api/admin/blood-inventory`

---

### 3.5 Donation Management

#### 3.5.1 View User Donations (FR-017)
**Description:** Allow users to view their complete donation history with filters.

**Priority:** High  
**Stimulus/Response:** User accesses history → System returns paginated donations

**Functional Requirements:**
- **FR-017.1:** System shall require user authentication
- **FR-017.2:** System shall filter donations by authenticated user ID
- **FR-017.3:** System shall support pagination:
  - per_page parameter (default 5)
  - page parameter for navigation

- **FR-017.4:** System shall support year filter:
  - year parameter to filter by donation year
  - 'all' to show all years

- **FR-017.5:** System shall support 'all' parameter to return all records without pagination

- **FR-017.6:** System shall return donation fields:
  - ID, User ID, Donated At
  - Blood Group, Units, Type
  - Center Name, Status, Notes
  - Created At, Updated At

- **FR-017.7:** System shall order by donated_at DESC

- **FR-017.8:** System shall return pagination metadata:
  - current_page, per_page, total, last_page

**API Endpoint:** `GET /api/user/donations` (Protected)

---

#### 3.5.2 Admin View All Donations (FR-018)
**Description:** Allow admin to view all donations with search and pagination.

**Priority:** High  
**Stimulus/Response:** Admin accesses donations → System returns all with filters

**Functional Requirements:**
- **FR-018.1:** System shall support pagination (default 10 per page)
- **FR-018.2:** System shall support search functionality across:
  - Donation ID
  - Center Name
  - Blood Group
  - Donor's first name, last name, email

- **FR-018.3:** System shall include donor information via relationship:
  - Donor ID, First Name, Last Name, Email

- **FR-018.4:** System shall return formatted data:
  - All donation fields
  - Donor name concatenated
  - Donor email

- **FR-018.5:** System shall order by donated_at DESC

**API Endpoint:** `GET /api/admin/donations`

---

#### 3.5.3 Create Donation Record (Admin) (FR-019)
**Description:** Allow admin to manually create donation records.

**Priority:** Medium  
**Stimulus/Response:** Admin creates donation → System validates and saves

**Functional Requirements:**
- **FR-019.1:** System shall accept:
  - User ID (required, must exist in users table)
  - Donated At (required, datetime)
  - Blood Group (required)
  - Units (required, integer, min 1)
  - Type (optional, default 'Whole Blood')
  - Center Name (required)
  - Status (required: Completed, In Process, Deferred, Cancelled)
  - Notes (optional, text)

- **FR-019.2:** System shall validate user_id exists
- **FR-019.3:** System shall create donation record
- **FR-019.4:** System shall update user's lastDonationDate if status is 'Completed'
- **FR-019.5:** System shall return created donation with 201 status

**API Endpoint:** `POST /api/admin/donations`

---

#### 3.5.4 Update Donation Record (Admin) (FR-020)
**Description:** Allow admin to modify existing donation records.

**Priority:** Medium  
**Stimulus/Response:** Admin updates donation → System validates and saves changes

**Functional Requirements:**
- **FR-020.1:** System shall accept partial updates for:
  - User ID, Donated At, Blood Group, Units
  - Type, Center Name, Status, Notes

- **FR-020.2:** System shall validate user_id if provided
- **FR-020.3:** System shall find donation by ID or return 404
- **FR-020.4:** System shall update only provided fields
- **FR-020.5:** System shall recalculate user's lastDonationDate if status changed to 'Completed'
- **FR-020.6:** System shall find most recent completed donation for lastDonationDate
- **FR-020.7:** System shall return updated donation

**API Endpoint:** `PATCH /api/admin/donations/{id}`

---

### 3.6 Admin User Management

#### 3.6.1 View All Users (FR-021)
**Description:** Display list of all registered donors.

**Priority:** High  
**Stimulus/Response:** Admin requests user list → System returns all users

**Functional Requirements:**
- **FR-021.1:** System shall return all users from users table
- **FR-021.2:** System shall include fields:
  - ID, First Name, Last Name, Blood Group
  - Gender, Email, Contact Number
  - Area, Last Donation Date, Created At

- **FR-021.3:** System shall order by created_at DESC
- **FR-021.4:** System shall exclude password field
- **FR-021.5:** System shall accept admin token or Sanctum token

**API Endpoint:** `GET /api/admin/users`

---

#### 3.6.2 Update User (FR-022)
**Description:** Allow admin to modify user details.

**Priority:** Medium  
**Stimulus/Response:** Admin updates user → System validates and saves

**Functional Requirements:**
- **FR-022.1:** System shall find user by ID or return 404
- **FR-022.2:** System shall accept optional updates for:
  - First Name, Last Name, Blood Group
  - Gender, Email, Contact Number, Area

- **FR-022.3:** System shall validate email uniqueness excluding current user
- **FR-022.4:** System shall update only provided fields
- **FR-022.5:** System shall return updated user object

**API Endpoint:** `PUT /api/admin/users/{id}`

---

#### 3.6.3 Delete User (FR-023)
**Description:** Allow admin to remove user accounts.

**Priority:** High  
**Stimulus/Response:** Admin deletes user → System removes from database

**Functional Requirements:**
- **FR-023.1:** System shall find user by ID or return 404
- **FR-023.2:** System shall delete user record
- **FR-023.3:** System shall cascade delete related records (donations, OTPs)
- **FR-023.4:** System shall return success message

**API Endpoint:** `DELETE /api/admin/users/{id}`

---

#### 3.6.4 View All Hospitals (FR-024)
**Description:** Display list of all registered hospitals.

**Priority:** High  
**Stimulus/Response:** Admin requests hospital list → System returns all hospitals

**Functional Requirements:**
- **FR-024.1:** System shall return all hospitals
- **FR-024.2:** System shall include:
  - ID, Hospital Name, Registration ID
  - Hospital Type, Year Established
  - Address, City, District
  - Email, Contact Number
  - Emergency Hotline, Has Blood Bank
  - Created At

- **FR-024.3:** System shall order by created_at DESC
- **FR-024.4:** System shall exclude password field

**API Endpoint:** `GET /api/admin/hospitals`

---

#### 3.6.5 Update Hospital (FR-025)
**Description:** Allow admin to modify hospital details.

**Priority:** Medium  
**Stimulus/Response:** Admin updates hospital → System validates and saves

**Functional Requirements:**
- **FR-025.1:** System shall find hospital by ID or return 404
- **FR-025.2:** System shall accept optional updates for all hospital fields
- **FR-025.3:** System shall validate email uniqueness
- **FR-025.4:** System shall return updated hospital object

**API Endpoint:** `PUT /api/admin/hospitals/{id}`

---

#### 3.6.6 Delete Hospital (FR-026)
**Description:** Allow admin to remove hospital accounts.

**Priority:** High  
**Stimulus/Response:** Admin deletes hospital → System removes from database

**Functional Requirements:**
- **FR-026.1:** System shall find hospital by ID or return 404
- **FR-026.2:** System shall delete hospital record
- **FR-026.3:** System shall return success message

**API Endpoint:** `DELETE /api/admin/hospitals/{id}`

---

### 3.7 Admin Dashboard and Reports

#### 3.7.1 Dashboard Statistics (FR-027)
**Description:** Display comprehensive system statistics on admin dashboard.

**Priority:** High  
**Stimulus/Response:** Admin opens dashboard → System calculates and displays stats

**Functional Requirements:**
- **FR-027.1:** System shall calculate and return:
  - **Total Donors:** Count of all users
  - **Total Requests:** Count of all blood requests
  - **Approved Requests:** Count where status = 'Accept/Accepted/accepted'
  - **Total Blood Units:** Sum of all blood groups across all hospitals

- **FR-027.2:** System shall return blood group inventory breakdown:
  - Individual counts for A+, A-, B+, B-, AB+, AB-, O+, O-

- **FR-027.3:** System shall aggregate from blood_banks table

**API Endpoint:** `GET /api/admin/dashboard-stats`

---

#### 3.7.2 Reports Statistics (FR-028)
**Description:** Generate detailed monthly reports with trends and analysis.

**Priority:** High  
**Stimulus/Response:** Admin selects month/year → System generates comprehensive report

**Functional Requirements:**
- **FR-028.1:** System shall accept optional parameters:
  - month (default: current month)
  - year (default: current year)

- **FR-028.2:** System shall calculate **Total Donations**:
  - Count of donations with status 'Completed' in selected month
  - Compare with previous month
  - Calculate percentage growth

- **FR-028.3:** System shall calculate **New Donors**:
  - Count of users registered in selected month
  - Compare with previous month
  - Calculate percentage growth

- **FR-028.4:** System shall calculate **Blood Collected**:
  - Sum of units from donations in selected month
  - Compare with previous month
  - Calculate percentage growth

- **FR-028.5:** System shall calculate **Requests Fulfilled**:
  - Count of requests with status 'accepted' in selected month
  - Compare with previous month
  - Calculate percentage growth

- **FR-028.6:** System shall generate **Blood Group Distribution**:
  - Group by blood_group from donations table
  - Calculate total units per blood group
  - Calculate percentage of total
  - Count number of donations per group
  - Sort by units descending

- **FR-028.7:** System shall generate **Monthly Trends** (last 6 months):
  - Array of month names with donation counts
  - Only count 'Completed' status donations

- **FR-028.8:** System shall return growth percentages with +/- prefix

**API Endpoint:** `GET /api/admin/reports-stats?month={month}&year={year}`

---

### 3.8 Donor Search and Communication

#### 3.8.1 View Public Donors (FR-029)
**Description:** Display list of registered donors (public endpoint).

**Priority:** Medium  
**Stimulus/Response:** Anyone accesses donor list → System returns donor information

**Functional Requirements:**
- **FR-029.1:** System shall return donor fields:
  - ID, First Name, Last Name
  - Blood Group, Contact Number, Area

- **FR-029.2:** System shall exclude sensitive information (email, password, last donation date)
- **FR-029.3:** System shall order by created_at DESC
- **FR-029.4:** System shall be accessible without authentication

**API Endpoint:** `GET /api/donors`

---

#### 3.8.2 Donor Counts by Blood Group (FR-030)
**Description:** Display count of donors for each blood group.

**Priority:** Medium  
**Stimulus/Response:** Request donor statistics → System returns counts

**Functional Requirements:**
- **FR-030.1:** System shall count users for each blood group
- **FR-030.2:** System shall return object with blood groups as keys:
  - 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'

- **FR-030.3:** System shall return zero if no donors exist for a group
- **FR-030.4:** System shall be accessible without authentication

**API Endpoint:** `GET /api/donors/counts-by-blood-group`

---

#### 3.8.3 Search Donors by Blood Group (FR-031)
**Description:** Filter and display donors of specific blood group with pagination.

**Priority:** High  
**Stimulus/Response:** User selects blood group → System returns matching donors

**Functional Requirements:**
- **FR-031.1:** System shall accept blood group as path parameter
- **FR-031.2:** System shall accept per_page query parameter (default 10)
- **FR-031.3:** System shall filter users WHERE bloodgroup matches
- **FR-031.4:** System shall return:
  - ID, First Name, Last Name, Blood Group
  - Email, Contact Number, Area
  - Last Donation Date

- **FR-031.5:** System shall include pagination metadata
- **FR-031.6:** System shall be accessible without authentication

**API Endpoint:** `GET /api/donors/blood-group/{bloodGroup}?per_page={number}`

---

#### 3.8.4 Send Email to Donor (FR-032)
**Description:** Allow admin to send email notifications to specific donors.

**Priority:** Medium  
**Stimulus/Response:** Admin sends email → System delivers to donor

**Functional Requirements:**
- **FR-032.1:** System shall accept:
  - donor_id (required, must exist)
  - subject (optional, default message)
  - message (optional, default thank you message)

- **FR-032.2:** System shall find donor by ID or return 404
- **FR-032.3:** System shall use DonorNotification Mailable class
- **FR-032.4:** System shall send email to donor's email address
- **FR-032.5:** System shall construct recipient name from firstname + lastname
- **FR-032.6:** System shall use default subject if not provided:
  - "Message from Blood Donation Management System"

- **FR-032.7:** System shall use default message if not provided:
  - Thank you message for being registered donor

- **FR-032.8:** System shall return success/failure response
- **FR-032.9:** System shall handle email sending failures gracefully

**API Endpoint:** `POST /api/admin/send-email`

---

### 3.9 Admin Management

#### 3.9.1 Add New Admin (FR-033)
**Description:** Allow existing admin to create new admin accounts.

**Priority:** High  
**Stimulus/Response:** Admin creates new admin → System validates and creates account

**Functional Requirements:**
- **FR-033.1:** System shall accept:
  - admin_id (required, unique string)
  - email (required, unique, valid format)
  - password (required, min 8 characters)

- **FR-033.2:** System shall validate admin_id uniqueness
- **FR-033.3:** System shall validate email uniqueness in admins table
- **FR-033.4:** System shall hash password using bcrypt
- **FR-033.5:** System shall create admin record
- **FR-033.6:** System shall return created admin (excluding password)

**API Endpoint:** `POST /api/admin/add`

---

#### 3.9.2 Change Admin Password (FR-034)
**Description:** Allow admin to change their own password.

**Priority:** High  
**Stimulus/Response:** Admin updates password → System validates and updates

**Functional Requirements:**
- **FR-034.1:** System shall accept:
  - admin_id (required)
  - current_password (required)
  - new_password (required, min 8 characters)

- **FR-034.2:** System shall find admin by admin_id or return 404
- **FR-034.3:** System shall verify current_password against hashed password
- **FR-034.4:** System shall return 401 if current password incorrect
- **FR-034.5:** System shall hash and save new password
- **FR-034.6:** System shall return success message

**API Endpoint:** `POST /api/admin/change-password`

---

### 3.10 Public Statistics

#### 3.10.1 General Statistics (FR-035)
**Description:** Display basic system statistics for public view.

**Priority:** Low  
**Stimulus/Response:** Request statistics → System returns counts

**Functional Requirements:**
- **FR-035.1:** System shall return:
  - total_users: Count of all users
  - total_requests: Count of all blood requests
  - approved_requests: Count where status = 'Approved'
  - total_units: null (deprecated field)

- **FR-035.2:** System shall be accessible without authentication

**API Endpoint:** `GET /api/stats`

---

### 3.11 Frontend Features

#### 3.11.1 Landing Page (FR-036)
**Description:** Display public-facing landing page with information and services.

**Priority:** High

**Functional Requirements:**
- **FR-036.1:** Hero section with:
  - Main tagline: "Give Bloods Save Lives"
  - Call-to-action: Request Blood button
  - Promotional image

- **FR-036.2:** How It Works section with 4 steps:
  - Register, Health Check, Donate Blood, Refresh and Recover
  - Icons and descriptions for each step

- **FR-036.3:** Services section with cards:
  - Make an appointment
  - Learn about donation
  - Are you eligible?

- **FR-036.4:** Blood Group Cards displaying:
  - All 8 blood groups with donor counts
  - Clickable to view donors of that group
  - Donor modal with pagination

- **FR-036.5:** Blood Request Modal:
  - Form to submit emergency request
  - Patient name or hospital name field
  - Blood group, units, requester details

- **FR-036.6:** Eligibility Criteria Modal with requirements
- **FR-036.7:** Learn More Modal with donation process

- **FR-036.8:** Smooth animations using Framer Motion
- **FR-036.9:** Responsive design for all screen sizes

**Route:** `/`

---

#### 3.11.2 User Dashboard (FR-037)
**Description:** Personalized dashboard for registered donors.

**Priority:** High

**Functional Requirements:**
- **FR-037.1:** Display statistics cards:
  - Total Donations count
  - Total Blood Donated (units)
  - Last Donation Date
  - Awards/Achievements

- **FR-037.2:** Donation History Table:
  - Columns: ID, Blood Group, Units, Center, Status, Completion Date
  - Pagination (5/10/25 per page)
  - Year filter dropdown
  - Search functionality

- **FR-037.3:** Export Functionality:
  - Generate PDF of donation history
  - PDF preview modal
  - Download capability
  - Filter by year for export

- **FR-037.4:** Certificate Generation:
  - View certificate for each donation
  - Download as PDF

- **FR-037.5:** Quick Actions:
  - View Details button for each donation
  - Filter controls
  - Export history button

**Route:** `/user/dashboard` (Protected)

---

#### 3.11.3 Hospital Dashboard (FR-038)
**Description:** Dashboard for hospital users to manage blood bank.

**Priority:** High

**Functional Requirements:**
- **FR-038.1:** Hospital Information Card:
  - Hospital Name, Registration ID, Type
  - Year Established, Address, City, District
  - Contact details

- **FR-038.2:** Blood Bank Inventory Display:
  - Cards for all 8 blood groups
  - Current units for each group
  - Color-coded cards
  - Visual indicators

- **FR-038.3:** Update Inventory Modal:
  - Input fields for all 8 blood groups
  - Validation (minimum 0)
  - Save functionality
  - Real-time update on dashboard

- **FR-038.4:** Responsive grid layout for blood group cards

**Route:** `/hospital/dashboard` (Protected)

---

#### 3.11.4 Admin Dashboard (FR-039)
**Description:** Comprehensive admin dashboard with system overview.

**Priority:** Critical

**Functional Requirements:**
- **FR-039.1:** Statistics Cards:
  - Total Donors (with trend)
  - Total Requests (with trend)
  - Approved Requests (with trend)
  - Total Blood Units (with trend)

- **FR-039.2:** Blood Group Distribution Visualization:
  - Horizontal pie chart
  - Percentage calculations
  - Legend with blood groups
  - Color-coded segments

- **FR-039.3:** Animated card hover effects
- **FR-039.4:** Gradient backgrounds for visual appeal
- **FR-039.5:** Real-time data refresh capability

**Route:** `/admin/dashboard` (Protected, Admin only)

---

#### 3.11.5 Admin Blood Inventory Page (FR-040)
**Description:** Dedicated page for viewing total blood inventory.

**Priority:** High

**Functional Requirements:**
- **FR-040.1:** Display total units across all hospitals
- **FR-040.2:** Blood group cards with:
  - Blood group identifier
  - Total units
  - Visual indicators (icons)

- **FR-040.3:** Summary statistics
- **FR-040.4:** Refresh button to update data

**Route:** `/admin/inventory` (Protected, Admin only)

---

#### 3.11.6 Admin Public Requests Page (FR-041)
**Description:** Manage public blood requests (BR- prefix).

**Priority:** High

**Functional Requirements:**
- **FR-041.1:** Data table showing:
  - Request ID, Patient Name, Blood Group
  - Units, Requested By, Contact
  - Status, Created Date

- **FR-041.2:** Filter by status (All, Pending, Accepted, Declined)
- **FR-041.3:** Search functionality
- **FR-041.4:** Status update buttons:
  - Accept button (green)
  - Decline button (red)

- **FR-041.5:** Pagination controls
- **FR-041.6:** Highlight urgent requests

**Route:** `/admin/requests/public` (Protected, Admin only)

---

#### 3.11.7 Admin Hospital Requests Page (FR-042)
**Description:** Manage hospital blood requests (HR- prefix).

**Priority:** High

**Functional Requirements:**
- **FR-042.1:** Data table showing:
  - Request ID, Hospital Name, Blood Group
  - Units, Requested By, Contact
  - Status, Created Date

- **FR-042.2:** Similar features as public requests
- **FR-042.3:** Filter and search capabilities
- **FR-042.4:** Status management

**Route:** `/admin/requests/hospital` (Protected, Admin only)

---

#### 3.11.8 Admin Donors Page (FR-043)
**Description:** View and manage all registered donors.

**Priority:** High

**Functional Requirements:**
- **FR-043.1:** Donor counts by blood group cards
- **FR-043.2:** Click to view donors of specific blood group
- **FR-043.3:** Donor list modal with:
  - Name, Blood Group, Email
  - Contact Number, Area
  - Last Donation Date
  - Pagination

- **FR-043.4:** Send Email action for each donor
- **FR-043.5:** Email modal with subject and message fields

**Route:** `/admin/donors` (Protected, Admin only)

---

#### 3.11.9 Admin Donations Management Page (FR-044)
**Description:** Manage all donation records.

**Priority:** High

**Functional Requirements:**
- **FR-044.1:** Data table with:
  - Donation ID, Donor Name, Email
  - Blood Group, Units, Type
  - Center Name, Status, Date

- **FR-044.2:** Add Donation button/modal:
  - Select donor (dropdown)
  - Donation date, blood group, units
  - Type, center name, status
  - Notes field

- **FR-044.3:** Edit Donation functionality:
  - Update all fields
  - Validation

- **FR-044.4:** Search by donor name, ID, center
- **FR-044.5:** Pagination (10/25/50 per page)

**Route:** `/admin/donations` (Protected, Admin only)

---

#### 3.11.10 Admin Manage Users Page (FR-045)
**Description:** CRUD operations for user and hospital accounts.

**Priority:** High

**Functional Requirements:**
- **FR-045.1:** Tabs for:
  - Users (Donors)
  - Hospitals

- **FR-045.2:** Users table with:
  - All user fields
  - Edit button
  - Delete button (with confirmation)

- **FR-045.3:** Hospitals table with:
  - All hospital fields
  - Edit button
  - Delete button (with confirmation)

- **FR-045.4:** Edit modals for inline updates
- **FR-045.5:** Delete confirmation dialogs
- **FR-045.6:** Search and filter capabilities

**Route:** `/admin/manage-users` (Protected, Admin only)

---

#### 3.11.11 Admin Reports Page (FR-046)
**Description:** Comprehensive reports with analytics.

**Priority:** High

**Functional Requirements:**
- **FR-046.1:** Month/Year selector dropdown
- **FR-046.2:** Metric cards:
  - Total Donations (with growth %)
  - New Donors (with growth %)
  - Blood Collected in units (with growth %)
  - Requests Fulfilled (with growth %)

- **FR-046.3:** Blood Group Distribution Chart:
  - Bar chart or pie chart
  - Percentages and counts

- **FR-046.4:** Monthly Trends Line Chart:
  - Last 6 months
  - Donation counts per month

- **FR-046.5:** Export report as PDF
- **FR-046.6:** Print functionality

**Route:** `/admin/reports` (Protected, Admin only)

---

#### 3.11.12 Admin Settings Page (FR-047)
**Description:** Admin account management and system settings.

**Priority:** Medium

**Functional Requirements:**
- **FR-047.1:** Change Password section:
  - Current password
  - New password
  - Confirm password

- **FR-047.2:** Add New Admin section:
  - Admin ID input
  - Email input
  - Password input

- **FR-047.3:** Form validation
- **FR-047.4:** Success/error toast notifications

**Route:** `/admin/settings` (Protected, Admin only)

---

#### 3.11.13 User Settings Page (FR-048)
**Description:** User profile and password management.

**Priority:** Medium

**Functional Requirements:**
- **FR-048.1:** Profile Update Form:
  - First Name, Last Name
  - Blood Group, Gender
  - Email, Contact Number, Area

- **FR-048.2:** Change Password Form:
  - Current password
  - New password (8-12 chars)

- **FR-048.3:** Save buttons for each section
- **FR-048.4:** Real-time validation
- **FR-048.5:** Toast notifications for success/errors

**Route:** `/user/settings` (Protected, User only)

---

#### 3.11.14 Hospital Settings Page (FR-049)
**Description:** Hospital profile and password management.

**Priority:** Medium

**Functional Requirements:**
- **FR-049.1:** Hospital Profile Form with all fields
- **FR-049.2:** Change Password Form
- **FR-049.3:** Validation and error handling
- **FR-049.4:** Toast notifications

**Route:** `/hospital/settings` (Protected, Hospital only)

---

#### 3.11.15 Hospital Requests Page (FR-050)
**Description:** View hospital's own blood requests and statistics.

**Priority:** Medium

**Functional Requirements:**
- **FR-050.1:** Statistics cards:
  - Total Requests
  - Pending Requests
  - Approved Requests
  - Rejected Requests

- **FR-050.2:** Requests table with:
  - Request ID, Blood Group, Units
  - Requested By, Contact
  - Status, Created Date

- **FR-050.3:** Filter by status
- **FR-050.4:** Real-time status updates

**Route:** `/hospital/requests` (Protected, Hospital only)

---

### 3.12 Authentication & Authorization Features

#### 3.12.1 Protected Routes (FR-051)
**Description:** Enforce access control based on user roles.

**Priority:** Critical

**Functional Requirements:**
- **FR-051.1:** ProtectedRoute component shall:
  - Check for valid token in Redux state
  - Redirect to login if no token
  - Check user role matches required role
  - Redirect to home if role mismatch

- **FR-051.2:** Role-based routing:
  - `/admin/*` requires 'admin' role
  - `/user/*` requires 'user' role
  - `/hospital/*` requires 'hospital' role

- **FR-051.3:** Token persistence:
  - Store in localStorage
  - Load on app mount
  - Clear on logout

---

#### 3.12.2 Logout Functionality (FR-052)
**Description:** Allow users to securely logout.

**Priority:** High

**Functional Requirements:**
- **FR-052.1:** Logout button in navigation
- **FR-052.2:** Clear Redux state
- **FR-052.3:** Remove from localStorage:
  - token
  - user
  - userType

- **FR-052.4:** Redirect to home page
- **FR-052.5:** Show logout confirmation toast

---

### 3.13 UI/UX Features

#### 3.13.1 Toast Notifications (FR-053)
**Description:** Display user-friendly notifications for actions.

**Priority:** Medium

**Functional Requirements:**
- **FR-053.1:** Success toasts (green) for:
  - Successful login/registration
  - Profile updates
  - Password changes
  - Data saves

- **FR-053.2:** Error toasts (red) for:
  - Failed API calls
  - Validation errors
  - Network errors

- **FR-053.3:** Info toasts (blue) for:
  - Loading states
  - Information messages

- **FR-053.4:** Warning toasts (yellow) for warnings

- **FR-053.5:** Auto-dismiss after 3-5 seconds
- **FR-053.6:** Close button on each toast

---

#### 3.13.2 Loading States (FR-054)
**Description:** Provide visual feedback during asynchronous operations.

**Priority:** Medium

**Functional Requirements:**
- **FR-054.1:** Spinner/skeleton loaders for:
  - Dashboard data loading
  - Table data fetching
  - Form submissions

- **FR-054.2:** Button disabled states during submission
- **FR-054.3:** Loading text changes (e.g., "Logging in...")
- **FR-054.4:** Smooth transitions

---

#### 3.13.3 Responsive Design (FR-055)
**Description:** Ensure application works across all device sizes.

**Priority:** High

**Functional Requirements:**
- **FR-055.1:** Tailwind CSS responsive breakpoints:
  - Mobile: 320px - 640px
  - Tablet: 641px - 1024px
  - Desktop: 1025px+

- **FR-055.2:** Responsive navigation:
  - Hamburger menu on mobile
  - Full menu on desktop

- **FR-055.3:** Grid layouts adjust:
  - 1 column on mobile
  - 2-3 columns on tablet
  - 4+ columns on desktop

- **FR-055.4:** Touch-friendly buttons (min 44px)
- **FR-055.5:** Readable font sizes on all devices

---

#### 3.13.4 Animations (FR-056)
**Description:** Enhance user experience with smooth animations.

**Priority:** Low

**Functional Requirements:**
- **FR-056.1:** Framer Motion animations:
  - Fade in on page load
  - Slide in for cards
  - Hover effects on buttons
  - Stagger animations for lists

- **FR-056.2:** Transition duration: 0.3-0.6 seconds
- **FR-056.3:** Smooth page transitions

---

This concludes Part 1 of the SRS document covering Introduction, Overall Description, and all Functional Requirements (System Features).

---

**End of Part 1**

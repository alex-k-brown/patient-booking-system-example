# Patient Appointment Booking System

## Overview

Build a full-stack appointment booking system for healthcare providers.
Target time: 60-90 minutes

## User Story

As a patient, I want to book an appointment with a healthcare provider so that I can receive care for my health concern.

## Tech Stack

- **Frontend:** React + TypeScript
- **Backend:** Node.js + Express + TypeScript
- **Storage:** In-memory (array) or simple JSON file

## Frontend Requirements

### Form Fields

1. Patient name (text input) - required
2. Email (email input) - required, must be valid format
3. Phone number (tel input) - required, must be valid US format (XXX-XXX-XXXX)
4. Provider selection (dropdown) - required
5. Appointment date (date picker) - required, must be future date
6. Appointment time (select from slots) - required
   - Available slots: 9:00 AM, 10:00 AM, 11:00 AM, 2:00 PM, 3:00 PM, 4:00 PM
7. Reason for visit (textarea) - required

### Validation Rules

- All fields are required
- Email must match valid email format
- Phone must match US format: XXX-XXX-XXXX or (XXX) XXX-XXXX
- Date must be today or future (no past dates)
- Time slot must be available (not already booked for that provider/date)
- Minimum reason length: 10 characters

### UI States

- **Loading state:** Show spinner/disable form while submitting
- **Success state:** Display success message after booking
- **Error state:** Display error message on validation or server errors
- **Disabled state:** Disable submit button during loading

### Display Features

- Show list of existing appointments below the form
- Each appointment should display:
  - Patient name
  - Provider name
  - Date (formatted: MM/DD/YYYY)
  - Time (formatted: H:MM AM/PM)
  - Reason for visit

## Backend Requirements

### API Endpoints

#### GET /api/providers

- Returns list of available providers
- Response: `Provider[]`

#### GET /api/appointments

- Returns all booked appointments
- Response: `Appointment[]`

#### GET /api/appointments/available

- Query params: `date` (YYYY-MM-DD), `providerId`
- Returns available time slots for the given provider and date
- Response: `string[]` (array of time strings like ["09:00", "10:00"])

#### POST /api/appointments

- Creates a new appointment
- Request body: `CreateAppointmentRequest`
- Validation:
  - All required fields present
  - Email format valid
  - Phone format valid
  - Date is not in the past
  - Time slot is available (no double-booking)
- Response: Created `Appointment` object
- Error response: `{ error: string }` with appropriate HTTP status

### Business Logic

- Prevent double-booking: Cannot book same provider at same date/time
- Generate unique IDs for appointments
- Store creation timestamp
- Validate all inputs server-side (don't trust client)

### Data Models

```typescript
interface Provider {
  id: string;
  name: string;
  specialty: string;
}

interface Appointment {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  providerId: string;
  date: string; // YYYY-MM-DD
  time: string; // "09:00", "10:00", etc.
  reason: string;
  createdAt: string; // ISO timestamp
}

interface CreateAppointmentRequest {
  patientName: string;
  email: string;
  phone: string;
  providerId: string;
  date: string;
  time: string;
  reason: string;
}
```

## Sample Data

### Providers

```typescript
[
  { id: "1", name: "Dr. Sarah Johnson", specialty: "Primary Care" },
  { id: "2", name: "Dr. Michael Chen", specialty: "Cardiology" },
  { id: "3", name: "Dr. Emily Rodriguez", specialty: "Pediatrics" },
];
```

### Time Slots

```typescript
["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
```

## Success Criteria

- [ ] User can fill out and submit the form
- [ ] All validations work (required fields, formats, future dates)
- [ ] Cannot double-book (same provider/date/time)
- [ ] Appointments display in list after creation
- [ ] Loading and error states work properly
- [ ] Form is properly typed with TypeScript
- [ ] Backend validates all inputs
- [ ] API returns appropriate error messages

## Bonus Features (if time permits)

- [ ] Time slots show as disabled if already booked
- [ ] Form clears after successful submission
- [ ] Basic styling with CSS/Tailwind
- [ ] Sort appointments by date/time
- [ ] Cancel appointment functionality
- [ ] Edit appointment functionality

## Development Notes

- Use AI assistant for boilerplate and syntax help
- Focus on getting it working first, then refine
- Comment your code as you go
- Test each piece as you build it
- Keep it simple - don't over-engineer

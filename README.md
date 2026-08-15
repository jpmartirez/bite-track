# Bite Track - Rabies Case Surveillance System

A web application for managing patient rabies surveillance, tracking animal bite cases, monitoring vaccination compliance, and generating monthly Excel reports. Built with Next.js 16, TypeScript, Tailwind CSS, and Supabase.

---

## Key Features

- **Patient & Bite Surveillance**: Complete registration form for patient demographics, bite details, and biting animal status.
- **Searchable Case Database**: Real-time filtering by patient name and live database record tracking.
- **Comprehensive Case Editor**: View and update all patient details, animal statuses, and vaccination dose schedules within a responsive modal interface.
- **Supabase Cloud Synchronization**: Full asynchronous CRUD operations (Fetch, Add, Edit, Delete) with loading states and LocalStorage fallback.
- **Monthly Excel Reporting**: Export records into `.xlsx` workbooks automatically organized into monthly worksheet tabs (e.g., `August 2026`).

---

## Setup & Installation

### 1. Prerequisites
- Node.js 18.x or higher
- npm or yarn

### 2. Installation

Clone the repository and install project dependencies:

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory (refer to `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
```

*Note: If `.env` credentials are not specified, the application automatically runs in LocalStorage fallback mode.*

### 4. Supabase Database Schema Setup

Execute the following SQL script in your Supabase Dashboard SQL Editor to create the required table and Row Level Security (RLS) policies:

```sql
CREATE TABLE IF NOT EXISTS cases (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  sex TEXT NOT NULL,
  age TEXT NOT NULL,
  income TEXT NOT NULL,
  address TEXT NOT NULL,
  prev_vac TEXT,
  complete_date TEXT,
  bite_source TEXT,
  ownership TEXT,
  wound_type TEXT,
  wound_location TEXT,
  bleeding TEXT,
  wound_care TEXT,
  animal_status TEXT NOT NULL,
  consult TEXT,
  dose1 TEXT,
  dose2 TEXT,
  dose3 TEXT,
  booster TEXT,
  dose1_remark TEXT DEFAULT 'Given',
  dose2_remark TEXT DEFAULT 'Given',
  dose3_remark TEXT DEFAULT 'Given',
  compliance TEXT DEFAULT 'Compliant'
);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read" ON cases FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON cases FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON cases FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete" ON cases FOR DELETE USING (true);
```

---

## Development & Production Commands

### Start Development Server
```bash
npm run dev
```

### Production Build & Deployment Check
```bash
npm run build
npm start
```

---

## Project Structure

```
bite_track/
├── app/                  # Next.js App Router (layout, page, globals.css)
├── components/           # UI Components & Modal Dialogs
│   ├── AnimalBiteForm.tsx
│   ├── BiteTrackApp.tsx
│   ├── CaseDatabaseTable.tsx
│   ├── Header.tsx
│   ├── LoadingSpinner.tsx
│   ├── Modal.tsx
│   ├── PatientInfoForm.tsx
│   └── VaccineDetailsModal.tsx
├── lib/                  # Supabase Client & Database Services
│   ├── casesService.ts
│   └── supabaseClient.ts
├── types/                # TypeScript Type Definitions
│   └── rabies.ts
└── utils/                # Utility Modules (Excel Exporter)
    └── excelExporter.ts
```

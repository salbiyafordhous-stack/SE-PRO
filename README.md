# 🎓 EduResolve – Online Student Complaint & Ticket Management Helpdesk System

> A modern, responsive, interactive full-featured Helpdesk and Grievance Redressal Web Application designed for universities, colleges, and educational institutions.

![EduResolve Banner](https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80)

---

## 🚀 Key Features

### 👨‍🎓 1. Student Grievance Redressal Portal
- **Intuitive Ticket Submission**:
  - Categories: IT & Campus Wi-Fi, Hostel & Living, Academic & Faculty, Examinations & Grading, Finance & Scholarships, Library, Cafeteria, Safety & Grievance.
  - Priority SLA Guarantees: **Urgent** (6 Hours), **High** (24 Hours), **Medium** (48 Hours), **Low** (72 Hours).
  - Exact Location tracking (Hostel Block, Room No, Laboratory, Campus Wing).
  - **Anonymous Grievance Option**: Conceals student identity and prevents retaliation for sensitive complaints.
  - Attachment upload preview simulator (screenshots, marksheets, bills).
- **Instant AI / FAQ Deflection**: Suggests immediate solutions from the knowledge base in real-time as the student types the complaint title.
- **Real-Time Ticket Tracking**: Interactive progression stepper (`Submitted` ➔ `In Review` ➔ `In Progress` ➔ `Resolved` ➔ `Closed`).
- **Student Escalation**: Direct one-click escalation to the Dean of Student Welfare if SLA time limits are breached.
- **Feedback & Rating**: 5-star rating system with celebratory confetti on resolution.

### 🗳️ 2. Campus Community Consensus Board
- **Shared Campus Issue Upvoting**: Students can view and upvote common campus problems (e.g., *Hostel Block C Wi-Fi downtime*, *Library AC malfunction*).
- Prevents 50 duplicate complaints for the same infrastructure issue and gives administration a clear consensus priority list.

### 🛠️ 3. Support Staff & Department Officer Workspace
- Filter tickets assigned to specific departments (Campus IT, Facilities, Accounts, Examinations).
- Update ticket status, reassign department officers, and dispatch technicians.
- **Two-Way Discussion Thread**: Real-time message exchange between student and support officers.
- **Internal Confidential Staff Notes**: Private investigation logs and technician notes visible strictly to university staff.

### 📊 4. Administration & Dean SLA Governance Dashboard
- **Real-Time Metrics & KPIs**: Total complaints, Active investigations, Resolution rate (%), and SLA breach counts.
- **Department Breakdown**: Visual distribution bars across campus categories.
- **1-Click CSV Export**: Download all complaints into standard spreadsheet format (`.csv`).
- **Printable Executive Summary**: Print-ready grievance audit report.

### 📚 5. Interactive Knowledge Base & FAQs
- Categorized self-service articles for instant resolution (Wi-Fi configuration, exam re-evaluation, scholarship hold, etc.).
- "Was this helpful?" feedback voting.

### 🎭 6. Built-in Role Switcher (Demo Mode)
- Switch seamlessly between:
  - **Alex Morgan** (Student – Computer Science 3rd Year)
  - **Officer Ramesh Nair** (Support Staff – Campus IT & Networks)
  - **Dr. Eleanor Vance** (Admin – Dean of Student Welfare)

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS v4
- **Icons**: Lucide Icons
- **Effects**: Canvas Confetti
- **State Management**: Reactive React Hooks with persistent `localStorage` support
- **Deployment**: GitHub Pages (via `gh-pages` and GitHub Actions `.github/workflows/deploy.yml`)

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd student-helpdesk
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start local development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Deployment to GitHub Pages

### Method A: Automated GitHub Actions (Recommended)
1. Push this repository to GitHub on branch `main`.
2. In your GitHub repository:
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, choose **GitHub Actions**.
3. The included workflow `.github/workflows/deploy.yml` will automatically build and publish your site!

### Method B: Manual One-Click CLI Deployment
Run:
```bash
npm run deploy
```
This builds the site and pushes the `dist/` folder to the `gh-pages` branch on your GitHub repository.

---

## 📄 License
This project is open-source under the MIT License.

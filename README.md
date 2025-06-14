# ApplyMandu Frontend

This is the frontend application for **ApplyMandu**, a dynamic job portal connecting employers and job seekers. It is built using **Next.js (App Router)** and integrates deeply with the Laravel-powered backend API.

---

## 🌐 Features

* User dashboards for Employers, Job Seekers, and Admins
* Job browsing, searching, and application submission
* Resume builder and management
* Admin panel with full control over users, jobs, blogs, etc.
* Calendar views for interview scheduling
* Authentication and email verification flows

---

## 🧱 Folder Structure

Key pages and components are organized by role and route:

### Public Pages

* `/` – Homepage
* `/about` – About the platform
* `/companies` – Browse companies
* `/resources` – Blog/resource section
* `/search` – Job search interface
* `/jobs` – Job listing
* `/jobs/[slug]` – Job detail page
* `/verify-email/[token]` – Email verification

### Auth & Dashboard

* `/dashboard/` – Common dashboard landing

#### Employer Dashboard (`/dashboard/employer`)

* Analytics, API access, calendar, job listings, applications
* Resume search, settings, trashed jobs, candidate details

#### Job Seeker Dashboard (`/dashboard/jobseeker`)

* Alerts, saved jobs, applications, resume management

#### Resume Components

* Personal details, education, experience, additional details

### Admin Panel (`/(admin)/admin`)

* Admin login: `/(admin)/admin-login`
* Manage users, roles, blogs, jobs, categories, reports, settings

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/subodhwork21/applymandu-frontend.git
cd applymandu-frontend
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set Environment Variables

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Update it with API URLs and necessary keys:

```
NEXT_PUBLIC_API_BASE_URL=https://api.applymandu.com
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=...
```

### 4. Run the Dev Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
npm run start
```

---

## 🧪 Testing

Coming soon: Integration with Cypress and Playwright for end-to-end testing.

---

## 🎨 Styling & Assets

* Global styles: `globals.css`, `calendar.css`
* Component-level styling using Tailwind CSS

---

## 📄 License

This project is proprietary. All rights reserved by ApplyMandu.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit changes with descriptive messages
4. Submit a pull request

---

## 📬 Contact

For issues, feature requests, or support, contact the ApplyMandu dev team.

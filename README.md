# 🧩 Lead Management API Platform

This project is a full-stack web application for managing marketing leads using a secure, API key–based system. Admins can generate and revoke API keys for clients, who can then integrate with the lead-creation API. The system includes authentication, permissions, and a flexible data structure for custom fields.

---

## 📦 Tech Stack

### Frontend:
- **Next.js** – Server-side rendering, routing, and frontend logic
- **Tailwind CSS / Chakra UI** – Styling
- **React Query / SWR** – Data fetching (optional)
- **Axios** – HTTP requests

### Backend:
- **Express API routes** – Used for API and server-side logic
- **MongoDB + Mongoose** – Database & ORM
- **JWT** – Authentication
- **Nodemailer** – Email notifications (e.g., key generation)

---

## 🧩 Features

### Admin
- Login
- Manage users (clients)
- Generate, revoke, and expire API keys
- View all leads
- Search/filter by client or lead status

### Client
- Register/Login
- Create and manage leads via UI or API
- View assigned leads from other clients
- Flexible field structure (via `extraFields`)
- Invite other clients and share lead access
- assign permission to clients

### Leads
- Status management: `new`, `contacted`, `converted`, `lost`
- Flexible `extraFields` per lead
- Notes/messages for internal usage

---

## 🔐 Authentication & Security

- **JWT** for secure login/session handling
- **API Key** system for client-side lead creation
- API key expiry, revocation, and regeneration
- Permissions: `read`, `add`, `edit`, `delete`

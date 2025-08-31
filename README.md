# 🧩 Lead Management API Platform

A full-stack web application designed to **manage marketing leads efficiently** using a secure, API key–based system. Admins can generate and revoke API keys for clients, who can then integrate seamlessly with the lead-creation API. The platform supports **authentication, permissions, and a flexible lead structure** with custom fields.

---

## 📦 Tech Stack

### Frontend

* **Next.js** – Server-side rendering and frontend logic
* **Tailwind CSS** – Modern, responsive styling
* **React Query / SWR** – Data fetching and caching
* **Axios** – HTTP requests

### Backend

* **Express.js** – API and server-side logic
* **MongoDB + Mongoose** – Database and ORM
* **JWT** – Authentication and secure access
* **Nodemailer** – Email notifications for key generation and alerts

---

## 🧩 Features

### 🔹 Admin Panel

* Login and secure access
* Manage clients/users
* Generate, revoke, and expire API keys
* View all leads across clients
* Search and filter leads by client or status

### 🔹 Client Portal

* Register and login
* Create and manage leads via **UI or API**
* View assigned leads from other clients
* Flexible `extraFields` per lead for custom data
* Invite other clients and manage **permissions**
* Assign lead access and control sharing

### 🔹 Lead Management

* Track lead **statuses**: `new`, `contacted`, `converted`, `lost`
* Flexible `extraFields` for dynamic data
* Add notes or messages for internal tracking

---

## 🔐 Authentication & Security

* Secure login via JWT
* Role-based access control (Admin / Client)
* API key protection for client integrations
* Encrypted sensitive data and email notifications

---

## 🚀 Getting Started

### Prerequisites

* Node.js >= 18
* MongoDB database
* npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lead-management-api.git
cd lead-management-api

# Install dependencies
pnpm install

# Create .env file
cp .env.example .env

# Run the development server
npm run dev
```

## 📈 Future Improvements

* Real-time lead updates via **Socket.IO**
* Analytics dashboard for leads performance
* Export/import leads (CSV/Excel)
* Webhooks for external integrations

---

## 💡 License

MIT License – free to use and modify
Do you want me to do that?

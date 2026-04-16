#  Performance Management System (PMS) 

##  Overview

This project is a **Enterprise Performance Management System (PMS)** designed to streamline employee performance tracking, feedback workflows, and probation management.

It provides a **role-based, scalable and automated solution** for organizations to manage:

* 🎯 Goals
* 💬 Feedback
* 🚨 Performance Flags
* ⚙️ Probation Automation
* 📊 Admin Insights

---

## 🎯 Key Features

### 🔐 Role-Based Authentication

* JWT-based secure authentication
* Roles: **Employee, Manager, Admin**
* Protected API routes

---

### 🎯 Goal Management System (GMS)

* Employees can create goals
* Managers approve/reject goals
* Progress tracking (0–100%)
* Goal lifecycle: `Pending → Active → Completed`

---

### 💬 Feedback System

* Manager ↔ Employee feedback
* Rating + comments
* Cycle-based feedback (quarterly, etc.)

---

### 🚨 Flag System (Automated Risk Detection)

* Automatically triggered when **rating ≤ 2**
* Helps identify underperforming employees
* Visible to Admin

---

### ⚙️ Automation Engine (Core Feature)

* Tracks employee probation cycles
* Automatically triggers:

  * Day 30
  * Day 60
  * Day 80

---

### 🔔 Reminder & Escalation System

* Automated reminders at:

  * +2 days
  * +4 days
  * +6 days
* Escalation after 7 days of inactivity

---

### 📊 Admin Insights

* Total feedback count
* Average rating
* Low-performance detection

---

## 🏗️ Tech Stack

| Layer          | Technology            |
| -------------- | --------------------- |
| Backend        | Node.js, Express.js   |
| Database       | PostgreSQL (Supabase) |
| ORM            | Prisma                |
| Authentication | JWT                   |
| Automation     | node-cron             |

---

## 🧩 System Architecture

```text
Client (Postman)
      ↓
Express Server
      ↓
Middleware (Auth + Role)
      ↓
Controllers
      ↓
Prisma ORM
      ↓
Supabase PostgreSQL
```

---

## 🗄️ Database Models

* **User** (Employee, Manager, Admin)
* **Goal**
* **Task**
* **Feedback**
* **Flag**
* **Probation**
* **ReviewCycle**

---

## 🔁 Core Workflows

### 🎯 Goal Flow

```
Employee → Create Goal → Manager Approves → Employee Updates Progress
```

---

### 💬 Feedback → Flag Flow

```
Manager gives feedback → Rating ≤ 2 → Flag automatically created → Admin reviews
```

---

### ⚙️ Automation Flow

```
Joining Date → Day 30/60/80 → Probation Trigger → Reminders → Escalation
```

---

## 🔐 Security Features

* Password hashing using bcrypt
* JWT-based authentication
* Role-based access control
* Protected routes

---

## ⚠️ Edge Case Handling

* ❌ Self-feedback restricted
* ❌ Unauthorized access blocked
* ❌ Invalid token handling
* ❌ Progress > 100 prevented
* ❌ Duplicate automation triggers avoided

---

## 🧪 Testing

Tested using:

* Postman (API testing)
* Prisma Studio (DB visualization)
* Supabase Dashboard (live DB verification)

---

## ▶️ Getting Started

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/pms-platform.git
cd pms-platform/backend
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Setup Environment Variables

Create `.env` file:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

---

### 4️⃣ Run Prisma

```bash
npx prisma generate
npx prisma db push
```

---

### 5️⃣ Start Server

```bash
npm run dev
```

---

## 📈 Future Enhancements

* 📧 Email Notifications (Nodemailer)
* 📊 Frontend Dashboard (React)
* 🤖 AI-based performance insights
* 📱 Mobile app integration

---

## 👩‍💻 Author

**Shivangi Jindal**

---

## ⭐ Contribution

Feel free to fork, contribute, or raise issues.

---

## 📄 License

This project is for educational and demonstration purposes.

---

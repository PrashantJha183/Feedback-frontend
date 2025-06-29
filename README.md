# Feedback-frontend

This is the frontend of the Feedback Management System built with **React.js** and **Tailwind CSS**. It enables managers and employees to interact with the system through a modern and responsive UI.

---

## 🚀 Tech Stack

- **React.js**
- React Router
- Tailwind CSS
- HeroIcons
- Fetch API

---

## ✨ Features

✅ **Authentication / Session Handling**

- Store manager or employee ID in session storage for navigation and operations

✅ **Dashboard for Managers**

- Submit feedback for employees
- View feedback requests from employees
- Mark requests as seen
- View feedback given to employees
- Notifications for:
  - feedback acknowledged
  - employee comments

✅ **Dashboard for Employees**

- View feedback from managers
- Acknowledge feedback
- Comment on feedback
- Request feedback from managers
- View notifications
- Export feedback history as PDF

✅ **Feedback Form**

- Sentiment selection (positive, neutral, negative)
- Strengths and improvement text inputs
- Optional tags
- Submits feedback to FastAPI backend

✅ **Notifications System**

- View unseen and seen notifications
- Mark individual or all notifications as seen

✅ **Responsive UI**

- Tailwind CSS ensures layout works well on desktop and mobile

---

## 🔧 Running the Frontend Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/PrashantJha183/Feedback-frontend
   cd my-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development serve:

   ```bash
   npm run dev
   ```

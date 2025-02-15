# School Management App

The School Management App is a comprehensive solution designed to streamline and automate the administrative tasks of educational institutions. The application caters to various users such as administrators, teachers, students, offering a centralized platform for managing schedules, attendance, assignments, and communication.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Contact](#contact)

## Features

- **User Authentication:** Secure login system with role-based access for administrators, teachers, students, and parents.
- **Class Allocation:** Efficient management of class and related data.
- **Assignments & Grading:** Creation, submission, and grading of assignments.
- **Reports & Analytics:** Generate detailed reports and performance analytics.
- **Responsive Design:** Mobile-friendly interface ensuring accessibility across all devices.
- **Multilingual Support:** Catering to a diverse user base with multiple language options.

## Technologies Used

- **Frontend:** React 
- **Backend:** Node.js 
- **Database:** MongoDB Atlas
- **Authentication:** JWT 
- **Deployment:** Vercel, Render
- **Other Tools:** Tailwind CSS

## Installation

### Prerequisites

- Node.js (v12 or higher) 
- A database server MongoDB
- Git

### Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/pratikmehakare/school-management-app.git
   cd school-management-app
2. **Install Frontend Dependencies:**

   ```bash
   npm install
3. **Install Backend Dependencies:**

   ```bash
    cd backend
    npm install
4. **Configure Environment Variables:**

    Create a .env file in the backend and add the necessary configurations:

        PORT= 4000
        MONGO_URI = Enter your url
        JWT_SECRET = Enter your jwt_scret

    Create a .env file in the project root and add the necessary configurations: 

        REACT_APP_API_URL  = YOUR_BACKEND_URL/api/v1

5. **Run the Application:**

    For development:

        npm run dev

    For production:

        npm start

## Contact
For questions or support, please contact:

    Maintainer: Pratik Mehakare
    GitHub Repository: https://github.com/pratikmehakare/school-management-app
🏥 MERN Hospital Management System

    A full‑stack hospital management application built with the MERN stack (MongoDB, Express, React, Node.js).
    It supports six distinct user roles – Patient, Doctor, Receptionist, Lab Technician, Admin, and Cleaning Staff – each with a tailored dashboard and permissions.
    The system includes appointment booking, availability management, lab requests, AI‑powered skin scanning, cleaning task assignment, and supply requests.

✨ Features

    👤 Patient
        Register and manage profile (name, password, delete account)

        Book appointments with doctors (15‑minute slots, availability check)

        View upcoming and past appointments

        Give feedback (rating + comment) on completed appointments

        Use AI skin scanner: upload or capture an image, receive a demo analysis

        View past skin scans and analysis results

    👨‍⚕️ Doctor
        Register and manage profile

        Set availability slots (start/end time, 30‑minute increments)

        View own appointments and update status (complete / cancel)

        View feedback received from patients
        
        Create lab requests for patients (test type, description)
        
        View completed lab request results (file / text)

    🧑‍💼 Receptionist
        Register and manage profile
        
        Book appointments for registered or unregistered patients (auto‑creates patient account)
        
        View all appointments
        
        Use AI skin scanner on behalf of patients (select existing patient or create new one)
        
        Full CRUD on cleaning tasks:
        
        Create, read, update, delete tasks
        
        Assign to cleaning staff, set area, date, description, status

    🔬 Lab Technician
        Register and manage profile
        
        View pending and accepted lab requests
        
        Accept a pending request
        
        Complete a request by uploading a result file and/or adding result text

    🛡️ Admin
        Register and manage profile
        
        Full CRUD on all users (create, edit, delete any role)
        
        View all appointments and delete any appointment
        
        View all feedback and delete any feedback
        
        Full CRUD on cleaning tasks (same as receptionist)
        
        Manage supply requests from cleaning staff (update status: pending → approved →                  delivered)

    🧹 Cleaning Staff
        Login (account created by admin/receptionist)

        Manage profile
        
        View assigned cleaning tasks (grouped by date)
        
        Mark tasks as completed (optional notes)
        
        Request cleaning supplies (item name, quantity, notes)
        
        View personal supply request history with status (pending, approved, delivered)

🛠️ Tech Stack


    Layer	            Technologies
    Frontend	        React (Vite), React Router DOM, Axios, React Icons, Tailwind CSS
    Backend	            Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt, Multer
    Database	        MongoDB (local or Atlas)
    Tools	            Nodemon, dotenv, Git

📋 Prerequisites

    Node.js (v16 or higher)
    
    npm or yarn
    
    MongoDB (local installation or MongoDB Atlas account)

🚀 Installation & Setup

    1. Clone the repository

        git clone https://github.com/your-username/hospital-management-system.git
        cd hospital-management-system

    2. Backend Setup

        cd backend
        npm install
        npm install mongodb
        npm install cloudinary multer-storage-cloudinary

        Create a .env file in the backend folder:

        PORT=5000
        MONGO_URI=mongodb://127.0.0.1:27017/hospitalDB
        JWT_SECRET=your_super_secret_key_here

        PORT=5000
        MONGO_URI=mongodb://127.0.0.1:27017/hospitalDB
        JWT_SECRET=your_super_secret_key_here

        If using MongoDB Atlas, replace MONGO_URI with your connection string.

        
    3. Frontend Setup
    
        Open a new terminal and navigate to the frontend folder:

            cd ../frontend
            npm install

        Create a .env file in the frontend folder:

            VITE_API_URL=http://localhost:5000/api

        
▶️ Running the Application

    Start Backend Server

        cd backend
        npm run dev

        Server runs on http://localhost:5000

    Start Frontend Dev Server

        cd frontend
        npm run dev

        Frontend runs on http://localhost:5173 (default Vite port).

📁 Project Structure

    hospital-management-system/
    ├── backend/
    │   ├── config/               # Database connection
    │   ├── controllers/           # Business logic
    │   │   ├── admin/              # Admin controllers
    │   │   └── ...                 # Other role controllers
    │   ├── middleware/             # Auth, file upload
    │   ├── models/                 # Mongoose models
    │   ├── routes/                 # API routes
    │   ├── uploads/                # Uploaded files
    │   ├── utils/                   # JWT helper
    │   ├── .env
    │   ├── package.json
    │   └── server.js
    └── frontend/
        ├── public/
        ├── src/
        │   ├── api/                 # Axios instance
        │   ├── components/           # PrivateRoute, etc.
        │   ├── contexts/             # AuthContext
        │   ├── pages/                # All page components
        │   │   ├── admin/
        │   │   ├── authentication/
        │   │   ├── cleaningStaff/
        │   │   ├── common/
        │   │   ├── doctor/
        │   │   ├── lab_technician/
        │   │   ├── patient/
        │   │   ├── receptionist/
        │   │   └── Home.jsx
        │   ├── App.jsx
        │   ├── AppRoutes.jsx
        │   ├── index.css
        │   └── main.jsx
        ├── .env
        ├── index.html
        ├── package.json
        └── vite.config.js

🔌 API Endpoints (Summary)

    All routes are prefixed with /api. Protected routes require a Bearer token obtained from         /auth/login.

    Method	    Endpoint	                    Description	                                    Access (roles)
    
    POST	    /auth/register	                Register a new user	                            Public
    POST	    /auth/login	                    Login and receive token	                        Public
    GET	        /users/profile	                Get logged‑in user profile	                    All authenticated
    PUT	        /users/profile	                Update profile	                                All authenticated
    DELETE	    /users/profile	                Delete own account	                            All authenticated
    GET	        /users/patients	                List patients	                                receptionist, admin, doctor
    GET	        /users/cleaning-staff	        List cleaning staff	                            receptionist, admin
    POST	    /users/patients	                Create a patient	                            receptionist only
    POST	    /appointments	                Book appointment	                            patient
    POST	    /appointments/receptionist	    Book for patient	                            receptionist
    GET	        /appointments/patient	        Patient’s appointments	                        patient
    GET	        /appointments/doctor	        Doctor’s appointments	                        doctor
    GET	        /appointments/all	            All appointments	                            receptionist, admin
    PUT	        /appointments/:id	            Update status	                                doctor
    GET	        /appointments/doctors	        List doctors with ratings	                    authenticated
    POST	    /availability	                Add availability slot	                        doctor
    GET	        /availability	                Get doctor’s own slots	                        doctor
    DELETE	    /availability/:id	            Delete a slot	                                doctor
    GET	        /availability/doctor/:doctorId	Get slots for a specific date	                authenticated
    POST	    /feedback	                    Create feedback	                                patient
    GET	        /feedback/doctor	            Doctor’s feedback	                            doctor
    GET	        /feedback/doctor/:doctorId	    Public feedback for a doctor	                authenticated
    GET	        /feedback/patient	            Patient’s own feedback	                        patient
    POST	    /lab-requests	                Create lab request	                            doctor
    GET	        /lab-requests/doctor	        Doctor’s requests	                            doctor
    GET	        /lab-requests/lab	            View for lab technician	                        lab technician
    PUT	        /lab-requests/:id/accept	    Accept a request	                            lab technician
    PUT	        /lab-requests/:id/complete	    Complete with file/text	                        lab technician
    GET	        /lab-requests/:id	            Get single request	                            doctor/lab technician
    POST	    /skin-images	                Upload image	                                patient, receptionist
    GET	        /skin-images	                Get user’s images	                            patient, receptionist
    DELETE	    /skin-images/:id	            Delete an image	                                patient, receptionist
    POST	    /cleaning-tasks	                Create task	                                    admin, receptionist
    GET	        /cleaning-tasks	                Get all tasks	                                admin, receptionist
    GET	        /cleaning-tasks/my	            Get assigned tasks	                            cleaning staff
    PUT	        /cleaning-tasks/:id	            Update task	                                    admin, receptionist
    PUT	        /cleaning-tasks/:id/complete	Mark as completed	                            cleaning staff
    DELETE	    /cleaning-tasks/:id	            Delete task	                                    admin, receptionist
    POST	    /supply-requests	            Create request	                                cleaning staff
    GET	        /supply-requests/my	            Staff’s own requests	                        cleaning staff
    GET	        /supply-requests	            Get all requests	                            admin
    PUT	        /supply-requests/:id	        Update status	                                admin
    GET	        /admin/users	                List all users	                                admin
    POST	    /admin/users	                Create user	                                    admin
    PUT	        /admin/users/:id	            Update user	                                    admin
    DELETE	    /admin/users/:id	            Delete user	                                    admin
    GET	        /admin/appointments	            All appointments	                            admin
    DELETE	    /admin/appointments/:id	        Delete appointment	                            admin
    GET	        /admin/feedback	                All feedback	                                admin
    DELETE	    /admin/feedback/:id	            Delete feedback	                                admin

🧪 Usage Guide

    Open http://localhost:5173 in your browser.

    Use the registration links to create an account for any role (patient, doctor, receptionist, lab technician, admin, cleaning staff).
    Note: Cleaning staff accounts can also be created by admin or receptionist.

    Log in with your email and password.

    You will be redirected to your role‑specific dashboard.

    Explore the features available to your role:

    Patient: Book appointments, view history, give feedback, use AI scanner.

    Doctor: Set availability, manage appointments, create lab requests.

    Receptionist: Book appointments for anyone, manage cleaning tasks.

    Lab Technician: Accept and complete lab requests.

    Admin: Manage users, appointments, feedback, cleaning tasks, supply requests.

    Cleaning Staff: View and complete tasks, request supplies.

    Use the logout button to end your session.

🔮 Future Enhancements

    Add real‑time notifications (socket.io) for new tasks/requests.

    Implement email notifications for appointment confirmations and lab results.

    Add a full reporting dashboard for admin (charts, statistics).

    Integrate a payment gateway for billing.

    Expand the AI scanner with real ML model integration.

    Add two‑factor authentication for enhanced security.

📄 License

    This project is for educational and demonstration purposes only. It is not intended for production use without further security, compliance, and testing reviews.

📧 Contact

    For questions or support, please contact:
    Kokulan Kugathasan
    kokulankugathasan2003@gmail.com
    LinkedIn - www.linkedin.com/in/kokulan-kugathasan
    Whatsapp - +94 767520033
    
    

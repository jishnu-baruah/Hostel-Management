# Hostel Management App - MVP 1 PRD

## 📌 Overview

The Hostel Management App MVP 1 is a mobile-first platform designed to digitize core hostel operations. Built with React Native Expo for mobile and Express.js + MongoDB for backend, it streamlines student onboarding, room management, rent payments, announcements, and complaint handling.

**Target Timeline:** 8-10 weeks  
**Tech Stack:** React Native Expo, Express.js, MongoDB  
**Primary Goal:** Validate market demand while solving immediate hostel management pain points

**For Owners:** Reduces manual paperwork by 50%, automates rent collection, and provides digital complaint tracking.

**For Students:** Offers convenient registration, transparent room allocation, easy rent payments, and direct communication channels.

## ⚙️ Core Functionality

### 1. Student Registration

**What It Does:** Enables new students to register digitally, upload required documents, select rooms, and pay advance fees through the mobile app.

**Key Features:**
- Multi-step registration form with validation
- Document upload (ID proof, college ID) via camera/gallery
- Real-time room availability and selection
- Integrated payment processing with Razorpay
- Admin approval workflow with notifications

**User Flow:**
```
Download App → Create Account → Fill Personal Details → Upload Documents → 
Select Available Room → Pay Advance → Wait for Admin Approval → Account Activated
```

**Benefits:**
- **Owner/Admin:** Eliminates physical paperwork, maintains organized digital records, speeds up admission process
- **Students:** 24/7 registration access, transparent room selection, instant payment confirmation

### 2. Room Management

**What It Does:** Provides comprehensive room inventory management with real-time occupancy tracking and assignment capabilities.

**Key Features:**
- Interactive room list with availability status
- Room details (capacity, rent, amenities, current occupants)
- Admin tools for room assignment and reassignment
- Student view of assigned room and roommate details
- Room status management (available/occupied/maintenance)

**Admin Capabilities:**
- View all rooms with occupancy dashboard
- Assign students to specific rooms
- Change room assignments as needed
- Mark rooms for maintenance or block availability
- Generate occupancy reports

**Benefits:**
- **Owner/Admin:** Optimized room utilization, easy assignment management, clear occupancy overview
- **Students:** Transparent room allocation, roommate information access, easy room change requests

### 3. Rent Payment & Tracking

**What It Does:** Automates monthly rent collection with online payment options, digital receipts, and comprehensive payment tracking.

**Key Features:**
- Monthly rent dashboard with due dates
- Multiple payment options (UPI, cards, net banking)
- Automatic receipt generation and download
- Payment history with search and filter
- Automated payment reminders via notifications
- Late fee calculation and application

**Payment Process:**
```
View Monthly Dues → Select Payment Method → Complete Payment → 
Generate Receipt → Update Payment Status → Send Confirmation
```

**Benefits:**
- **Owner/Admin:** Improved cash flow, reduced collection time, automated tracking, digital records
- **Students:** Convenient payment options, instant receipts, transparent billing, no physical follow-ups

### 4. Notice Board / Announcements

**What It Does:** Centralized communication platform for instant information distribution from hostel management to all residents.

**Key Features:**
- Rich text announcements with priority levels
- Category-based organization (general, urgent, maintenance, events)
- Push notifications for new announcements
- Read receipt tracking for important notices
- Search and filter functionality for old announcements

**Admin Features:**
- Create and schedule announcements
- Set priority levels (low, medium, high, urgent)
- Target specific student groups or broadcast to all
- Track read status and engagement
- Edit or delete existing announcements

**Benefits:**
- **Owner/Admin:** Instant communication to all residents, reduced phone calls, compliance tracking
- **Students:** Never miss important updates, organized information access, timely notifications

### 5. Complaint / Maintenance Request System

**What It Does:** Digital ticketing system for students to report issues and track resolution progress with photo documentation.

**Key Features:**
- Categorized complaint submission (electrical, plumbing, cleanliness, etc.)
- Photo attachment for visual documentation
- Real-time status tracking (open → in-progress → resolved)
- Priority level assignment based on urgency
- Rating system for completed resolutions
- Admin dashboard for complaint management

**Complaint Categories:**
- Room maintenance (electrical, plumbing, furniture)
- Common area issues (WiFi, cleanliness, lifts)
- Security concerns
- Facility requests
- Other general complaints

**Workflow:**
```
Submit Complaint → Admin Receives Notification → Status Updates → 
Resolution Work → Mark Complete → Student Rating → Close Ticket
```

**Benefits:**
- **Owner/Admin:** Organized issue tracking, prioritized resolution, performance metrics, student satisfaction data
- **Students:** Easy issue reporting, transparent progress tracking, photo documentation, feedback mechanism

## 📚 Docs

### API Documentation

#### Authentication Endpoints
```
POST /api/auth/register - Student registration
POST /api/auth/login - User login
POST /api/auth/admin-login - Admin login
GET /api/auth/verify - Verify JWT token
```

#### Student Management
```
GET /api/students - Get all students (admin)
GET /api/students/profile - Get student profile
PUT /api/students/profile - Update student profile
POST /api/students/documents - Upload documents
```

#### Room Management
```
GET /api/rooms - Get all rooms
GET /api/rooms/available - Get available rooms
POST /api/rooms/assign - Assign student to room (admin)
PUT /api/rooms/:id - Update room details
```

#### Payment System
```
GET /api/payments/student/:id - Get student payment history
POST /api/payments/create - Create payment order
POST /api/payments/verify - Verify payment completion
GET /api/payments/receipt/:id - Download payment receipt
```

#### Notice Board
```
GET /api/notices - Get all notices
POST /api/notices - Create new notice (admin)
PUT /api/notices/:id/read - Mark notice as read
DELETE /api/notices/:id - Delete notice (admin)
```

#### Complaint System
```
GET /api/complaints - Get complaints (filtered by user role)
POST /api/complaints - Submit new complaint
PUT /api/complaints/:id/status - Update complaint status (admin)
POST /api/complaints/:id/rating - Rate resolved complaint
```

### Database Schema Documentation

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  password: String, // bcrypt hashed
  role: String, // 'student' | 'admin'
  college: String,
  course: String,
  year: Number,
  roomId: ObjectId,
  documents: [{
    type: String, // 'id_proof' | 'college_id'
    url: String,
    uploadedAt: Date
  }],
  isApproved: Boolean,
  registrationDate: Date,
  lastActive: Date
}
```

#### Rooms Collection
```javascript
{
  _id: ObjectId,
  roomNumber: String,
  floor: Number,
  capacity: Number,
  currentOccupancy: Number,
  monthlyRent: Number,
  securityDeposit: Number,
  amenities: [String], // ['AC', 'WiFi', 'Attached Bathroom']
  status: String, // 'available' | 'occupied' | 'maintenance'
  occupants: [ObjectId],
  createdAt: Date
}
```

#### Payments Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  roomId: ObjectId,
  amount: Number,
  type: String, // 'rent' | 'security_deposit' | 'maintenance'
  month: String, // 'YYYY-MM'
  razorpayOrderId: String,
  razorpayPaymentId: String,
  status: String, // 'pending' | 'completed' | 'failed'
  dueDate: Date,
  paidAt: Date,
  lateFee: Number,
  receiptUrl: String
}
```

#### Notices Collection
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  priority: String, // 'low' | 'medium' | 'high' | 'urgent'
  category: String, // 'general' | 'maintenance' | 'events'
  createdBy: ObjectId,
  readBy: [{
    userId: ObjectId,
    readAt: Date
  }],
  isActive: Boolean,
  createdAt: Date,
  scheduledFor: Date // optional
}
```

#### Complaints Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  roomId: ObjectId,
  category: String, // 'electrical' | 'plumbing' | 'cleanliness' | 'security' | 'other'
  title: String,
  description: String,
  priority: String, // 'low' | 'medium' | 'high' | 'urgent'
  photos: [String], // URLs to uploaded images
  status: String, // 'open' | 'in_progress' | 'resolved' | 'closed'
  assignedTo: ObjectId, // staff member ID
  resolution: String,
  rating: Number, // 1-5 scale
  createdAt: Date,
  updatedAt: Date,
  resolvedAt: Date
}
```

### Environment Variables
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://komolacandraw:zyRcelm3BUCWD0Xc@cluster0.gdoz2si.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# JWT
JWT_SECRET=0189c371824ee589683c11602a54ab902e49cde85ff19284c872dfcee6ec2dd77cef510c68f6195b1bfef8751a7a7dac4912075cf4d5091f0c6cb355dd8d6de7474c26fd3c058bd28ef5695c8659bd9b9aef857b6e600c237f9497c342fb68484bf6bb0a8fbea3da8af27324d90cf62498ae97359e0fbcd04897bc2a444c91e59ae398ab23639d946b5c7f197fc6397ca64a42ebd881fcf92cdf9e3ed5722d65e9b336c0421ae339f0cf758cb57e90ebde85955cf338b685d9692b2c62f0e39fb0be6bc63b01dc3b0b0a3baebb9d2977131bfcc82105e480b8edf2730ff021c71980dc87aecf58708348ff1384e172bd459c0927ed1cb4885acbf6136d673d58

JWT_EXPIRE=7d

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880 # 5MB

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=komolacandraw@gmail.com
EMAIL_PASS=Esmeralda@123.


# Push Notifications
EXPO_ACCESS_TOKEN=your_expo_access_token
```

### Mobile App Configuration
```javascript
// app.config.js
export default {
  expo: {
    name: "Hostel Manager",
    slug: "hostel-manager",
    version: "1.0.0",
    platforms: ["ios", "android"],
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#2E86AB"
    },
    notifications: {
      icon: "./assets/notification-icon.png",
      color: "#2E86AB"
    },
    android: {
      package: "com.hostelmanager.app",
      versionCode: 1
    },
    ios: {
      bundleIdentifier: "com.hostelmanager.app",
      buildNumber: "1.0.0"
    }
  }
};
```

## 📂 Current File Structure

```
hostel-management-app/
├── mobile/                          # React Native Expo App
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.js
│   │   │   │   ├── Input.js
│   │   │   │   ├── Loading.js
│   │   │   │   └── Header.js
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.js
│   │   │   │   └── RegisterForm.js
│   │   │   ├── room/
│   │   │   │   ├── RoomCard.js
│   │   │   │   └── RoomList.js
│   │   │   ├── payment/
│   │   │   │   ├── PaymentCard.js
│   │   │   │   └── PaymentHistory.js
│   │   │   ├── notice/
│   │   │   │   ├── NoticeCard.js
│   │   │   │   └── NoticeList.js
│   │   │   └── complaint/
│   │   │       ├── ComplaintCard.js
│   │   │       └── ComplaintForm.js
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   │   ├── LoginScreen.js
│   │   │   │   ├── RegisterScreen.js
│   │   │   │   └── WelcomeScreen.js
│   │   │   ├── student/
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── Profile.js
│   │   │   │   ├── MyRoom.js
│   │   │   │   ├── Payments.js
│   │   │   │   ├── Notices.js
│   │   │   │   └── Complaints.js
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.js
│   │   │       ├── ManageStudents.js
│   │   │       ├── ManageRooms.js
│   │   │       ├── ManagePayments.js
│   │   │       ├── CreateNotice.js
│   │   │       └── ManageComplaints.js
│   │   ├── navigation/
│   │   │   ├── AppNavigator.js
│   │   │   ├── AuthNavigator.js
│   │   │   ├── StudentNavigator.js
│   │   │   └── AdminNavigator.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── storage.js
│   │   │   ├── notifications.js
│   │   │   └── payments.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   └── validation.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── AppContext.js
│   │   └── assets/
│   │       ├── images/
│   │       ├── icons/
│   │       └── fonts/
│   ├── App.js
│   ├── app.config.js
│   └── package.json
├── backend/                         # Express.js Server
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── studentController.js
│   │   │   ├── roomController.js
│   │   │   ├── paymentController.js
│   │   │   ├── noticeController.js
│   │   │   └── complaintController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Room.js
│   │   │   ├── Payment.js
│   │   │   ├── Notice.js
│   │   │   └── Complaint.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── students.js
│   │   │   ├── rooms.js
│   │   │   ├── payments.js
│   │   │   ├── notices.js
│   │   │   └── complaints.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── upload.js
│   │   │   ├── validation.js
│   │   │   └── errorHandler.js
│   │   ├── services/
│   │   │   ├── emailService.js
│   │   │   ├── paymentService.js
│   │   │   ├── notificationService.js
│   │   │   └── fileService.js
│   │   ├── utils/
│   │   │   ├── database.js
│   │   │   ├── helpers.js
│   │   │   └── constants.js
│   │   └── config/
│   │       ├── database.js
│   │       ├── cloudinary.js
│   │       └── razorpay.js
│   ├── uploads/                     # File uploads directory
│   │   ├── documents/
│   │   ├── complaints/
│   │   └── receipts/
│   ├── server.js
│   ├── package.json
│   └── .env
├── docs/                           # Documentation
│   ├── api/
│   │   ├── authentication.md
│   │   ├── students.md
│   │   ├── rooms.md
│   │   ├── payments.md
│   │   ├── notices.md
│   │   └── complaints.md
│   ├── database/
│   │   ├── schema.md
│   │   └── migrations.md
│   ├── deployment/
│   │   ├── server-setup.md
│   │   └── mobile-build.md
│   └── user-guides/
│       ├── student-guide.md
│       └── admin-guide.md
├── scripts/                        # Utility scripts
│   ├── seed-database.js
│   ├── backup-db.js
│   └── deploy.sh
├── tests/                          # Test files
│   ├── backend/
│   │   ├── auth.test.js
│   │   ├── rooms.test.js
│   │   └── payments.test.js
│   └── mobile/
│       ├── components/
│       └── screens/
├── .gitignore
├── README.md
└── package.json                    # Root package.json for scripts
```
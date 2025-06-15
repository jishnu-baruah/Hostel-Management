# Hostel Management App

A full-stack hostel management system with a React Native Expo mobile frontend and an Express.js + MongoDB backend.

## Features (MVP Stage 1)
- Student registration with validation
- Room management (admin & student)
- Rent payment & tracking
- Notice board/announcements
- Complaint/maintenance system
- Modern UI/UX for both admin and student

---

## Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or cloud)
- Expo CLI (`npm install -g expo-cli`)

---

## Backend Setup
1. **Install dependencies:**
   ```sh
   cd backend
   npm install
   ```
2. **Create a `.env` file** in `backend/` with:
   ```env
   MONGO_URI=mongodb://localhost:27017/hostel-management
   JWT_SECRET=your_jwt_secret
   ADMIN_REGISTRATION_CODE=your_admin_code
   PORT=5000
   ```
3. **Start MongoDB** (if running locally):
   ```sh
   mongod
   ```
4. **Run the backend server:**
   ```sh
   npm run dev
   # or
   node server.js
   ```
   The backend runs on `http://localhost:5000` by default.

---

## Mobile App Setup
1. **Install dependencies:**
   ```sh
   cd mobile
   npm install
   ```
2. **Set API base URL:**
   - Edit `mobile/src/utils/constants.js` and set `API_BASE_URL` to your backend URL (e.g., `http://localhost:5000/api` or your LAN IP for device testing).
3. **Start the Expo app:**
   ```sh
   npx expo start
   ```
4. **Run on device or emulator:**
   - Use the Expo Go app (scan QR code) or run on an emulator.

---

## Environment Variables
- **Backend:** See `.env` example above.
- **Mobile:** Set `API_BASE_URL` in `mobile/src/utils/constants.js`.

---

## Troubleshooting
- **Mobile cannot connect to backend:**
  - Use your computer's LAN IP in `API_BASE_URL` (not `localhost`) when testing on a real device.
  - Ensure backend is running and accessible from your device.
- **MongoDB connection errors:**
  - Make sure MongoDB is running and URI is correct.
- **Expo issues:**
  - Try `expo start -c` to clear cache.

---

## Project Structure
- `backend/` - Express.js API, MongoDB models
- `mobile/` - React Native Expo app
- `docs/` - Documentation and test results

---

## MVP Stage 1 Complete!
- See `docs/FINAL_TEST_SUMMARY.md` for feature audit and test results.

---

## License
MIT 
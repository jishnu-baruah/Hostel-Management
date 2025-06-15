# Hostel Management App - Manual Testing Guide

This guide covers end-to-end manual testing for all MVP features. Test as both **Student** and **Admin** users. Use at least one physical device for push notification tests.

---

## 1. Student Registration

### Student
1. Open the app and tap **Register**.
2. Fill in all required personal details. Try leaving fields blank to test validation.
3. Upload ID proof and college ID (test both camera and gallery).
4. Select an available room. Try to select a full/maintenance room (should not be possible).
5. Complete registration. If payment is required, test payment flow (mock or Razorpay).
6. Confirm registration success message and wait for admin approval.

### Admin
1. Log in as admin.
2. Go to **Manage Students**. Approve or reject pending registrations.
3. Student should receive notification of approval/rejection.

---

## 2. Room Management

### Admin
1. Go to **Manage Rooms**. View all rooms, occupancy, and status.
2. Create, edit, and delete rooms. Test validation (e.g., missing fields).
3. Assign and reassign students to rooms. Try to overfill a room (should fail).
4. Mark rooms as maintenance or block availability.
5. Generate and view occupancy reports.

### Student
1. Log in and go to **My Room**. View assigned room and roommate details.
2. Request a room change (if feature exists).

---

## 3. Rent Payment & Tracking

### Student
1. Go to **Payments**. View monthly dues and payment history.
2. Make a payment (mock or Razorpay). Test with valid and invalid payment details.
3. Download/view payment receipt.
4. Check for payment reminders and late fee application.

### Admin
1. Go to **Manage Payments**. View all payments, mark as paid/unpaid.
2. Generate monthly bills for all students.
3. View and download receipts.

---

## 4. Notice Board / Announcements

### Admin
1. Go to **Manage Notices**. Create, edit, and delete notices.
2. Set priority, category, and schedule notices for future.
3. Target all or specific groups (if supported).

### Student
1. Go to **Notices**. View list, search, and filter notices.
2. Tap a notice to view details. Mark as read.
3. Check for unread badge/count.

### Push Notifications
1. Register/login as a student on a physical device. Allow notification permissions.
2. As admin, create a new notice. Student should receive a push notification.
3. Tap the notification (if deep linking is implemented, should open the notice detail).
4. Test notification in foreground, background, and when app is closed.

---

## 5. Complaint / Maintenance Request System

### Student
1. Go to **Complaints**. Submit a new complaint with category, description, priority, and photo (up to 5).
2. Track status (open, in progress, resolved, closed) and view all complaint details.
3. Rate the resolution after completion (only available when status is resolved/closed).

### Admin
1. Go to **Manage Complaints**. View all complaints, search/filter by status, category, or priority.
2. Tap a complaint to view full details, including photos, user info, and timeline.
3. Update status (open, in progress, resolved, closed), priority, and add/edit resolution notes.
4. View and manage assigned staff (if supported).
5. View student rating after resolution.
6. Test photo review and resolution documentation.

---

## 6. Edge Cases & Negative Testing
- Try all forms with missing/invalid data (validation errors).
- Attempt unauthorized actions (e.g., student accessing admin screens).
- Test network loss and recovery.
- Test on both Android and iOS devices.
- Submit complaints with and without photos.
- Attempt to rate unresolved complaints (should not be allowed).

---

## 7. Automated Testing
- Run all backend API tests (see `tests/backend/` for sample test files for registration, rooms, payments, complaints, notices).
- Run all mobile component and screen tests (see `tests/mobile/`).
- Ensure all automated tests pass before manual UAT.

---

## 8. Recommendations
- For best UX, implement deep linking so tapping a push notification opens the relevant notice or screen.
- Test with multiple users/devices to ensure notifications and data sync correctly.
- Review all admin and student flows for completeness and usability.

---

**All features are now implemented. Test both expected and unexpected user behavior. Record any bugs or UX issues for follow-up.** 
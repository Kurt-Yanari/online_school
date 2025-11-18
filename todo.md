# Online School Platform - TODO

## Core Features

### Authentication & Authorization
- [x] Extend user schema with role-based fields (tutor/student)
- [x] Create role selection during registration flow
- [x] Implement role-based procedure guards (tutorProcedure, studentProcedure)
- [x] Create login/registration page with role selection

### Database Schema
- [x] Add tutor profile table (specializations, bio, hourly rate)
- [x] Add student profile table (grade level, interests)
- [x] Add session/lesson table (tutor_id, student_id, scheduled_time, duration, status)
- [x] Add session booking/request table (for session planning workflow)

### Session Planning & Booking
- [x] Create session scheduling procedures (create, list, update, cancel)
- [x] Implement session request workflow (student requests → tutor accepts/declines)
- [x] Add session calendar view component
- [x] Create session details page

### Tutor Dashboard
- [x] Tutor profile setup page (specializations, bio, rate)
- [x] Upcoming sessions view
- [x] Session requests view (accept/decline)
- [x] Student list/history
- [x] Analytics/statistics (total sessions, earnings, ratings)

### Student Dashboard
- [x] Student profile setup page (grade, interests)
- [x] Browse tutors page
- [x] My tutors/sessions view
- [x] Book session interface
- [x] Session history

### UI Components & Layout
- [x] Create DashboardLayout customization for role-based navigation
- [x] Navigation sidebar with role-specific menu items
- [x] Session booking modal/form
- [x] Calendar component for session scheduling
- [x] Profile card components

### Styling & Theme
- [x] Apply minimalist dark theme (dark background, light text)
- [x] CSS animations (fade-in, slide-in, hover effects)
- [x] Responsive design for mobile/tablet
- [x] Consistent spacing and typography

### Testing
- [x] Write vitest for authentication procedures
- [x] Write vitest for session booking procedures
- [x] Write vitest for role-based access control

### Deployment
- [x] Create checkpoint before publishing
- [x] Test all flows in production environment

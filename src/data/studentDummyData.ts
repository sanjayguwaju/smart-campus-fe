// Dummy data for Student Portal

export const studentCourses = [
  {
    courseId: "CS101",
    title: "Introduction to Programming",
    instructor: "Dr. Ayesha Khan",
    semester: "Fall 2024",
    credits: 3,
    schedule: "Mon & Wed 10:00-11:30",
    room: "Room 204, CS Block",
    status: "Enrolled",
    grade: "A-",
    department: "Computer Engineering"
  },
  {
    courseId: "CS201",
    title: "Data Structures and Algorithms",
    instructor: "Dr. Imran Malik",
    semester: "Fall 2024",
    credits: 4,
    schedule: "Tue & Thu 09:00-10:30",
    room: "Room 205, CS Block",
    status: "Enrolled",
    grade: "B+",
    department: "Computer Engineering"
  },
  {
    courseId: "MATH101",
    title: "Calculus I",
    instructor: "Dr. Sarah Johnson",
    semester: "Fall 2024",
    credits: 3,
    schedule: "Wed & Fri 13:00-14:30",
    room: "Room 101, Math Block",
    status: "Enrolled",
    grade: "A",
    department: "Mathematics"
  },
  {
    courseId: "ENG101",
    title: "Technical Writing",
    instructor: "Dr. Michael Brown",
    semester: "Fall 2024",
    credits: 2,
    schedule: "Fri 15:00-17:00",
    room: "Room 301, Humanities Block",
    status: "Enrolled",
    grade: "A-",
    department: "English"
  }
];

export const studentGrades = [
  {
    courseId: "CS101",
    courseName: "Introduction to Programming",
    semester: "Fall 2024",
    grade: "A-",
    credits: 3,
    gpa: 3.7,
    instructor: "Dr. Ayesha Khan"
  },
  {
    courseId: "CS201",
    courseName: "Data Structures and Algorithms",
    semester: "Fall 2024",
    grade: "B+",
    credits: 4,
    gpa: 3.3,
    instructor: "Dr. Imran Malik"
  },
  {
    courseId: "MATH101",
    courseName: "Calculus I",
    semester: "Fall 2024",
    grade: "A",
    credits: 3,
    gpa: 4.0,
    instructor: "Dr. Sarah Johnson"
  },
  {
    courseId: "ENG101",
    courseName: "Technical Writing",
    semester: "Fall 2024",
    grade: "A-",
    credits: 2,
    gpa: 3.7,
    instructor: "Dr. Michael Brown"
  }
];

export const studentEvents = [
  {
    eventId: "EVT-001",
    title: "Campus Career Fair",
    date: "2024-07-25",
    time: "10:00-16:00",
    location: "Main Auditorium",
    description: "Annual career fair with top companies recruiting students.",
    type: "Career",
    category: "Professional Development"
  },
  {
    eventId: "EVT-002",
    title: "Programming Competition",
    date: "2024-07-30",
    time: "14:00-18:00",
    location: "Computer Lab 3",
    description: "Inter-departmental programming competition with prizes.",
    type: "Competition",
    category: "Academic"
  },
  {
    eventId: "EVT-003",
    title: "Student Council Meeting",
    date: "2024-08-05",
    time: "16:00-17:30",
    location: "Student Center",
    description: "Monthly student council meeting to discuss campus issues.",
    type: "Meeting",
    category: "Student Life"
  },
  {
    eventId: "EVT-004",
    title: "Sports Day",
    date: "2024-08-10",
    time: "09:00-17:00",
    location: "University Grounds",
    description: "Annual sports day with various competitions and activities.",
    type: "Sports",
    category: "Recreation"
  }
];

export const studentNotices = [
  {
    noticeId: "N-001",
    title: "Exam Schedule Released",
    content: "The final examination schedule for Fall 2024 has been released. Please check your student portal for details.",
    date: "2024-07-15",
    priority: "High",
    category: "Academic"
  },
  {
    noticeId: "N-002",
    title: "Library Extended Hours",
    content: "The main library will have extended hours during exam week (7 AM - 11 PM).",
    date: "2024-07-20",
    priority: "Medium",
    category: "Facilities"
  },
  {
    noticeId: "N-003",
    title: "Student ID Card Renewal",
    content: "Students with expiring ID cards should renew them at the student services office.",
    date: "2024-07-25",
    priority: "Low",
    category: "Administrative"
  },
  {
    noticeId: "N-004",
    title: "WiFi Maintenance",
    content: "Campus WiFi will be under maintenance on Sunday from 2 AM to 6 AM.",
    date: "2024-07-28",
    priority: "Medium",
    category: "IT Services"
  }
];

export const studentAssignments = [
  // CS101 assignments for Ali Raza
  {
    courseId: 'CS101',
    courseTitle: 'Introduction to Programming',
    semester: 'Fall 2024',
    instructor: 'Dr. Ayesha Khan',
    assignmentId: 'A1',
    title: 'Programming Basics',
    description: 'Write a simple calculator program.',
    dueDate: '2024-08-15',
    totalPoints: 100,
    status: 'Submitted',
    grade: 90,
    feedback: 'Good job!'
  },
  {
    courseId: 'CS101',
    courseTitle: 'Introduction to Programming',
    semester: 'Fall 2024',
    instructor: 'Dr. Ayesha Khan',
    assignmentId: 'A2',
    title: 'Loops and Conditions',
    description: 'Implement a number guessing game.',
    dueDate: '2024-09-01',
    totalPoints: 100,
    status: 'Submitted',
    grade: 95,
    feedback: 'Excellent!'
  },
  // EE201 assignments for Ali Raza
  {
    courseId: 'EE201',
    courseTitle: 'Circuit Analysis',
    semester: 'Spring 2024',
    instructor: 'Dr. Imran Malik',
    assignmentId: 'A1',
    title: "Ohm's Law Lab",
    description: "Lab report on Ohm's Law experiment.",
    dueDate: '2024-03-10',
    totalPoints: 50,
    status: 'Submitted',
    grade: 45,
    feedback: 'Good analysis.'
  },
  // CE301 assignments for Ali Raza
  {
    courseId: 'CE301',
    courseTitle: 'Structural Engineering',
    semester: 'Fall 2024',
    instructor: 'Dr. Usman Tariq',
    assignmentId: 'A1',
    title: 'Bridge Design Project',
    description: 'Design a model bridge and submit a report.',
    dueDate: '2024-10-01',
    totalPoints: 150,
    status: 'Not Submitted',
    grade: null,
    feedback: null
  }
];

export const studentServices = [
  {
    serviceId: "SVC-001",
    title: "Academic Advising",
    description: "Schedule appointments with academic advisors for course planning and career guidance.",
    category: "Academic",
    contact: "advising@university.edu",
    phone: "+1-555-0123",
    location: "Student Services Building, Room 101",
    hours: "Mon-Fri 9:00-17:00",
    status: "Available"
  },
  {
    serviceId: "SVC-002",
    title: "Career Services",
    description: "Resume writing, interview preparation, and job placement assistance.",
    category: "Career",
    contact: "career@university.edu",
    phone: "+1-555-0124",
    location: "Career Center, Room 205",
    hours: "Mon-Fri 8:00-18:00",
    status: "Available"
  },
  {
    serviceId: "SVC-003",
    title: "Health Services",
    description: "Medical consultations, health checkups, and mental health support.",
    category: "Health",
    contact: "health@university.edu",
    phone: "+1-555-0125",
    location: "Health Center",
    hours: "Mon-Fri 8:00-20:00, Sat 9:00-17:00",
    status: "Available"
  },
  {
    serviceId: "SVC-004",
    title: "IT Support",
    description: "Technical support for student accounts, WiFi, and software issues.",
    category: "Technical",
    contact: "itsupport@university.edu",
    phone: "+1-555-0126",
    location: "IT Center, Room 301",
    hours: "Mon-Fri 8:00-22:00, Sat-Sun 10:00-18:00",
    status: "Available"
  },
  {
    serviceId: "SVC-005",
    title: "Library Services",
    description: "Book borrowing, research assistance, and study space reservations.",
    category: "Academic",
    contact: "library@university.edu",
    phone: "+1-555-0127",
    location: "Main Library",
    hours: "Mon-Sun 7:00-23:00",
    status: "Available"
  },
  {
    serviceId: "SVC-006",
    title: "Financial Aid",
    description: "Scholarship information, loan applications, and financial planning.",
    category: "Financial",
    contact: "finaid@university.edu",
    phone: "+1-555-0128",
    location: "Student Services Building, Room 102",
    hours: "Mon-Fri 9:00-17:00",
    status: "Available"
  }
];

export const studentPrograms = [
  {
    programId: "PROG-001",
    name: "Bachelor of Science in Computer Engineering",
    department: "Computer Engineering",
    level: "Undergraduate",
    duration: "4 years",
    semesters: 8,
    description: "Comprehensive program covering computer hardware and software engineering principles.",
    prerequisites: ["High School Diploma", "Mathematics", "Physics"],
    image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&w=600&h=400&fit=crop",
    brochureUrl: "/brochures/cs-engineering.pdf",
    isPublished: true,
    status: "active"
  },
  {
    programId: "PROG-002",
    name: "Master of Science in Electrical Engineering",
    department: "Electrical Engineering",
    level: "Postgraduate",
    duration: "2 years",
    semesters: 4,
    description: "Advanced program focusing on electrical systems, power electronics, and renewable energy.",
    prerequisites: ["Bachelor's in Engineering", "GRE Scores", "Letters of Recommendation"],
    image: "https://images.pexels.com/photos/256401/pexels-photo-256401.jpeg?auto=compress&w=600&h=400&fit=crop",
    brochureUrl: "/brochures/ee-masters.pdf",
    isPublished: true,
    status: "active"
  },
  {
    programId: "PROG-003",
    name: "Bachelor of Science in Civil Engineering",
    department: "Civil Engineering",
    level: "Undergraduate",
    duration: "4 years",
    semesters: 8,
    description: "Program covering structural engineering, transportation, and environmental engineering.",
    prerequisites: ["High School Diploma", "Mathematics", "Physics"],
    image: "https://images.pexels.com/photos/461419/pexels-photo-461419.jpeg?auto=compress&w=600&h=400&fit=crop",
    brochureUrl: "/brochures/civil-engineering.pdf",
    isPublished: true,
    status: "active"
  },
  {
    programId: "PROG-004",
    name: "Professional Certificate in Web Development",
    department: "Computer Engineering",
    level: "Professional",
    duration: "6 months",
    semesters: 2,
    description: "Intensive program covering modern web development technologies and frameworks.",
    prerequisites: ["Basic Programming Knowledge", "High School Diploma"],
    image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&w=600&h=400&fit=crop",
    brochureUrl: "/brochures/web-dev-cert.pdf",
    isPublished: true,
    status: "active"
  }
]; 
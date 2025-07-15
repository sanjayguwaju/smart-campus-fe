// Dummy data for Faculty Portal

export const facultyCourses = [
    {
      courseId: "CS101",
      title: "Introduction to Programming",
      semester: "Fall 2024",
      enrolledStudents: 120,
      schedule: "Mon & Wed 10:00-11:30",
      status: "Ongoing",
      department: "Computer Engineering"
    },
    {
      courseId: "EE201",
      title: "Circuit Analysis",
      semester: "Spring 2024",
      enrolledStudents: 90,
      schedule: "Tue & Thu 09:00-10:30",
      status: "Completed",
      department: "Electrical"
    },
    {
      courseId: "CE301",
      title: "Structural Engineering",
      semester: "Fall 2024",
      enrolledStudents: 60,
      schedule: "Wed & Fri 13:00-14:30",
      status: "Ongoing",
      department: "Civil Engineering"
    }
  ];
  
  export const facultyAdvisees = [
    {
      studentId: "stu-101",
      name: "Ali Raza",
      program: "BS Computer Engineering",
      year: "3rd",
      email: "ali.raza@university.edu",
      department: "Computer Engineering"
    },
    {
      studentId: "stu-102",
      name: "Fatima Noor",
      program: "BS Electrical Engineering",
      year: "2nd",
      email: "fatima.noor@university.edu",
      department: "Electrical"
    },
    {
      studentId: "stu-103",
      name: "Usman Tariq",
      program: "BS Civil Engineering",
      year: "4th",
      email: "usman.tariq@university.edu",
      department: "Civil Engineering"
    }
  ];
  
  export const facultyEvents = [
    {
      eventId: "EVT-001",
      title: "Department Meeting",
      date: "2024-07-10",
      time: "14:00",
      location: "Main Conference Room",
      description: "Monthly department meeting for all faculty members.",
      type: "Meeting",
      department: "Electrical"
    },
    {
      eventId: "EVT-002",
      title: "Research Workshop",
      date: "2024-07-15",
      time: "10:00",
      location: "Lab 3",
      description: "Workshop on AI research trends.",
      type: "Workshop",
      department: "Computer Engineering"
    },
    {
      eventId: "EVT-003",
      title: "Site Visit",
      date: "2024-07-20",
      time: "09:00",
      location: "Construction Site",
      description: "Field trip for civil engineering students.",
      type: "Field Trip",
      department: "Civil Engineering"
    }
  ];
  
  export const facultyNotices = [
    {
      noticeId: "N-001",
      title: "Grade Submission Deadline",
      content: "Please submit final grades for Spring 2024 courses by July 15th.",
      date: "2024-07-05",
      priority: "Medium",
      department: "Electrical"
    },
    {
      noticeId: "N-002",
      title: "Faculty Meeting",
      content: "All faculty are requested to attend the departmental meeting on Friday at 2 PM in the main conference room.",
      date: "2024-07-10",
      priority: "High",
      department: "Computer Engineering"
    },
    {
      noticeId: "N-003",
      title: "Lab Equipment Update",
      content: "New equipment has arrived for the civil engineering lab.",
      date: "2024-07-12",
      priority: "Low",
      department: "Civil Engineering"
    }
  ];
  
  export const facultyGrades = [
    {
      student: "Ali Raza",
      course: "CS101",
      grade: "A",
      semester: "Fall 2024",
      department: "Computer Engineering"
    },
    {
      student: "Fatima Noor",
      course: "EE201",
      grade: "B+",
      semester: "Spring 2024",
      department: "Electrical"
    },
    {
      student: "Usman Tariq",
      course: "CE301",
      grade: "A-",
      semester: "Fall 2024",
      department: "Civil Engineering"
    }
  ];
  
  export const facultyOfficeHours = [
    {
      day: "Monday",
      time: "13:00-15:00",
      location: "Room 204, CS Block",
      department: "Computer Engineering"
    },
    {
      day: "Thursday",
      time: "10:00-12:00",
      location: "Room 101, EE Block",
      department: "Electrical"
    },
    {
      day: "Wednesday",
      time: "11:00-13:00",
      location: "Room 301, Civil Block",
      department: "Civil Engineering"
    }
  ];
  
  export const facultyBlogs = [
    {
      blogId: "blog-001",
      title: "Innovative Teaching Methods in Computer Science",
      author: "Ayesha Khan",
      date: "2024-07-01",
      summary: "Exploring flipped classrooms, project-based learning, and the use of AI tools in CS education.",
      tags: ["Teaching", "Innovation", "AI"],
      coverImage: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&w=600&h=400&fit=crop",
      department: "Computer Engineering"
    },
    {
      blogId: "blog-002",
      title: "Faculty Research Spotlight: AI for Healthcare",
      author: "Imran Malik",
      date: "2024-06-20",
      summary: "A look at our department's latest research in AI-driven diagnostics and patient care.",
      tags: ["Research", "Healthcare", "AI"],
      coverImage: "https://images.pexels.com/photos/256401/pexels-photo-256401.jpeg?auto=compress&w=600&h=400&fit=crop",
      department: "Electrical"
    },
    {
      blogId: "blog-003",
      title: "Sustainable Materials in Civil Engineering",
      author: "Usman Tariq",
      date: "2024-06-10",
      summary: "Discussing the latest trends in sustainable construction materials.",
      tags: ["Civil", "Sustainability", "Materials"],
      coverImage: "https://images.pexels.com/photos/461419/pexels-photo-461419.jpeg?auto=compress&w=600&h=400&fit=crop",
      department: "Civil Engineering"
    }
  ]; 
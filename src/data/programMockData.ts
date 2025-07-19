// Program, student, and enrollment mock data for semester-based registration system
//
// Suggestion: Add a 'Course Registration' menu in the student portal sidebar
// so students can select courses for the current semester after program approval.

export type Program = {
  programId: string;
  name: string;
  semesters: number;
  courses: string[]; // courseIds
};

export type StudentProgramApplication = {
  programId: string;
  status: 'pending' | 'verified' | 'rejected';
  documents: { type: string; url: string }[];
};

export type StudentEnrolledCourse = {
  courseId: string;
  semester: number;
  year: number;
};

export type StudentCourseHistory = {
  courseId: string;
  semester: number;
  year: number;
  grade: string;
};

export type Student = {
  studentId: string;
  name: string;
  appliedPrograms: StudentProgramApplication[];
  enrolledCourses: StudentEnrolledCourse[]; // current semester
  courseHistory: StudentCourseHistory[]; // previous semesters
};

// --- Programs ---
export const programs: Program[] = [
  {
    programId: 'prog-ce',
    name: 'Computer Engineering',
    semesters: 8,
    courses: [
      'CS101', 'CS102', 'CS103', 'CS104',
      'CS201', 'CS202', 'CS203', 'CS204',
      'CS301', 'CS302', 'CS303', 'CS304',
      'CS401', 'CS402', 'CS403', 'CS404',
    ],
  },
  {
    programId: 'prog-ee',
    name: 'Electrical Engineering',
    semesters: 8,
    courses: [
      'EE101', 'EE102', 'EE103', 'EE104',
      'EE201', 'EE202', 'EE203', 'EE204',
      'EE301', 'EE302', 'EE303', 'EE304',
      'EE401', 'EE402', 'EE403', 'EE404',
    ],
  },
];

// --- Students ---
export const students: Student[] = [
  {
    studentId: 'stu-001',
    name: 'Ali Raza',
    appliedPrograms: [
      {
        programId: 'prog-ce',
        status: 'verified',
        documents: [
          { type: 'id_card', url: '/uploads/ali_id.jpg' },
          { type: 'enrollment_proof', url: '/uploads/ali_enroll.pdf' },
        ],
      },
    ],
    enrolledCourses: [
      // Current semester (e.g., semester 4, year 2024)
      { courseId: 'CS202', semester: 4, year: 2024 },
      { courseId: 'CS203', semester: 4, year: 2024 },
      { courseId: 'CS204', semester: 4, year: 2024 },
      { courseId: 'CS301', semester: 4, year: 2024 },
      { courseId: 'CS302', semester: 4, year: 2024 },
    ],
    courseHistory: [
      { courseId: 'CS101', semester: 1, year: 2023, grade: 'A' },
      { courseId: 'CS102', semester: 2, year: 2023, grade: 'B+' },
      { courseId: 'CS103', semester: 2, year: 2023, grade: 'A-' },
      { courseId: 'CS104', semester: 3, year: 2023, grade: 'B' },
      { courseId: 'CS201', semester: 3, year: 2023, grade: 'A' },
    ],
  },
  {
    studentId: 'stu-002',
    name: 'Fatima Noor',
    appliedPrograms: [
      {
        programId: 'prog-ee',
        status: 'verified',
        documents: [
          { type: 'id_card', url: '/uploads/fatima_id.jpg' },
          { type: 'enrollment_proof', url: '/uploads/fatima_enroll.pdf' },
        ],
      },
    ],
    enrolledCourses: [], // Not yet selected for current semester
    courseHistory: [],
  },
];

// --- Course Registration Simulation ---
/**
 * Simulate student selecting courses for the current semester after program approval.
 * Call this after verifying the student's program application.
 *
 * @param studentId - The student's ID
 * @param programId - The program the student is verified for
 * @param semester - The current semester number
 * @param year - The current academic year
 * @param selectedCourseIds - Array of courseIds selected by the student
 */
export function registerCoursesForSemester(
  studentId: string,
  programId: string,
  semester: number,
  year: number,
  selectedCourseIds: string[]
) {
  const student = students.find(s => s.studentId === studentId);
  if (!student) throw new Error('Student not found');
  const program = programs.find(p => p.programId === programId);
  if (!program) throw new Error('Program not found');
  // Only allow if student is verified for this program
  const app = student.appliedPrograms.find(
    a => a.programId === programId && a.status === 'verified'
  );
  if (!app) throw new Error('Student is not verified for this program');
  // Only allow courses from this program and semester
  const validCourseIds = program.courses.filter(cid =>
    selectedCourseIds.includes(cid)
  );
  // Optionally, filter by semester if you have that info in a course details file
  // For now, just use the selected ones that are valid
  student.enrolledCourses = validCourseIds.map(cid => ({
    courseId: cid,
    semester,
    year,
  }));
}

// --- Sidebar Menu Suggestion ---
// In your student portal sidebar, add:
// { name: 'Course Registration', href: '/student/course-registration' }
// This page should use the above function to let students select their courses for the semester after program approval. 
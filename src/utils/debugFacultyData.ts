// Debug utility for faculty-student data verification
export const debugFacultyData = {
  // Log faculty data for debugging
  logFacultyData: (facultyId: string, courses: any[], students: any[]) => {
    console.group('🔍 Faculty Data Debug');
    console.log('Faculty ID:', facultyId);
    console.log('Courses assigned:', courses.length);
    console.table(courses.map(c => ({
      id: c._id,
      name: c.name,
      code: c.code,
      faculty: c.faculty
    })));
    console.log('Students enrolled:', students.length);
    console.table(students.map(s => ({
      id: s._id,
      name: `${s.firstName} ${s.lastName}`,
      courses: s.courses?.length || 0,
      courseNames: s.courses?.map((c: any) => c.name || c.title).join(', ') || 'None'
    })));
    console.groupEnd();
  },

  // Check if data relationships are correct
  verifyDataRelationships: (facultyId: string, courses: any[], students: any[]) => {
    const issues = [];
    
    // Check if faculty has courses assigned
    if (courses.length === 0) {
      issues.push('❌ No courses assigned to this faculty member');
    }
    
    // Check if students are enrolled in faculty's courses
    const facultyCourseIds = courses.map(c => c._id);
    const studentsInFacultyCourses = students.filter(student => 
      student.courses?.some((course: any) => 
        facultyCourseIds.includes(course._id)
      )
    );
    
    if (studentsInFacultyCourses.length === 0 && students.length > 0) {
      issues.push('❌ Students are enrolled but not in this faculty\'s courses');
    }
    
    if (issues.length === 0) {
      console.log('✅ Data relationships look correct');
    } else {
      console.log('⚠️ Data relationship issues found:');
      issues.forEach(issue => console.log(issue));
    }
    
    return issues;
  }
}; 
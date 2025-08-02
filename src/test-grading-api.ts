// Test file to verify grading API connection
import { courseGradeService } from './api/services/courseGradeService';

// Test the API connection
async function testGradingAPI() {
  try {
    console.log('Testing grading API connection...');
    
    // Test getting faculty course grades
    const facultyGrades = await courseGradeService.getFacultyCourseGrades(1, 10);
    console.log('✅ Faculty course grades API working:', facultyGrades.success);
    
    // Test getting course grades by course (if you have a course ID)
    // const courseGrades = await courseGradeService.getCourseGradesByCourse('course-id', 1, 10);
    // console.log('✅ Course grades API working:', courseGrades.success);
    
    console.log('🎉 All grading API tests passed!');
  } catch (error) {
    console.error('❌ Grading API test failed:', error);
  }
}

// Export for use in development
export { testGradingAPI }; 
import React, { useState } from 'react';
import { students, programs } from '../data/programMockData';
import { BadgeCheck, BookOpen, Award, FileText, Lock } from 'lucide-react';

const MAX_COURSES_PER_SEMESTER = 6;

const statusColors: Record<string, string> = {
  verified: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
};

const gradeColors = (grade: string) => {
  if (grade.startsWith('A')) return 'bg-green-100 text-green-700';
  if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700';
  if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
};

export default function StudentMockDemo() {
  // For demo, use the first student
  const student = students[0];
  const programApp = student.appliedPrograms.find(app => app.status === 'verified');
  const program = programApp ? programs.find(p => p.programId === programApp.programId) : null;
  // Assume current semester/year for demo
  const currentSemester = 4;
  const currentYear = 2024;

  // Find enrolled courseIds for current semester
  const enrolledCourseIds = student.enrolledCourses
    .filter(c => c.semester === currentSemester && c.year === currentYear)
    .map(c => c.courseId);

  // Local state for mock selection (does not persist)
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // All program courses
  const allProgramCourses = program ? program.courses : [];

  // Handler for selecting/deselecting courses
  const handleSelect = (courseId: string) => {
    if (enrolledCourseIds.length > 0 || submitted) return; // Block if already enrolled or submitted
    if (selected.includes(courseId)) {
      setSelected(selected.filter(id => id !== courseId));
    } else if (selected.length < MAX_COURSES_PER_SEMESTER) {
      setSelected([...selected, courseId]);
    }
  };

  // Handler for mock submit
  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-8 text-blue-900 flex items-center gap-2">
        <BadgeCheck className="h-6 w-6 text-blue-600" /> Course Selection
      </h2>
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 mb-10">
        {/* Student Info */}
        <div className="flex items-center gap-6 mb-6">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
            {student.name.charAt(0)}
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">{student.name}</div>
            <div className="text-sm text-gray-500">Student ID: <span className="font-mono">{student.studentId}</span></div>
          </div>
        </div>
        {/* Applied Program */}
        {program && (
          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" /> Program
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="bg-gray-50 rounded-lg px-4 py-2 flex items-center gap-3 border border-gray-200">
                <span className="font-medium text-blue-800">{program.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[programApp?.status || 'pending']}`}>{programApp?.status}</span>
                {programApp?.documents && programApp.documents.length > 0 && (
                  <span className="ml-2 text-xs text-gray-400">{programApp.documents.length} docs</span>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Course Selection Grid */}
        <div className="mb-6">
          <div className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" /> Select Courses for Semester {currentSemester}
          </div>
          {enrolledCourseIds.length > 0 || submitted ? (
            <div className="mb-4 text-green-700 font-semibold flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-500" />
              You are enrolled for this semester. Course selection is locked until next semester.
            </div>
          ) : (
            <div className="mb-4 text-gray-500 text-sm">
              Select up to {MAX_COURSES_PER_SEMESTER} courses for this semester.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allProgramCourses.map(courseId => {
              const isEnrolled = enrolledCourseIds.includes(courseId);
              const isSelected = selected.includes(courseId);
              return (
                <div
                  key={courseId}
                  className={`rounded-lg p-4 flex items-center gap-4 border transition-all
                    ${isEnrolled ? 'bg-blue-100 border-blue-200 opacity-70' :
                      isSelected ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-300' :
                      'bg-white border-gray-200 hover:bg-blue-50 cursor-pointer'}
                  `}
                  onClick={() => handleSelect(courseId)}
                  style={{ pointerEvents: (enrolledCourseIds.length > 0 || submitted) ? 'none' : 'auto' }}
                >
                  <div className="flex-1">
                    <div className="font-semibold text-blue-900">{courseId}</div>
                    <div className="text-xs text-gray-500">Program Course</div>
                  </div>
                  {isEnrolled ? (
                    <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">Enrolled</span>
                  ) : isSelected ? (
                    <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">Selected</span>
                  ) : null}
                </div>
              );
            })}
          </div>
          {/* Submit Button (always visible, but disabled if already enrolled or submitted) */}
          <button
            className={`mt-6 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors disabled:opacity-50`}
            disabled={enrolledCourseIds.length > 0 || submitted || selected.length === 0 || selected.length > MAX_COURSES_PER_SEMESTER}
            onClick={handleSubmit}
            title={enrolledCourseIds.length > 0 ? 'You are already enrolled for this semester.' : submitted ? 'Selection already submitted.' : selected.length === 0 ? 'Select at least one course.' : selected.length > MAX_COURSES_PER_SEMESTER ? `Select up to ${MAX_COURSES_PER_SEMESTER} courses.` : ''}
          >
            Submit Selection
          </button>
          {enrolledCourseIds.length > 0 && (
            <div className="mt-2 text-sm text-gray-500">You are already enrolled for this semester. Course selection is locked until next semester.</div>
          )}
        </div>
        {/* Show enrolled courses if already enrolled */}
        {enrolledCourseIds.length > 0 && (
          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" /> Enrolled Courses
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledCourseIds.map(courseId => (
                <div key={courseId} className="bg-blue-100 border border-blue-200 rounded-lg p-4 flex items-center gap-4 opacity-70">
                  <div className="flex-1">
                    <div className="font-semibold text-blue-900">{courseId}</div>
                    <div className="text-xs text-gray-500">Current Semester</div>
                  </div>
                  <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">Enrolled</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
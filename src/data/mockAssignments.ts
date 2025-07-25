import { AssignmentData } from '../api/types/assignments';

export const mockAssignments: AssignmentData[] = [
  {
    _id: '1',
    title: 'Introduction to Programming',
    description: 'Write a simple calculator program using basic programming concepts.',
    course: {
      _id: 'CS101',
      name: 'Introduction to Computer Science',
      code: 'CS101'
    },
    faculty: {
      _id: 'FAC001',
      firstName: 'Dr. Ayesha',
      lastName: 'Khan',
      fullName: 'Dr. Ayesha Khan'
    },
    assignmentType: 'Homework',
    dueDate: '2024-12-15T23:59:00.000Z',
    extendedDueDate: '2024-12-17T23:59:00.000Z',
    files: [
      {
        _id: 'file1',
        fileName: 'assignment1.pdf',
        fileUrl: 'https://example.com/assignment1.pdf',
        fileSize: 1024000,
        fileType: 'pdf',
        uploadedAt: '2024-12-01T10:00:00.000Z'
      }
    ],
    requirements: {
      maxFileSize: 10,
      allowedFileTypes: ['pdf', 'docx', 'txt'],
      maxSubmissions: 3,
      allowLateSubmission: true,
      latePenalty: 10
    },
    gradingCriteria: [
      {
        criterion: 'Correctness',
        maxPoints: 50,
        description: 'The assignment meets all requirements and produces correct results.'
      },
      {
        criterion: 'Code Quality',
        maxPoints: 30,
        description: 'The code is well-organized, efficient, and follows best practices.'
      },
      {
        criterion: 'Documentation',
        maxPoints: 20,
        description: 'The code is properly documented with comments and explanations.'
      }
    ],
    totalPoints: 100,
    status: 'published',
    isVisible: true,
    statistics: {
      totalSubmissions: 45,
      averageGrade: 85.5,
      submissionRate: 75.0,
      onTimeSubmissions: 40,
      lateSubmissions: 5
    },
    tags: ['programming', 'basics', 'calculator'],
    difficulty: 'Easy',
    estimatedTime: 4,
    createdBy: 'FAC001',
    lastModifiedBy: 'FAC001',
    createdAt: '2024-12-01T10:00:00.000Z',
    updatedAt: '2024-12-10T15:30:00.000Z',
    isOverdue: false,
    timeRemaining: '5 days',
    submissionRate: 75.0,
    averageGrade: '85.5'
  },
  {
    _id: '2',
    title: 'Data Structures Implementation',
    description: 'Implement a binary search tree with insertion, deletion, and traversal methods.',
    course: {
      _id: 'CS201',
      name: 'Data Structures and Algorithms',
      code: 'CS201'
    },
    faculty: {
      _id: 'FAC002',
      firstName: 'Dr. Imran',
      lastName: 'Malik',
      fullName: 'Dr. Imran Malik'
    },
    assignmentType: 'Project',
    dueDate: '2024-12-20T23:59:00.000Z',
    files: [],
    requirements: {
      maxFileSize: 5,
      allowedFileTypes: ['java', 'cpp', 'py'],
      maxSubmissions: 2,
      allowLateSubmission: false,
      latePenalty: 0
    },
    gradingCriteria: [
      {
        criterion: 'Implementation',
        maxPoints: 60,
        description: 'Correct implementation of all required methods.'
      },
      {
        criterion: 'Efficiency',
        maxPoints: 25,
        description: 'Optimal time and space complexity.'
      },
      {
        criterion: 'Testing',
        maxPoints: 15,
        description: 'Comprehensive test cases.'
      }
    ],
    totalPoints: 150,
    status: 'published',
    isVisible: true,
    statistics: {
      totalSubmissions: 28,
      averageGrade: 78.2,
      submissionRate: 60.0,
      onTimeSubmissions: 25,
      lateSubmissions: 3
    },
    tags: ['data-structures', 'algorithms', 'binary-tree'],
    difficulty: 'Hard',
    estimatedTime: 12,
    createdBy: 'FAC002',
    lastModifiedBy: 'FAC002',
    createdAt: '2024-11-25T14:00:00.000Z',
    updatedAt: '2024-12-05T09:15:00.000Z',
    isOverdue: false,
    timeRemaining: '10 days',
    submissionRate: 60.0,
    averageGrade: '78.2'
  },
  {
    _id: '3',
    title: 'Database Design Project',
    description: 'Design and implement a normalized database schema for a library management system.',
    course: {
      _id: 'CS301',
      name: 'Database Systems',
      code: 'CS301'
    },
    faculty: {
      _id: 'FAC003',
      firstName: 'Dr. Sarah',
      lastName: 'Ahmed',
      fullName: 'Dr. Sarah Ahmed'
    },
    assignmentType: 'Project',
    dueDate: '2024-12-10T23:59:00.000Z',
    files: [
      {
        _id: 'file2',
        fileName: 'requirements.pdf',
        fileUrl: 'https://example.com/requirements.pdf',
        fileSize: 512000,
        fileType: 'pdf',
        uploadedAt: '2024-11-28T11:00:00.000Z'
      }
    ],
    requirements: {
      maxFileSize: 15,
      allowedFileTypes: ['sql', 'pdf', 'docx'],
      maxSubmissions: 3,
      allowLateSubmission: true,
      latePenalty: 15
    },
    gradingCriteria: [
      {
        criterion: 'Schema Design',
        maxPoints: 40,
        description: 'Proper normalization and relationship design.'
      },
      {
        criterion: 'Implementation',
        maxPoints: 35,
        description: 'Correct SQL implementation.'
      },
      {
        criterion: 'Documentation',
        maxPoints: 25,
        description: 'Clear documentation and ER diagrams.'
      }
    ],
    totalPoints: 120,
    status: 'submission_closed',
    isVisible: true,
    statistics: {
      totalSubmissions: 35,
      averageGrade: 82.1,
      submissionRate: 80.0,
      onTimeSubmissions: 30,
      lateSubmissions: 5
    },
    tags: ['database', 'sql', 'normalization'],
    difficulty: 'Medium',
    estimatedTime: 8,
    createdBy: 'FAC003',
    lastModifiedBy: 'FAC003',
    createdAt: '2024-11-20T16:00:00.000Z',
    updatedAt: '2024-12-10T23:59:00.000Z',
    isOverdue: true,
    timeRemaining: 'Overdue',
    submissionRate: 80.0,
    averageGrade: '82.1'
  }
];

export const mockAssignmentsResponse = {
  success: true,
  assignments: mockAssignments,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: mockAssignments.length,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  }
}; 
import React, { useState } from 'react';
import { GraduationCap, Users, Calendar, MapPin, Star, Search, Filter, Plus, BookOpen } from 'lucide-react';

interface Program {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: string;
  location: string;
  capacity: number;
  enrolled: number;
  startDate: string;
  endDate: string;
  coordinator: string;
  requirements: string[];
  benefits: string[];
  isEnrolled: boolean;
  rating: number;
  reviews: number;
  image?: string;
}

const StudentPrograms: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

  const dummyPrograms: Program[] = [
    {
      id: '1',
      name: 'Leadership Development Program',
      description: 'A comprehensive program designed to develop leadership skills through workshops, mentoring, and hands-on projects. Participants will learn communication, team management, and strategic thinking.',
      category: 'Leadership',
      duration: '8 weeks',
      location: 'Student Center, Conference Room A',
      capacity: 30,
      enrolled: 25,
      startDate: '2024-04-01',
      endDate: '2024-05-20',
      coordinator: 'Dr. Sarah Johnson',
      requirements: ['Minimum GPA 3.0', 'Letter of recommendation', 'Interview'],
      benefits: ['Leadership certificate', 'Networking opportunities', 'Mentorship program'],
      isEnrolled: true,
      rating: 4.8,
      reviews: 45
    },
    {
      id: '2',
      name: 'Study Abroad Exchange Program',
      description: 'Experience international education through our partner universities in Europe, Asia, and Australia. Earn credits while exploring new cultures and academic perspectives.',
      category: 'International',
      duration: '1 semester',
      location: 'Various International Universities',
      capacity: 50,
      enrolled: 35,
      startDate: '2024-09-01',
      endDate: '2024-12-15',
      coordinator: 'Prof. Michael Chen',
      requirements: ['Minimum GPA 3.2', 'Language proficiency', 'Application essay'],
      benefits: ['International experience', 'Cultural immersion', 'Academic credits'],
      isEnrolled: false,
      rating: 4.9,
      reviews: 78
    },
    {
      id: '3',
      name: 'Research Scholars Program',
      description: 'Work alongside faculty members on cutting-edge research projects. Gain hands-on experience in your field of study and contribute to academic knowledge.',
      category: 'Research',
      duration: '12 weeks',
      location: 'Various Research Labs',
      capacity: 20,
      enrolled: 18,
      startDate: '2024-06-01',
      endDate: '2024-08-20',
      coordinator: 'Dr. Emily Rodriguez',
      requirements: ['Minimum GPA 3.5', 'Research proposal', 'Faculty recommendation'],
      benefits: ['Research experience', 'Publication opportunities', 'Academic credit'],
      isEnrolled: false,
      rating: 4.7,
      reviews: 32
    },
    {
      id: '4',
      name: 'Entrepreneurship Bootcamp',
      description: 'Learn the fundamentals of starting and running a business. Develop your business idea, create a business plan, and pitch to investors.',
      category: 'Business',
      duration: '6 weeks',
      location: 'Business School, Innovation Lab',
      capacity: 25,
      enrolled: 20,
      startDate: '2024-05-15',
      endDate: '2024-06-25',
      coordinator: 'Prof. David Wilson',
      requirements: ['Business idea', 'Application form', 'Team formation'],
      benefits: ['Business plan development', 'Investor connections', 'Startup resources'],
      isEnrolled: true,
      rating: 4.6,
      reviews: 28
    },
    {
      id: '5',
      name: 'Community Service Program',
      description: 'Make a positive impact in the local community through volunteer work, service projects, and civic engagement activities.',
      category: 'Community',
      duration: 'Ongoing',
      location: 'Various Community Locations',
      capacity: 100,
      enrolled: 65,
      startDate: '2024-03-01',
      endDate: '2024-12-31',
      coordinator: 'Ms. Lisa Thompson',
      requirements: ['Background check', 'Orientation session', 'Commitment to service'],
      benefits: ['Community impact', 'Service hours', 'Leadership development'],
      isEnrolled: false,
      rating: 4.5,
      reviews: 56
    },
    {
      id: '6',
      name: 'Technology Innovation Program',
      description: 'Explore emerging technologies through hands-on projects, hackathons, and collaboration with industry partners.',
      category: 'Technology',
      duration: '10 weeks',
      location: 'Engineering Building, Innovation Center',
      capacity: 40,
      enrolled: 38,
      startDate: '2024-07-01',
      endDate: '2024-09-10',
      coordinator: 'Dr. Robert Kim',
      requirements: ['Basic programming knowledge', 'Project proposal', 'Team collaboration'],
      benefits: ['Technical skills', 'Industry connections', 'Project portfolio'],
      isEnrolled: false,
      rating: 4.8,
      reviews: 41
    },
    {
      id: '7',
      name: 'Arts and Culture Program',
      description: 'Express your creativity through various art forms including painting, music, theater, and digital arts. Showcase your work in campus exhibitions.',
      category: 'Arts',
      duration: '8 weeks',
      location: 'Arts Center, Various Studios',
      capacity: 35,
      enrolled: 30,
      startDate: '2024-04-15',
      endDate: '2024-06-10',
      coordinator: 'Prof. Maria Garcia',
      requirements: ['Portfolio submission', 'Creative statement', 'Commitment to practice'],
      benefits: ['Artistic development', 'Exhibition opportunities', 'Creative community'],
      isEnrolled: false,
      rating: 4.4,
      reviews: 23
    },
    {
      id: '8',
      name: 'Sports and Wellness Program',
      description: 'Stay active and healthy through organized sports activities, fitness classes, and wellness workshops.',
      category: 'Sports',
      duration: 'Ongoing',
      location: 'Recreation Center, Sports Fields',
      capacity: 150,
      enrolled: 120,
      startDate: '2024-03-01',
      endDate: '2024-12-31',
      coordinator: 'Mr. James Anderson',
      requirements: ['Medical clearance', 'Sports equipment', 'Regular participation'],
      benefits: ['Physical fitness', 'Team building', 'Health education'],
      isEnrolled: true,
      rating: 4.3,
      reviews: 89
    }
  ];

  const categories = ['all', 'Leadership', 'International', 'Research', 'Business', 'Community', 'Technology', 'Arts', 'Sports'];

  const filteredPrograms = dummyPrograms.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Leadership': return 'text-blue-600 bg-blue-100';
      case 'International': return 'text-purple-600 bg-purple-100';
      case 'Research': return 'text-green-600 bg-green-100';
      case 'Business': return 'text-indigo-600 bg-indigo-100';
      case 'Community': return 'text-pink-600 bg-pink-100';
      case 'Technology': return 'text-orange-600 bg-orange-100';
      case 'Arts': return 'text-red-600 bg-red-100';
      case 'Sports': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEnroll = (programId: string) => {
    // In a real app, this would make an API call
    console.log(`Enrolling in program ${programId}`);
    setShowEnrollmentModal(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Programs</h1>
          <p className="text-gray-600">Explore and enroll in exciting academic and extracurricular programs</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Programs</p>
                <p className="text-2xl font-bold text-gray-900">{dummyPrograms.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Enrolled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dummyPrograms.filter(p => p.isEnrolled).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(dummyPrograms.reduce((sum, p) => sum + p.rating, 0) / dummyPrograms.length).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search programs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedProgram(program)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                  {program.isEnrolled && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Enrolled
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{program.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {program.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {program.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {program.enrolled}/{program.capacity} enrolled
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(program.category)}`}>
                    {program.category}
                  </span>
                  <div className="flex items-center">
                    {renderStars(program.rating)}
                    <span className="text-xs text-gray-600 ml-1">({program.reviews})</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProgram(program);
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    Details
                  </button>
                  {!program.isEnrolled && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnroll(program.id);
                      }}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      Enroll
                    </button>
                  )}
                  {program.isEnrolled && (
                    <button
                      className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg text-sm cursor-not-allowed"
                      disabled
                    >
                      Enrolled
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Program Detail Modal */}
        {selectedProgram && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedProgram.name}</h2>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedProgram.category)}`}>
                        {selectedProgram.category}
                      </span>
                      {selectedProgram.isEnrolled && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Enrolled
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProgram(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Plus className="h-6 w-6 rotate-45" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700">{selectedProgram.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Program Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Duration:</span>
                          <span className="text-gray-900">{selectedProgram.duration}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Location:</span>
                          <span className="text-gray-900">{selectedProgram.location}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Start Date:</span>
                          <span className="text-gray-900">{formatDate(selectedProgram.startDate)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">End Date:</span>
                          <span className="text-gray-900">{formatDate(selectedProgram.endDate)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Coordinator:</span>
                          <span className="text-gray-900">{selectedProgram.coordinator}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Enrollment:</span>
                          <span className="text-gray-900">{selectedProgram.enrolled}/{selectedProgram.capacity}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Rating & Reviews</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          {renderStars(selectedProgram.rating)}
                          <span className="ml-2 text-sm text-gray-600">
                            {selectedProgram.rating} ({selectedProgram.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Requirements</h4>
                    <div className="space-y-2">
                      {selectedProgram.requirements.map((requirement, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-gray-700">{requirement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Benefits</h4>
                    <div className="space-y-2">
                      {selectedProgram.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedProgram(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                  {!selectedProgram.isEnrolled && (
                    <button
                      onClick={() => {
                        handleEnroll(selectedProgram.id);
                        setSelectedProgram(null);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Enroll Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enrollment Modal */}
        {showEnrollmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Enroll in Program</h3>
                <p className="text-gray-600 mb-6">
                  Program enrollment functionality would be implemented here with a form for application details and requirements submission.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowEnrollmentModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowEnrollmentModal(false)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPrograms; 
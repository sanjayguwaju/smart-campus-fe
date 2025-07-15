import React from 'react';
import { GraduationCap, Clock, BookOpen, Users, MapPin, FileText, ExternalLink } from 'lucide-react';
import { studentPrograms } from '../../data/studentDummyData';

const Programs: React.FC = () => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Undergraduate':
        return 'bg-blue-100 text-blue-800';
      case 'Postgraduate':
        return 'bg-green-100 text-green-800';
      case 'Professional':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Computer Engineering':
        return 'bg-indigo-100 text-indigo-800';
      case 'Electrical Engineering':
        return 'bg-orange-100 text-orange-800';
      case 'Civil Engineering':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academic Programs</h1>
          <p className="text-gray-600 mt-2">Explore our comprehensive range of academic programs</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Programs</p>
          <p className="text-2xl font-bold text-blue-600">{studentPrograms.length}</p>
        </div>
      </div>

      {/* Program Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Undergraduate</p>
              <p className="text-2xl font-bold text-blue-600">
                {studentPrograms.filter(program => program.level === 'Undergraduate').length}
              </p>
            </div>
            <GraduationCap className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Postgraduate</p>
              <p className="text-2xl font-bold text-green-600">
                {studentPrograms.filter(program => program.level === 'Postgraduate').length}
              </p>
            </div>
            <BookOpen className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Professional</p>
              <p className="text-2xl font-bold text-purple-600">
                {studentPrograms.filter(program => program.level === 'Professional').length}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Departments</p>
              <p className="text-2xl font-bold text-orange-600">
                {new Set(studentPrograms.map(program => program.department)).size}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {studentPrograms.map((program) => (
          <div key={program.programId} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
            {/* Program Image */}
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
              <img 
                src={program.image} 
                alt={program.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute top-4 left-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(program.level)}`}>
                  {program.level}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(program.department)}`}>
                  {program.department}
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Program Header */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{program.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{program.description}</p>
              </div>

              {/* Program Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Duration: {program.duration}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{program.semesters} Semesters</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{program.prerequisites.length} Prerequisites</span>
                </div>
              </div>

              {/* Prerequisites */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Prerequisites:</h4>
                <div className="flex flex-wrap gap-1">
                  {program.prerequisites.map((prereq, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {prereq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Apply Now
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Brochure
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Program Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {studentPrograms.filter(program => program.level === 'Undergraduate').length}
            </div>
            <div className="text-sm text-gray-600">Undergraduate</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {studentPrograms.filter(program => program.level === 'Postgraduate').length}
            </div>
            <div className="text-sm text-gray-600">Postgraduate</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {studentPrograms.filter(program => program.level === 'Professional').length}
            </div>
            <div className="text-sm text-gray-600">Professional</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {new Set(studentPrograms.map(program => program.department)).size}
            </div>
            <div className="text-sm text-gray-600">Departments</div>
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Programs by Department</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from(new Set(studentPrograms.map(program => program.department))).map((department) => (
            <div key={department} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {studentPrograms.filter(program => program.department === department).length}
              </div>
              <div className="text-sm text-gray-600">{department}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Programs; 
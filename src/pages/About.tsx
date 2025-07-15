import React from 'react';
import { GraduationCap, Users, Calendar, Award, Globe, Target, Heart, Zap } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { number: '3', label: 'Team Members', icon: Users },
    { number: '5', label: 'Modules Built', icon: Award },
    { number: '20+', label: 'Test Users', icon: GraduationCap },
    { number: '0', label: 'Campus Events Managed', icon: Calendar },
  ];

  const values = [
    {
      icon: Target,
      title: 'Collaboration',
      description: 'Working together as a team to solve real problems and support each other throughout the project.',
    },
    {
      icon: Heart,
      title: 'Learning',
      description: 'Embracing new technologies and concepts, and growing our skills through hands-on experience.',
    },
    {
      icon: Globe,
      title: 'Practicality',
      description: 'Focusing on building features that are useful and relevant for our campus community.',
    },
    {
      icon: Zap,
      title: 'Growth',
      description: 'Continuously improving our project and ourselves, both technically and personally.',
    },
  ];

  const timeline = [
    {
      year: 'Jan 2025',
      title: 'Project Kickoff',
      description: 'Formed our team and chose Smart Campus as our college project idea.',
    },
    {
      year: 'Feb 2025',
      title: 'Planning & Prototyping',
      description: 'Outlined features, designed wireframes, and started building the core modules.',
    },
    {
      year: 'Mar 2025',
      title: 'First Demo',
      description: 'Presented our MVP to faculty and classmates for initial feedback.',
    },
    {
      year: 'Apr 2025',
      title: 'Campus Testing',
      description: 'Tested the platform with a small group of students and improved based on their input.',
    },
    {
      year: 'Now',
      title: 'Ongoing Development',
      description: 'Continuing to refine features and documentation as part of our college project journey.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Smart Campus
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Transforming education through technology, innovation, and community engagement
            </p>
            <div className="flex justify-center">
              <GraduationCap className="h-16 w-16 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
            We want to be a leader in smart education — known for our creative approach to learning, groundbreaking research, and most importantly, helping our students succeed.

We see a future where technology makes learning better, easier, and more accessible for everyone. By continually innovating and working together, we’re shaping the future of education and empowering the next generation to lead, create, and solve big challenges.
            </p>
            <p className="text-lg text-gray-600">
              Our commitment to excellence extends beyond the classroom, as we prepare students to become 
              responsible global citizens and leaders in their chosen fields.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
            <p className="text-lg text-gray-600 mb-6">
             we dream of a future where technology makes learning better, easier, and more accessible for everyone.
             through continuous innovation and collaboration, we're thinking how education works--making it more accessible in one place.
             out vision if simple:empower students to be creative and keep building technology that helps them succeed.
            </p>
            <p className="text-lg text-gray-600">
              Through continuous innovation and collaboration, we aim to shape the future of education 
              and empower the next generation of leaders, thinkers, and innovators.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">By The Numbers</h2>
            <p className="text-lg text-gray-600">Our impact in numbers</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-12 w-12 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
          <p className="text-lg text-gray-600">The principles that guide everything we do</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                <value.icon className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">Key milestones in our development</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-blue-200"></div>
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="w-1/2 px-8">
                    <div className={`bg-white p-6 rounded-lg shadow-md ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <div className="text-2xl font-bold text-blue-600 mb-2">{item.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-md"></div>
                  <div className="w-1/2 px-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Be part of an innovative educational experience that prepares you for the future
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Apply Now
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 
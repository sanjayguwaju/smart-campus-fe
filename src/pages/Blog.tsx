import React, { useEffect, useState } from 'react';
import { Calendar, User, Tag, ArrowRight, Search, Filter } from 'lucide-react';
import { getBlogs } from '../api/services/blogService'

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: Date;
  category: string;
  image: string;
  tags: string[];
  readTime: string;
}

const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { key: 'all', name: 'All Posts' },
    { key: 'academic', name: 'Academic' },
    { key: 'technology', name: 'Technology' },
    { key: 'student-life', name: 'Student Life' },
    { key: 'research', name: 'Research' },
    { key: 'events', name: 'Events' },
  ];

  const [blogs,setBlogs]= useState()
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getBlogs();
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
      fetchBlogs();
    };
    getBlogs()
  },[])
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'The Future of Smart Education: How Technology is Transforming Learning',
      excerpt: 'Explore how artificial intelligence, virtual reality, and other cutting-edge technologies are reshaping the educational landscape and creating new opportunities for students and educators alike.',
      content: 'Full article content here...',
      author: 'Dr. Sarah Johnson',
      publishDate: new Date('2024-03-10'),
      category: 'technology',
      image: '/images/blog/smart-education.jpg',
      tags: ['AI', 'Education', 'Technology'],
      readTime: '5 min read',
    },
    {
      id: '2',
      title: 'Building a Strong Academic Community: Tips for Student Success',
      excerpt: 'Discover practical strategies for building meaningful connections with peers and faculty, and learn how a strong academic community can enhance your educational experience.',
      content: 'Full article content here...',
      author: 'Prof. Michael Brown',
      publishDate: new Date('2024-03-08'),
      category: 'student-life',
      image: '/images/blog/academic-community.jpg',
      tags: ['Community', 'Success', 'Networking'],
      readTime: '4 min read',
    },
    {
      id: '3',
      title: 'Research Spotlight: Breakthrough Discoveries in Computer Science',
      excerpt: 'Learn about the latest groundbreaking research being conducted by our faculty and students, and how these discoveries are advancing the field of computer science.',
      content: 'Full article content here...',
      author: 'Dr. Emily Davis',
      publishDate: new Date('2024-03-05'),
      category: 'research',
      image: '/images/blog/research-spotlight.jpg',
      tags: ['Research', 'Computer Science', 'Innovation'],
      readTime: '6 min read',
    },
    {
      id: '4',
      title: 'Campus Events That Bring Our Community Together',
      excerpt: 'From cultural festivals to academic conferences, discover the diverse range of events that make our campus a vibrant and engaging place to learn and grow.',
      content: 'Full article content here...',
      author: 'Student Affairs Team',
      publishDate: new Date('2024-03-03'),
      category: 'events',
      image: '/images/blog/campus-events.jpg',
      tags: ['Events', 'Community', 'Culture'],
      readTime: '3 min read',
    },
    {
      id: '5',
      title: 'Academic Excellence: Strategies for Maintaining High Performance',
      excerpt: 'Explore proven techniques for maintaining academic excellence while balancing coursework, extracurricular activities, and personal well-being.',
      content: 'Full article content here...',
      author: 'Academic Success Center',
      publishDate: new Date('2024-02-28'),
      category: 'academic',
      image: '/images/blog/academic-excellence.jpg',
      tags: ['Academic Success', 'Study Tips', 'Wellness'],
      readTime: '7 min read',
    },
    {
      id: '6',
      title: 'The Impact of Digital Transformation on Higher Education',
      excerpt: 'How digital technologies are revolutionizing higher education, from online learning platforms to smart campus infrastructure.',
      content: 'Full article content here...',
      author: 'IT Department',
      publishDate: new Date('2024-02-25'),
      category: 'technology',
      image: '/images/blog/digital-transformation.jpg',
      tags: ['Digital', 'Transformation', 'Education'],
      readTime: '5 min read',
    },
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Smart Campus Blog
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Insights, stories, and updates from our community
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Filter className="h-5 w-5 text-gray-500 mt-3" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Post */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="h-64 md:h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg">Featured Article</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {featuredPost.category}
                </span>
                <span className="mx-2">•</span>
                <span>{featuredPost.readTime}</span>
                <span className="mx-2">•</span>
                <span>{featuredPost.publishDate.toLocaleDateString()}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{featuredPost.title}</h2>
              <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{featuredPost.author}</span>
                </div>
                <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  Read More
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.slice(1).map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <Tag className="h-12 w-12 text-gray-400" />
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{post.author}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {post.publishDate.toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Read Article
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-lg text-gray-600 mb-8">
            Subscribe to our newsletter for the latest articles, events, and campus updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog; 
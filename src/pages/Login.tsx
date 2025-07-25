import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Toaster, toast } from 'react-hot-toast';

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      // Trim whitespace from email and password
      const trimmedEmail = data.email.trim();
      const trimmedPassword = data.password.trim();
      
      const success = await login(trimmedEmail, trimmedPassword);
      if (success) {
        toast.success('Login successful!');
        // Use a small delay to ensure the store is updated
        setTimeout(() => {
          const currentUser = useAuthStore.getState().user;
          if (currentUser) {
            // Redirect based on user role
            switch (currentUser.role) {
              case 'admin':
                navigate('/admin');
                break;
              case 'faculty':
                navigate('/faculty');
                break;
              case 'student':
                navigate('/student');
                break;
              default:
                navigate('/dashboard');
            }
          }
        }, 100);
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('An error occurred during login');
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center">
            <LogIn className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Access your Smart Campus portal
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <Link
                to="/reset-password-request"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Reset password request
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  Sign up here
                </Link>
              </span>
            </div>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-gray-500">
              <p><strong>Admin:</strong> admin@smartcampus.com / Test123@#</p>
              <p><strong>Faculty:</strong> faculty@smartcampus.com / Test123@#</p>
              <p><strong>Student:</strong> student@smartcampus.com / Test123@#</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
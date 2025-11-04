'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  EyeIcon, 
  EyeSlashIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BoltIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string; password: string }>();

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const features = [
    { icon: ChartBarIcon, text: 'Real-time Analytics' },
    { icon: ShieldCheckIcon, text: 'Enterprise Security' },
    { icon: BoltIcon, text: 'Lightning Fast' },
    { icon: ClockIcon, text: '24/7 Support' },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-soft"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Left side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 relative z-10">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="animate-fade-in">
            <div className="flex items-center mb-2">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 transform transition-transform hover:scale-105">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {/* Wave/Water icon */}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 14c2-1 4-1 6 0s4-1 6 0 4-1 6 0" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 18c2-1 4-1 6 0s4-1 6 0 4-1 6 0" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10c2-1 4-1 6 0s4-1 6 0 4-1 6 0" />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Water Docking</h1>
                <p className="text-sm text-gray-500 font-medium">Management System</p>
              </div>
            </div>
            <h2 className="mt-10 text-2xl font-bold text-gray-900">
             Sign In
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to continue managing your marina operations
            </p>
          </div>

          <div className="mt-8 animate-slide-up">
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    autoComplete="email"
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 sm:text-sm transition-all duration-200 bg-white hover:border-gray-400"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="appearance-none block w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 sm:text-sm transition-all duration-200 bg-white hover:border-gray-400"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 font-medium">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
{/* 
              <div className="text-center pt-2">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                    Sign up
                  </Link>
                </p>
              </div> */}
            </form>
          </div>

          {/* Copyright Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              Made with <span className="text-red-500">❤️</span> by{' '}
              <a 
                href="https://prosper-mapepa-portfolio.netlify.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Prosper Mapepa
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Hero Panel */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          {/* Floating shapes */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse-soft"></div>
          <div className="absolute bottom-32 left-20 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse-soft" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse-soft" style={{ animationDelay: '0.5s' }}></div>

          <div className="relative h-full flex flex-col items-center justify-center p-12 text-white">
            <div className="max-w-md text-center space-y-8 animate-fade-in">
              {/* Logo icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl transform transition-transform hover:scale-105">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-400 rounded-full animate-ping"></div>
                </div>
              </div>

              {/* Main headline */}
              <div>
                <h3 className="text-4xl font-bold mb-4 tracking-tight">
                  Manage Your Marina
                </h3>
                <p className="text-lg text-primary-100 leading-relaxed">
                  Streamline operations with our comprehensive water docking management system
                </p>
              </div>

              {/* Feature highlights */}
              <div className="pt-8 border-t border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div 
                        key={index}
                        className="flex items-center space-x-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-200 transform hover:scale-105"
                      >
                        <Icon className="w-5 h-5 text-white flex-shrink-0" />
                        <span className="text-sm font-medium text-white">{feature.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats or benefits */}
              <div className="pt-6 space-y-4">
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold">99.9%</div>
                    <div className="text-xs text-primary-200 uppercase tracking-wide">Uptime</div>
                  </div>
                  <div className="w-px h-12 bg-white/30"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">90+</div>
                    <div className="text-xs text-primary-200 uppercase tracking-wide">Docks</div>
                  </div>
                  <div className="w-px h-12 bg-white/30"></div>
                  {/* <div className="text-center">
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-xs text-primary-200 uppercase tracking-wide">Marinas</div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



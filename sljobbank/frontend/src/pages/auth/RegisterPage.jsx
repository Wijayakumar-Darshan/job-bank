import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authApi } from '@/api';
import { useAuthStore } from '@/store/authStore';

const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070',
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  // Dynamic Background Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  async function onSubmit(data) {
    setLoading(true);
    try {
      const res = await authApi.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password
      });

      const { user, token } = res.data;
      setAuth(user, token);

      toast.success('Account created successfully! Welcome to SL Job Bank 🎉');
      navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-all duration-1000"
      style={{
        backgroundImage: `url(${BACKGROUND_IMAGES[currentBgIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 left-12 text-7xl opacity-20">🌟</div>
        <div className="absolute bottom-32 right-20 text-6xl opacity-20">🚀</div>
        <div className="absolute top-1/3 right-1/3 text-5xl opacity-20">💼</div>
      </div>

      <div className="w-full max-w-[460px] relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl mb-6 text-6xl shadow-2xl border border-white/20">
            🇱🇰
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tighter mb-3 drop-shadow-md">SL Job Bank</h1>
          <p className="text-xl text-white/90">Start Your Career Journey Today</p>
        </div>

        {/* Motivational Message */}
        <div className="text-center mb-8 px-4">
          <p className="text-white/95 text-[17px] leading-relaxed">
            Join thousands of students discovering their dream careers.<br />
            <span className="text-[#A1E8C9] font-medium">Your future is waiting.</span>
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/30">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
            <Link 
              to="/login" 
              className="flex-1 py-3.5 text-center font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Sign In
            </Link>
            <div className="flex-1 py-3.5 text-center font-semibold bg-white rounded-[14px] shadow text-[#0A2E1C]">
              Register
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                placeholder="Enter your full name"
                className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-[#1A9A7E] focus:ring-1 focus:ring-[#1A9A7E] text-base transition-all"
                {...register('fullName', { 
                  required: 'Full name is required', 
                  minLength: { value: 2, message: 'Name is too short' } 
                })}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="student@example.com"
                className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-[#1A9A7E] focus:ring-1 focus:ring-[#1A9A7E] text-base transition-all"
                {...register('email', { 
                  required: 'Email is required', 
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' } 
                })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-[#1A9A7E] focus:ring-1 focus:ring-[#1A9A7E] text-base transition-all"
                {...register('password', { 
                  required: 'Password is required', 
                  minLength: { value: 6, message: 'Password must be at least 6 characters' } 
                })}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter your password"
                className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-[#1A9A7E] focus:ring-1 focus:ring-[#1A9A7E] text-base transition-all"
                {...register('confirm', { 
                  validate: v => v === watch('password') || 'Passwords do not match' 
                })}
              />
              {errors.confirm && <p className="text-red-500 text-sm mt-1">{errors.confirm.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#1A9A7E] to-[#17876D] hover:brightness-110 active:scale-[0.985] transition-all text-white font-semibold py-4 rounded-2xl text-lg shadow-lg disabled:opacity-70"
            >
              {loading ? 'Creating your account...' : 'Create Account & Start Exploring'}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-8 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0A2E1C] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <p className="text-center text-white/70 text-xs mt-8 tracking-wide">
          Every great career starts with the first step ✨
        </p>
      </div>
    </div>
  );
}
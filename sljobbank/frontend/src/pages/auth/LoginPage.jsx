import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authApi } from '@/api';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';

const ROLE_ROUTES = {
  STUDENT: '/student/dashboard',
  COUNSELOR: '/counselor/dashboard',
  SUPER_ADMIN: '/admin/dashboard',
};

// Beautiful career-themed background images (you can replace with your own)
const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070',
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { setSettings } = useSettingsStore();
  
  const [loading, setLoading] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // Dynamic Background Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 7000); // Change image every 7 seconds

    return () => clearInterval(interval);
  }, []);

  async function onSubmit(data) {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      const { user, token, systemSettings } = res.data.data;

      setAuth(user, token);
      if (systemSettings) setSettings(systemSettings);

      toast.success(`Welcome back, ${user.fullName.split(' ')[0]}! 👋`);

      if (systemSettings?.paidModeEnabled && 
          user.role === 'STUDENT' && 
          user.subscriptionType !== 'PAID') {
        navigate('/student/subscription');
      } else {
        navigate(ROLE_ROUTES[user.role] || '/student/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  }

  const fillDemo = (email, password) => {
    setValue('email', email);
    setValue('password', password);
  };

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

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-7xl opacity-20">🚀</div>
        <div className="absolute bottom-40 right-20 text-6xl opacity-20">🎯</div>
        <div className="absolute top-1/2 left-1/4 text-5xl opacity-20">💼</div>
      </div>

      <div className="w-full max-w-[460px] relative z-10">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl mb-6 text-6xl shadow-2xl border border-white/20">
            🇱🇰
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tighter mb-3 drop-shadow-md">SL Job Bank</h1>
          <p className="text-xl text-white/90">Dream Big • Work Hard • Achieve More</p>
        </div>

        {/* Motivational Message */}
        <div className="text-center mb-8">
          <p className="text-white/95 text-[17px] max-w-xs mx-auto leading-relaxed">
            Your future is full of possibilities.<br />
            <span className="text-[#A1E8C9] font-medium">Start exploring careers today.</span>
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/30">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
            <div className="flex-1 py-3.5 text-center font-semibold bg-white rounded-[14px] shadow text-[#0A2E1C]">
              Sign In
            </div>
            <Link 
              to="/register" 
              className="flex-1 py-3.5 text-center font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Join Now
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-[#1A9A7E] focus:ring-1 focus:ring-[#1A9A7E] text-base transition-all"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-sm text-[#1A9A7E] hover:underline">Forgot password?</Link>
              </div>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-[#1A9A7E] focus:ring-1 focus:ring-[#1A9A7E] text-base transition-all"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#1A9A7E] to-[#17876D] hover:brightness-110 active:scale-[0.985] transition-all text-white font-semibold py-4 rounded-2xl text-lg shadow-lg disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign In & Explore Your Future'}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-8 text-sm">
            New here?{' '}
            <Link to="/register" className="text-[#0A2E1C] font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </div>

        <p className="text-center text-white/70 text-xs mt-8 tracking-wide">
          Your career journey begins with a single step ✨
        </p>
      </div>
    </div>
  );
}
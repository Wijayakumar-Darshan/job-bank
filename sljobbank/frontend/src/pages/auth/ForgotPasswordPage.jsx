import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authApi } from '@/api';

const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070',
];

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Dynamic Background Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  async function onSubmit({ email }) {
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
      toast.success('Password reset link has been sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send reset email.');
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
        <div className="absolute top-32 left-16 text-7xl opacity-20">🔑</div>
        <div className="absolute bottom-40 right-24 text-6xl opacity-20">📧</div>
      </div>

      <div className="w-full max-w-[460px] relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl mb-6 text-6xl shadow-2xl border border-white/20">
            🇱🇰
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tighter mb-3 drop-shadow-md">SL Job Bank</h1>
          <p className="text-xl text-white/90">Don't worry, we've got you covered</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/30">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔑</div>
            <h2 className="text-3xl font-semibold text-[#0F2C24]">Forgot Password?</h2>
            <p className="text-gray-600 mt-3 text-[15px]">
              No problem! We'll send you a link to reset it.
            </p>
          </div>

          {sent ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-6">📧</div>
              <h3 className="text-xl font-semibold text-emerald-700 mb-3">Reset Link Sent!</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We've sent a password reset link to your email.<br />
                Please check your inbox (and spam folder).
              </p>
              <Link 
                to="/login" 
                className="inline-block bg-[#1A9A7E] text-white px-10 py-4 rounded-2xl font-semibold hover:bg-[#17876D] transition-all"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-[#1A9A7E] focus:ring-1 focus:ring-[#1A9A7E] text-base transition-all"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1.5">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#1A9A7E] to-[#17876D] hover:brightness-110 active:scale-[0.985] transition-all text-white font-semibold py-4 rounded-2xl text-lg shadow-lg disabled:opacity-70"
              >
                {loading ? 'Sending reset link...' : 'Send Reset Link'}
              </button>

              <p className="text-center">
                <Link to="/login" className="text-[#0A2E1C] font-medium hover:underline flex items-center justify-center gap-2">
                  ← Back to Login
                </Link>
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-white/70 text-xs mt-8">
          Need help? Contact your school counselor
        </p>
      </div>
    </div>
  );
}
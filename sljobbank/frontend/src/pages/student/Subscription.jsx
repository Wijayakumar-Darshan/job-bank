import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { subscriptionApi } from '@/api';
import toast from 'react-hot-toast';

export default function SubscriptionPage() {
  const { user } = useAuthStore();
  const [plan, setPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);

  const prices = { monthly: 990, yearly: 8900 };

  const handleSubscribe = async () => {
    if (!user?.id) {
      toast.error("Please login to subscribe");
      return;
    }

    setLoading(true);
    try {
      const res = await subscriptionApi.initiatePayment(user.id, plan);
      
      toast.success("Payment initiated successfully!");
      
      // TODO: Redirect to payment gateway in production
      console.log("Payment Response:", res.data);
      // window.location.href = res.data.data.paymentUrl || '#';
      
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Payment initiation failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // If already paid
  if (user?.subscriptionType === 'PAID') {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-3xl font-bold mb-4">Subscription Active</h2>
        <p className="text-gray-600">You have full access to all premium features.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Upgrade Your Career Journey</h1>
        <p className="text-gray-600 mb-12">
          Unlock full access to 600+ careers, institute fees, and salary data
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {['monthly', 'yearly'].map((p) => (
            <div
              key={p}
              onClick={() => setPlan(p)}
              className={`bg-white rounded-3xl p-8 border-2 cursor-pointer transition-all ${
                plan === p 
                  ? 'border-teal-600 shadow-xl scale-[1.02]' 
                  : 'border-gray-200 hover:border-teal-200'
              }`}
            >
              <h3 className="text-2xl font-bold capitalize">{p} Plan</h3>
              
              <div className="mt-6">
                <span className="text-5xl font-bold">LKR {prices[p]}</span>
                <span className="text-gray-500">/{p === 'monthly' ? 'month' : 'year'}</span>
              </div>

              <ul className="mt-8 space-y-3 text-left text-sm">
                {[
                  "600+ Career Profiles",
                  "Live Institute Fees",
                  "A/L Requirements",
                  "Salary Projections",
                  "PDF Guides"
                ].map(item => (
                  <li key={item} className="flex items-center gap-2">✅ {item}</li>
                ))}
              </ul>

              <button
                onClick={handleSubscribe}
                disabled={loading}
                className={`mt-10 w-full py-4 rounded-2xl font-semibold transition-all ${
                  plan === p 
                    ? 'bg-teal-600 text-white hover:bg-teal-700' 
                    : 'border-2 border-teal-600 text-teal-700 hover:bg-teal-50'
                }`}
              >
                {loading ? 'Processing...' : plan === p ? 'Subscribe Now' : 'Choose Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
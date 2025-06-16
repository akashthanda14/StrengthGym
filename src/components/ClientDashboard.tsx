import React, { useEffect, useState } from 'react';
import { Loader2, User, Mail, Phone, Calendar, Clock, Award, AlertCircle } from 'lucide-react';

const ClientDashboard: React.FC = () => {
  interface PlanData {
    name: string;
    email: string;
    phoneNumber: string;
    planName: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly';
    startDate: string;
    lastWorkout?: string;
    workoutsThisMonth?: number;
  }

  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClientPlan();
  }, []);

  const fetchClientPlan = async () => {
    try {
      const res = await fetch('https://strengthgymbackend.onrender.com/api/plan/myplan', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();

      if (res.status === 404 || data?.plan === null || Object.keys(data).length === 0) {
        setPlan(null); // no plan assigned
      } else if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch plan');
      } else {
        setPlan(data);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const calculateExpiryDate = (startDate: string, planName: string): Date => {
    const start = new Date(startDate);
    switch (planName) {
      case 'Monthly': return new Date(start.setMonth(start.getMonth() + 1));
      case 'Quarterly': return new Date(start.setMonth(start.getMonth() + 3));
      case 'Half-Yearly': return new Date(start.setMonth(start.getMonth() + 6));
      case 'Yearly': return new Date(start.setMonth(start.getMonth() + 12));
      default: return start;
    }
  };

  const getDaysLeft = (expiryDate: Date) => {
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
  };

  const getPlanProgress = (expiryDate: Date, startDate: string) => {
    const start = new Date(startDate);
    const totalDays = Math.ceil((expiryDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const daysUsed = totalDays - getDaysLeft(expiryDate);
    return Math.min(Math.round((daysUsed / totalDays) * 100), 100);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#15171b] flex items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-[#8b0000]" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#15171b] flex items-center justify-center">
      <div className="bg-[#2A2D33] p-6 rounded-xl max-w-md text-center">
        <AlertCircle className="h-10 w-10 text-[#8b0000] mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Dashboard</h2>
        <p className="text-gray-300 mb-4">{error}</p>
        <button 
          onClick={fetchClientPlan}
          className="bg-[#8b0000] hover:bg-[#a52a2a] text-white px-6 py-2 rounded-full"
        >
          Retry
        </button>
      </div>
    </div>
  );

  // No plan assigned
  if (!plan) return (
    <div className="min-h-screen bg-[#15171b] flex items-center justify-center">
      <div className="bg-[#2A2D33] p-6 rounded-xl max-w-md text-center">
        <AlertCircle className="h-10 w-10 text-[#8b0000] mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Active Plan</h2>
        <p className="text-gray-300 mb-4">You don't have an active membership plan.</p>
        <a
          href="#pricing"
          className="inline-block bg-[#8b0000] hover:bg-[#a52a2a] text-white px-6 py-2 rounded-full"
        >
          View Plans
        </a>
      </div>
    </div>
  );

  const expiryDate = calculateExpiryDate(plan.startDate, plan.planName);
  const daysLeft = getDaysLeft(expiryDate);
  const progress = getPlanProgress(expiryDate, plan.startDate);

  return (
    <div className="min-h-screen bg-[#15171b] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome Back, {plan.name}</h1>

        {/* Plan Status */}
        <div className="bg-[#2A2D33] rounded-xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Award className="text-[#8b0000]" /> {plan.planName} Membership
              </h2>
              <p className="text-gray-400 text-sm">
                Started on {new Date(plan.startDate).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-[#8b0000]/20 px-4 py-2 rounded-full">
              <span className="font-medium">
                {daysLeft} {daysLeft === 1 ? 'day' : 'days'} remaining
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Plan Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-[#3a3e46] rounded-full h-2.5">
              <div className="bg-[#8b0000] h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-[#3a3e46]/50 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Expiry Date</p>
              <p className="font-medium">{expiryDate.toLocaleDateString()}</p>
            </div>
            <div className="bg-[#3a3e46]/50 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Last Workout</p>
              <p className="font-medium">
                {plan.lastWorkout ? new Date(plan.lastWorkout).toLocaleDateString() : 'Never'}
              </p>
            </div>
            <div className="bg-[#3a3e46]/50 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Workouts This Month</p>
              <p className="font-medium">{plan.workoutsThisMonth || 0}</p>
            </div>
            <div className="bg-[#3a3e46]/50 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Plan Type</p>
              <p className="font-medium">{plan.planName}</p>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-[#2A2D33] rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="text-[#8b0000]" /> Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#3a3e46]/50 p-2 rounded-full"><Mail className="h-5 w-5 text-[#8b0000]" /></div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="font-medium">{plan.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[#3a3e46]/50 p-2 rounded-full"><Phone className="h-5 w-5 text-[#8b0000]" /></div>
              <div>
                <p className="text-gray-400 text-sm">Phone</p>
                <p className="font-medium">{plan.phoneNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[#3a3e46]/50 p-2 rounded-full"><Calendar className="h-5 w-5 text-[#8b0000]" /></div>
              <div>
                <p className="text-gray-400 text-sm">Member Since</p>
                <p className="font-medium">{new Date(plan.startDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[#3a3e46]/50 p-2 rounded-full"><Clock className="h-5 w-5 text-[#8b0000]" /></div>
              <div>
                <p className="text-gray-400 text-sm">Membership Status</p>
                <p className="font-medium">
                  {daysLeft > 7 ? 'Active' : daysLeft > 0 ? 'Expiring Soon' : 'Expired'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-[#8b0000] hover:bg-[#a52a2a] text-white py-3 px-4 rounded-lg transition-colors">
            Book Session
          </button>
          <button className="bg-[#3a3e46] hover:bg-[#4a4e56] text-white py-3 px-4 rounded-lg transition-colors">
            View Progress
          </button>
          <button className="bg-[#3a3e46] hover:bg-[#4a4e56] text-white py-3 px-4 rounded-lg transition-colors">
            Workout History
          </button>
          <button className="bg-[#3a3e46] hover:bg-[#4a4e56] text-white py-3 px-4 rounded-lg transition-colors">
            Renew Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;

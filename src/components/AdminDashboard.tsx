import React, { useEffect, useState } from 'react';
import { Loader2, User, Mail, Calendar, Award, AlertCircle, PlusCircle } from 'lucide-react';

const planOptions = [
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Quarterly', value: 'Quarterly' },
  { label: 'Half-Yearly', value: 'Half-Yearly' },
  { label: 'Yearly', value: 'Yearly' },
] as const;

type PlanOption = typeof planOptions[number]['value'];

interface Client {
  id?: string; // Make id optional
  name: string;
  email: string;
  phoneNumber: string;
  planName: PlanOption | null;
  startDate: string | null;
  expiryDate: string | null;
}

const AdminDashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newPlan, setNewPlan] = useState<{
    planName: PlanOption;
    startDate: string;
  }>({
    planName: 'Monthly',
    startDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('https://strengthgymbackend.onrender.com/api/plan/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      
      setClients(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch clients');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateExpiryDate = (startDate: string, planName: PlanOption): string => {
    try {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) throw new Error('Invalid start date');
      
      let expiry = new Date(start);
      
      switch (planName) {
        case 'Monthly':
          expiry.setMonth(start.getMonth() + 1);
          break;
        case 'Quarterly':
          expiry.setMonth(start.getMonth() + 3);
          break;
        case 'Half-Yearly':
          expiry.setMonth(start.getMonth() + 6);
          break;
        case 'Yearly':
          expiry.setMonth(start.getMonth() + 12);
          break;
      }
      
      return expiry.toISOString().split('T')[0];
    } catch (err) {
      console.error('Error calculating expiry date:', err);
      return new Date().toISOString().split('T')[0]; // Fallback to today
    }
  };

  const updatePlan = async () => {
    if (!selectedClient) return;
    
    try {
      const expiryDate = calculateExpiryDate(newPlan.startDate, newPlan.planName);
      
      const res = await fetch('https://strengthgymbackend.onrender.com/api/plan/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
          email: selectedClient.email, 
          planName: newPlan.planName,
          startDate: newPlan.startDate,
          expiryDate
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.error) {
        throw new Error(data.message || 'Plan update failed');
      }
      
      setShowModal(false);
      fetchClients();
    } catch (err: any) {
      alert(err.message || 'Failed to update plan');
      console.error('Error updating plan:', err);
    }
  };

  const openPlanModal = (client: Client) => {
    setSelectedClient(client);
    setNewPlan({
      planName: client.planName || 'Monthly',
      startDate: client.startDate || new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
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
          onClick={fetchClients}
          className="bg-[#8b0000] hover:bg-[#a52a2a] text-white px-6 py-2 rounded-full"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#15171b] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Award className="text-[#8b0000]" /> Member Management
          </h1>
          <div className="text-gray-400">
            {clients.length} {clients.length === 1 ? 'Member' : 'Members'}
          </div>
        </div>

        {clients.length === 0 ? (
          <div className="bg-[#2A2D33] rounded-xl p-8 text-center">
            <p className="text-gray-400 text-lg">No members found</p>
            <button 
              onClick={fetchClients}
              className="mt-4 bg-[#8b0000] hover:bg-[#a52a2a] text-white px-6 py-2 rounded-full"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="bg-[#2A2D33] rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#3a3e46]">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Member</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Contact</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Plan</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Dates</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3a3e46]">
                  {clients.map((client) => (
                    <tr key={client.email} className="hover:bg-[#3a3e46]/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#8b0000]/20 p-2 rounded-full">
                            <User className="h-5 w-5 text-[#8b0000]" />
                          </div>
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-gray-400">
                              ID: {client.id ? client.id.substring(0, 8) : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-300">{client.email}</p>
                        <p className="text-sm text-gray-400">{client.phoneNumber || 'N/A'}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          client.planName 
                            ? 'bg-[#8b0000]/20 text-[#8b0000]' 
                            : 'bg-gray-700/50 text-gray-400'
                        }`}>
                          {client.planName || 'No Plan'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <p>Start: {formatDate(client.startDate)}</p>
                          <p>Expiry: {formatDate(client.expiryDate)}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => openPlanModal(client)}
                          className="bg-[#3a3e46] hover:bg-[#4a4e56] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                        >
                          <PlusCircle className="h-4 w-4" />
                          {client.planName ? 'Modify Plan' : 'Assign Plan'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Plan Assignment Modal */}
        {showModal && selectedClient && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#2A2D33] rounded-xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="text-[#8b0000]" />
                {selectedClient.planName ? 'Modify Plan' : 'Assign Plan'} for {selectedClient.name}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Plan Type</label>
                  <select
                    value={newPlan.planName}
                    onChange={(e) => setNewPlan({...newPlan, planName: e.target.value as PlanOption})}
                    className="w-full bg-[#3a3e46] border border-[#3a3e46] rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#8b0000] focus:border-transparent"
                  >
                    {planOptions.map((plan) => (
                      <option key={plan.value} value={plan.value}>{plan.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newPlan.startDate}
                    onChange={(e) => setNewPlan({...newPlan, startDate: e.target.value})}
                    className="w-full bg-[#3a3e46] border border-[#3a3e46] rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#8b0000] focus:border-transparent"
                  />
                </div>
                
                <div className="bg-[#3a3e46]/50 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">Estimated Expiry Date:</p>
                  <p className="font-medium">
                    {formatDate(calculateExpiryDate(newPlan.startDate, newPlan.planName))}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700/50"
                >
                  Cancel
                </button>
                <button
                  onClick={updatePlan}
                  className="bg-[#8b0000] hover:bg-[#a52a2a] text-white px-4 py-2 rounded-lg"
                >
                  Confirm Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
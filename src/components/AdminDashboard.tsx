import React, { useEffect, useState } from 'react';
import { Loader2, User, Mail, Calendar, Award, AlertCircle, PlusCircle, Search, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

const planOptions = [
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Quarterly', value: 'Quarterly' },
  { label: 'Half-Yearly', value: 'Half-Yearly' },
  { label: 'Yearly', value: 'Yearly' },
] as const;

type PlanOption = typeof planOptions[number]['value'];

interface Client {
  id?: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: keyof Client; direction: 'ascending' | 'descending'} | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'expired'>('all');

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
      return new Date().toISOString().split('T')[0];
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

  const handleSort = (key: keyof Client) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedClients = React.useMemo(() => {
    let sortableClients = [...clients];
    if (sortConfig !== null) {
      sortableClients.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableClients;
  }, [clients, sortConfig]);

  const filteredClients = React.useMemo(() => {
    let result = sortedClients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.phoneNumber && client.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (activeTab === 'active') {
      result = result.filter(client => {
        if (!client.expiryDate) return false;
        const expiry = new Date(client.expiryDate);
        return expiry >= new Date();
      });
    } else if (activeTab === 'expired') {
      result = result.filter(client => {
        if (!client.expiryDate) return false;
        const expiry = new Date(client.expiryDate);
        return expiry < new Date();
      });
    }

    return result;
  }, [sortedClients, searchTerm, activeTab]);

  const getSortIcon = (key: keyof Client) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? 
      <ChevronUp className="ml-1 h-4 w-4 inline" /> : 
      <ChevronDown className="ml-1 h-4 w-4 inline" />;
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-red-600" />
        <p className="mt-4 text-gray-400">Loading member data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl max-w-md text-center shadow-xl">
        <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-white">Error Loading Dashboard</h2>
        <p className="text-gray-300 mb-6">{error}</p>
        <button 
          onClick={fetchClients}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Award className="text-red-600" /> 
              <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                Member Management
              </span>
            </h1>
            <p className="text-gray-400 mt-1">Manage all member subscriptions and plans</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full md:w-64"
              />
            </div>
            <div className="text-gray-400 bg-gray-700 px-3 py-2 rounded-lg">
              {filteredClients.length} {filteredClients.length === 1 ? 'Member' : 'Members'}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
            >
              All Members
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'active' ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('expired')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'expired' ? 'bg-yellow-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
            >
              Expired
            </button>
          </div>
        </div>

        {filteredClients.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center shadow-lg">
            <div className="max-w-md mx-auto">
              <Mail className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">
                {searchTerm ? 'No matching members found' : 'No members available'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm ? 'Try a different search term' : 'Check back later or refresh the list'}
              </p>
              <button 
                onClick={fetchClients}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh List
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th 
                      onClick={() => handleSort('name')}
                      className="py-3 px-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center">
                        Member
                        {getSortIcon('name')}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('email')}
                      className="py-3 px-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center">
                        Contact
                        {getSortIcon('email')}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('planName')}
                      className="py-3 px-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center">
                        Plan
                        {getSortIcon('planName')}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('expiryDate')}
                      className="py-3 px-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center">
                        Status
                        {getSortIcon('expiryDate')}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredClients.map((client) => {
                    const isExpired = client.expiryDate ? new Date(client.expiryDate) < new Date() : false;
                    
                    return (
                      <tr key={client.email} className="hover:bg-gray-700/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-red-600/20 p-2 rounded-full">
                              <User className="h-5 w-5 text-red-400" />
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
                              ? 'bg-red-600/20 text-red-400' 
                              : 'bg-gray-700/50 text-gray-400'
                          }`}>
                            {client.planName || 'No Plan'}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <div className={`text-xs px-2 py-1 rounded-full w-fit mb-1 ${
                              isExpired 
                                ? 'bg-yellow-600/20 text-yellow-400' 
                                : 'bg-green-600/20 text-green-400'
                            }`}>
                              {isExpired ? 'Expired' : 'Active'}
                            </div>
                            <div className="text-sm text-gray-400">
                              {formatDate(client.expiryDate)}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => openPlanModal(client)}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                          >
                            <PlusCircle className="h-4 w-4" />
                            {client.planName ? 'Modify Plan' : 'Assign Plan'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Plan Assignment Modal */}
        {showModal && selectedClient && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="text-red-600" />
                  {selectedClient.planName ? 'Modify Plan' : 'Assign Plan'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  &times;
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-300">For: <span className="font-medium">{selectedClient.name}</span></p>
                <p className="text-sm text-gray-400">{selectedClient.email}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Plan Type</label>
                  <select
                    value={newPlan.planName}
                    onChange={(e) => setNewPlan({...newPlan, planName: e.target.value as PlanOption})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
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
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                  <p className="text-sm text-gray-400 mb-1">Estimated Expiry Date:</p>
                  <p className="font-medium text-lg">
                    {formatDate(calculateExpiryDate(newPlan.startDate, newPlan.planName))}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updatePlan}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
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
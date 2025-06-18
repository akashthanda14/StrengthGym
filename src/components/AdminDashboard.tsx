import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Loader2, User, Mail, Calendar, Award, AlertCircle, PlusCircle, Search,
  ChevronDown, ChevronUp, RefreshCw, Trash2, UserPlus
} from 'lucide-react';
// import { Footer } from './Footer'; // This import was causing the error, assuming Footer component is not provided or needed for this example

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
  phoneNumber?: string; // phoneNumber can be optional based on your data
  planName: PlanOption | null;
  startDate: string | null;
  expiryDate: string | null;
}

const AdminDashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const [newPlan, setNewPlan] = useState<{
    planName: PlanOption;
    startDate: string;
  }>({
    planName: 'Monthly',
    startDate: new Date().toISOString().split('T')[0]
  });

  // State for new user inputs
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: keyof Client; direction: 'ascending' | 'descending'} | null>(null);
  // Removed activeTab state, as per request

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      const res = await fetch('https://strengthgymbackend.onrender.com/api/plan/all', {
        headers: {
          Authorization: `Bearer ${token}`,
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
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const calculateExpiryDate = useCallback((startDate: string, planName: PlanOption): string => {
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
      // Fallback to today's date + 1 month for default if calculation fails
      const fallbackDate = new Date();
      fallbackDate.setMonth(fallbackDate.getMonth() + 1);
      return fallbackDate.toISOString().split('T')[0];
    }
  }, []);

  const updatePlan = useCallback(async () => {
    if (!selectedClient) return;

    try {
      const expiryDate = calculateExpiryDate(newPlan.startDate, newPlan.planName);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const res = await fetch('https://strengthgymbackend.onrender.com/api/plan/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: selectedClient.email,
          planName: newPlan.planName,
          startDate: newPlan.startDate,
          expiryDate
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      alert('Plan updated successfully!');
      setShowPlanModal(false);
      fetchClients();
    } catch (err: any) {
      alert(err.message || 'Failed to update plan');
      console.error('Error updating plan:', err);
    }
  }, [selectedClient, newPlan, calculateExpiryDate, fetchClients]);

  const openPlanModal = useCallback((client: Client) => {
    setSelectedClient(client);
    setNewPlan({
      planName: client.planName || 'Monthly',
      startDate: client.startDate || new Date().toISOString().split('T')[0]
    });
    setShowPlanModal(true);
  }, []);

  const formatDate = useCallback((dateString: string | null): string => {
    if (!dateString) return 'N/A';
    try {
      // Formats date to DD/MM/YYYY
      return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return 'Invalid Date';
    }
  }, []);

  const handleSort = useCallback((key: keyof Client) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  const getSortIcon = useCallback((key: keyof Client) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ?
      <ChevronUp className="ml-1 h-4 w-4 inline" /> :
      <ChevronDown className="ml-1 h-4 w-4 inline" />;
  }, [sortConfig]);

  const sortedClients = useMemo(() => {
    let sortableClients = [...clients];
    if (sortConfig !== null) {
      sortableClients.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle null/undefined values for sorting
        if (aValue === null || aValue === undefined) return sortConfig.direction === 'ascending' ? 1 : -1;
        if (bValue === null || bValue === undefined) return sortConfig.direction === 'ascending' ? -1 : 1;

        // Special handling for date fields
        if (sortConfig.key === 'startDate' || sortConfig.key === 'expiryDate') {
          const dateA = new Date(aValue as string).getTime();
          const dateB = new Date(bValue as string).getTime();
          return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
        }

        // Default comparison for strings/numbers
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        // Fallback for other types or if comparison fails
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

  const filteredClients = useMemo(() => {
    // Removed activeTab from dependency array and filtering logic
    let result = sortedClients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.phoneNumber && client.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    // No active/expired filtering needed here anymore
    return result;
  }, [sortedClients, searchTerm]);


  // --- Add User Functionality ---
  const handleAddUserChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({ ...prev, [name]: value }));
  }, []);

  const addUser = useCallback(async () => {
    try {
      const { name, email, password, phone } = newUserData;
      if (!name || !email || !password) {
        alert('Name, Email, and Password are required.');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const res = await fetch('https://strengthgymbackend.onrender.com/api/plan/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password, phone }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      alert('User added successfully!');
      setShowAddUserModal(false);
      setNewUserData({ name: '', email: '', password: '', phone: '' }); // Reset form
      fetchClients(); // Refresh client list
    } catch (err: any) {
      alert(err.message || 'Failed to add user');
      console.error('Error adding user:', err);
    }
  }, [newUserData, fetchClients]);

  // --- Delete User Functionality ---
  const openDeleteConfirmModal = useCallback((client: Client) => {
    setClientToDelete(client);
    setShowDeleteConfirmModal(true);
  }, []);

  const deleteUser = useCallback(async () => {
    if (!clientToDelete) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const res = await fetch('https://strengthgymbackend.onrender.com/api/plan/delete-user', {
        method: 'DELETE', // DELETE method for deletion
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: clientToDelete.email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      alert('User deleted successfully!');
      setShowDeleteConfirmModal(false);
      setClientToDelete(null); // Clear client to delete
      fetchClients(); // Refresh client list
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
      console.error('Error deleting user:', err);
    }
  }, [clientToDelete, fetchClients]);


  // Render loading state
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-red-600" />
        <p className="mt-4 text-gray-400">Loading member data...</p>
      </div>
    </div>
  );

  // Render error state
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div className="w-full">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 mb-1">
              <Award className="text-red-600" />
              <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                Member Management
              </span>
            </h1>
            <p className="text-gray-400">Manage all member subscriptions and plans</p>
          </div>

          <div className="w-full flex flex-col sm:flex-row items-end gap-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
              />
            </div>
            <div className="text-gray-400 bg-gray-700 px-3 py-2 rounded-lg min-w-[120px] text-center">
              {filteredClients.length} {filteredClients.length === 1 ? 'Member' : 'Members'}
            </div>
          </div>
        </div>

        {/* New User Button - simplified layout */}
        <div className="mb-6 text-right">
          <button
            onClick={() => setShowAddUserModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors inline-flex"
          >
            <UserPlus className="h-4 w-4" />
            Add New User
          </button>
        </div>


        {filteredClients.length === 0 && !loading ? (
          <div className="bg-gray-800 rounded-xl p-6 text-center shadow-lg">
            <div className="max-w-md mx-auto">
              <Mail className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">
                {searchTerm ? 'No matching members found' : 'No members available'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm ? 'Try a different search term' : 'Check back later or refresh the list or add a new user'}
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
          <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {filteredClients.map((client) => {
                // Determine if client is expired based on current date
                const isExpired = client.expiryDate ? new Date(client.expiryDate) < new Date() : false;

                return (
                  <div key={client.email} className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-600/20 p-2 rounded-full">
                          <User className="h-5 w-5 text-red-400" />
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-gray-400">{client.email}</p>
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        isExpired
                          ? 'bg-yellow-600/20 text-yellow-400'
                          : 'bg-green-600/20 text-green-400'
                      }`}>
                        {isExpired ? 'Expired' : 'Active'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div>
                        <p className="text-xs text-gray-400">Plan</p>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          client.planName
                            ? 'bg-red-600/20 text-red-400'
                            : 'bg-gray-600/50 text-gray-400'
                        }`}>
                          {client.planName || 'No Plan'}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Expires</p>
                        <p className="text-sm">{formatDate(client.expiryDate)}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => openPlanModal(client)}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <PlusCircle className="h-4 w-4" />
                        {client.planName ? 'Modify Plan' : 'Assign Plan'}
                      </button>
                      <button
                        onClick={() => openDeleteConfirmModal(client)}
                        className="bg-red-700 hover:bg-red-800 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-gray-800 rounded-xl shadow-lg overflow-hidden">
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
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-gray-300">{client.email}</p>
                            {client.phoneNumber && <p className="text-sm text-gray-500">{client.phoneNumber}</p>}
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
                            <div className="flex gap-2">
                              <button
                                onClick={() => openPlanModal(client)}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                              >
                                <PlusCircle className="h-4 w-4" />
                                {client.planName ? 'Modify Plan' : 'Assign Plan'}
                              </button>
                              <button
                                onClick={() => openDeleteConfirmModal(client)}
                                className="bg-red-700 hover:bg-red-800 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center transition-colors"
                                title="Delete User"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Plan Assignment Modal */}
        {showPlanModal && selectedClient && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3">
            <div className="bg-gray-800 rounded-xl p-4 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="text-red-600" />
                  {selectedClient.planName ? 'Modify Plan' : 'Assign Plan'}
                </h2>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
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

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updatePlan}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Confirm Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3">
            <div className="bg-gray-800 rounded-xl p-4 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <UserPlus className="text-red-600" />
                  Add New User
                </h2>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newUserData.name}
                    onChange={handleAddUserChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newUserData.email}
                    onChange={handleAddUserChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={newUserData.password}
                    onChange={handleAddUserChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="phone">Phone Number (Optional)</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={newUserData.phone}
                    onChange={handleAddUserChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addUser}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Add User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmModal && clientToDelete && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3">
            <div className="bg-gray-800 rounded-xl p-4 w-full max-w-md max-h-[90vh] overflow-y-auto text-center">
              <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Confirm Deletion</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete user "<span className="font-medium text-white">{clientToDelete.name}</span>" with email "<span className="font-medium text-white">{clientToDelete.email}</span>"? This action cannot be undone.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteConfirmModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteUser}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* <Footer/> */} {/* Removed Footer component to resolve compilation error */}
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Edit, 
  Trash2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Building2, 
  Search,
  Filter,
  ChevronDown,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { hospitalAPI } from '../api/hospitalAPI';
import { toast, Toaster } from 'react-hot-toast';

const HospitalList = ({ refreshTrigger, onEdit }) => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedHospital, setExpandedHospital] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchHospitals();
  }, [refreshTrigger]);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await hospitalAPI.getAll();
      setHospitals(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching hospitals:', err);
      setError('Failed to load hospitals. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await hospitalAPI.delete(id);
      toast.success('Hospital deleted successfully');
      fetchHospitals();
    } catch (err) {
      console.error('Error deleting hospital:', err);
      toast.error('Failed to delete hospital');
    }
  };

  const toggleExpand = (id) => {
    setExpandedHospital(expandedHospital === id ? null : id);
  };

  const renderRatingStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : i < rating
            ? 'text-yellow-400 fill-yellow-400 opacity-50'
            : 'text-white/20'
        }`}
      />
    ));
  };

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || hospital.city === selectedCity;
    const matchesSpeciality = !selectedSpeciality || 
      (hospital.speciality && hospital.speciality.includes(selectedSpeciality));
    return matchesSearch && matchesCity && matchesSpeciality;
  });

  const uniqueCities = [...new Set(hospitals.map(h => h.city))];
  const uniqueSpecialities = [...new Set(hospitals.flatMap(h => h.speciality || []))];

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedSpeciality('');
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15)_2px,_transparent_2px)] [background-size:48px_48px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <Toaster position="top-right" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block"
          >
            <div className="inline-flex items-center px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse mr-2" />
              <span className="text-sm text-white/80">Hospitals Directory</span>
            </div>
          </motion.div>

          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Find the Best Hospitals
          </motion.h2>
          <motion.p
            className="text-xl text-white/60 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Discover top-rated healthcare facilities in your area
          </motion.p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search hospitals..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 pl-10 text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              
              {/* Filter toggle button */}
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-indigo-500/20 text-indigo-300 px-4 py-3 rounded-lg flex items-center justify-center hover:bg-indigo-500/30 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </motion.button>
              
              {/* Reset filters button */}
              {(searchTerm || selectedCity || selectedSpeciality) && (
                <motion.button
                  onClick={resetFilters}
                  className="bg-red-500/20 text-red-300 px-4 py-3 rounded-lg flex items-center justify-center hover:bg-red-500/30 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  Clear Filters
                </motion.button>
              )}
            </div>
            
            {/* Expandable filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                    {/* City filter */}
                    <div>
                      <label className="block text-white/80 mb-2 text-sm font-medium">
                        Filter by City
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      >
                        <option value="">All Cities</option>
                        {uniqueCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Speciality filter */}
                    <div>
                      <label className="block text-white/80 mb-2 text-sm font-medium">
                        Filter by Speciality
                      </label>
                      <select
                        value={selectedSpeciality}
                        onChange={(e) => setSelectedSpeciality(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      >
                        <option value="">All Specialities</option>
                        {uniqueSpecialities.map((speciality) => (
                          <option key={speciality} value={speciality}>
                            {speciality}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Hospitals List */}
        <div className="relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mb-4" />
              <p className="text-white/60">Loading hospitals...</p>
            </div>
          ) : error ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <p className="text-white/60 mb-4">{error}</p>
              <button
                onClick={fetchHospitals}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          ) : filteredHospitals.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Building2 className="w-12 h-12 text-white/20 mb-4" />
              <p className="text-white/60 mb-4">No hospitals found matching your criteria</p>
              <button
                onClick={resetFilters}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredHospitals.map((hospital, index) => (
                <motion.div
                  key={hospital._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="relative h-48">
                    <img
                      src={hospital.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80"}
                      alt={hospital.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1 line-clamp-1">
                            {hospital.name}
                          </h3>
                          <div className="flex items-center text-white/70">
                            <MapPin size={14} className="mr-1" />
                            <span className="text-sm">{hospital.city}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <motion.button
                            onClick={() => onEdit(hospital)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                          >
                            <Edit className="w-4 h-4 text-white" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(hospital._id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-red-500/20 rounded-full hover:bg-red-500/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      <div className="flex">
                        {renderRatingStars(hospital.rating)}
                      </div>
                      <span className="ml-2 text-white/60 text-sm">
                        {hospital.rating} out of 5
                      </span>
                    </div>

                    {/* Specialities */}
                    <div className="mb-4">
                      <h4 className="text-white/80 text-sm mb-2">Specialities</h4>
                      <div className="flex flex-wrap gap-2">
                        {hospital.speciality && hospital.speciality.map((spec, i) => (
                          <span
                            key={i}
                            className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full text-xs"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    {hospital.contactInfo && (
                      <div className="space-y-2 mb-4">
                        {hospital.contactInfo.phone && (
                          <div className="flex items-center text-white/70">
                            <Phone className="w-4 h-4 mr-2" />
                            <span className="text-sm">{hospital.contactInfo.phone}</span>
                          </div>
                        )}
                        {hospital.contactInfo.email && (
                          <div className="flex items-center text-white/70">
                            <Mail className="w-4 h-4 mr-2" />
                            <span className="text-sm">{hospital.contactInfo.email}</span>
                          </div>
                        )}
                        {hospital.contactInfo.website && (
                          <div className="flex items-center text-white/70">
                            <Globe className="w-4 h-4 mr-2" />
                            <a
                              href={hospital.contactInfo.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:text-indigo-300 text-sm"
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Expand/Collapse */}
                    <motion.button
                      onClick={() => toggleExpand(hospital._id)}
                      className="flex items-center text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {expandedHospital === hospital._id ? 'Show Less' : 'Show More'}
                      <ChevronDown
                        className={`ml-1 w-4 h-4 transform transition-transform ${
                          expandedHospital === hospital._id ? 'rotate-180' : ''
                        }`}
                      />
                    </motion.button>

                    <AnimatePresence>
                      {expandedHospital === hospital._id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-white/10"
                        >
                          {hospital.description && (
                            <div className="mb-4">
                              <h4 className="text-white/80 text-sm font-medium mb-2">
                                About
                              </h4>
                              <p className="text-white/60 text-sm">
                                {hospital.description}
                              </p>
                            </div>
                          )}
                          
                          {hospital.facilities && hospital.facilities.length > 0 && (
                            <div>
                              <h4 className="text-white/80 text-sm font-medium mb-2">
                                Facilities
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {hospital.facilities.map((facility, index) => (
                                  <span
                                    key={index}
                                    className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs"
                                  >
                                    {facility}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalList;
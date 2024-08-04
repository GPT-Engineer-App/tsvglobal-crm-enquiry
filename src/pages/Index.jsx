import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAddEnquiry, useEnquiries, useUpdateEnquiry, useDeleteEnquiry, useSavedSearches, useAddSavedSearch } from "@/integrations/supabase";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import EnquiryForm from '@/components/EnquiryForm';
import EnquiryList from '@/components/EnquiryList';
import QuoteOfTheDay from '@/components/QuoteOfTheDay';
import AdvancedSearch from '@/components/AdvancedSearch';

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCriteria, setSearchCriteria] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const { data: savedSearchesData } = useSavedSearches();
  const addSavedSearchMutation = useAddSavedSearch();
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const addEnquiryMutation = useAddEnquiry();
  const updateEnquiryMutation = useUpdateEnquiry();
  const deleteEnquiryMutation = useDeleteEnquiry();
  const { data: enquiries, isLoading, isError } = useEnquiries();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (data) => {
    try {
      if (selectedEnquiry) {
        await updateEnquiryMutation.mutateAsync({ id: selectedEnquiry.id, ...data });
        toast.success("Enquiry updated successfully!");
      } else {
        await addEnquiryMutation.mutateAsync(data);
        toast.success("Enquiry created successfully!");
      }
      setIsFormOpen(false);
      setSelectedEnquiry(null);
    } catch (error) {
      toast.error(`Failed to ${selectedEnquiry ? 'update' : 'create'} enquiry. Please try again.`);
      console.error(`Error ${selectedEnquiry ? 'updating' : 'creating'} enquiry:`, error);
    }
  };

  const handleEdit = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      try {
        await deleteEnquiryMutation.mutateAsync(id);
        toast.success("Enquiry deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete enquiry. Please try again.");
        console.error("Error deleting enquiry:", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    if (savedSearchesData) {
      setSavedSearches(savedSearchesData);
    }
  }, [savedSearchesData]);

  const filteredEnquiries = enquiries?.filter(enquiry => {
    return searchCriteria.every(criterion => {
      const { field, operator, value } = criterion;
      const enquiryValue = enquiry[field];

      switch (operator) {
        case 'equals':
          return enquiryValue === value;
        case 'contains':
          return String(enquiryValue).toLowerCase().includes(String(value).toLowerCase());
        case 'startsWith':
          return String(enquiryValue).toLowerCase().startsWith(String(value).toLowerCase());
        case 'endsWith':
          return String(enquiryValue).toLowerCase().endsWith(String(value).toLowerCase());
        case 'greaterThan':
          return enquiryValue > value;
        case 'lessThan':
          return enquiryValue < value;
        default:
          return true;
      }
    });
  }) || [];

  const paginatedEnquiries = filteredEnquiries.slice((currentPage - 1) * 20, currentPage * 20);

  const handleSaveSearch = async (name) => {
    try {
      await addSavedSearchMutation.mutateAsync({ name, criteria: searchCriteria });
      toast.success("Search saved successfully!");
      setSavedSearches([...savedSearches, { name, criteria: searchCriteria }]);
    } catch (error) {
      toast.error("Failed to save search. Please try again.");
      console.error("Error saving search:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Enquiries</h1>
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>
      <QuoteOfTheDay />
      <AdvancedSearch
        onSearch={setSearchCriteria}
        savedSearches={savedSearches}
        onSaveSearch={handleSaveSearch}
      />
      <Button onClick={() => { setSelectedEnquiry(null); setIsFormOpen(true); }}>New Enquiry</Button>
      {isLoading ? (
        <p>Loading enquiries...</p>
      ) : isError ? (
        <p>Error loading enquiries. Please try again.</p>
      ) : (
        <EnquiryList
          enquiries={paginatedEnquiries}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={currentPage}
          totalPages={Math.ceil(filteredEnquiries.length / 20)}
          onPageChange={setCurrentPage}
        />
      )}
      {isFormOpen && (
        <EnquiryForm
          enquiry={selectedEnquiry}
          onSubmit={handleSubmit}
          onCancel={() => { setIsFormOpen(false); setSelectedEnquiry(null); }}
        />
      )}
      <Toaster />
    </div>
  );
};

export default Index;

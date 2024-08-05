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
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTheme } from 'next-themes';
import Logo from '@/components/Logo';

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
  const { theme, setTheme } = useTheme();

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
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
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
      await addSavedSearchMutation.mutateAsync({ 
        name, 
        criteria: searchCriteria,
        user_id: user.id,
        application_name: 'Enquiry'
      });
      toast.success("Search saved successfully!");
      setSavedSearches([...savedSearches, { name, criteria: searchCriteria }]);
    } catch (error) {
      toast.error("Failed to save search. Please try again.");
      console.error("Error saving search:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center space-x-4">
            <Button onClick={toggleTheme} variant="outline">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Button>
            <Button onClick={handleLogout} variant="secondary">Logout</Button>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">
        <QuoteOfTheDay />
        <AdvancedSearch
          onSearch={setSearchCriteria}
          savedSearches={savedSearches}
          onSaveSearch={handleSaveSearch}
        />
        <Button onClick={() => { setSelectedEnquiry(null); setIsFormOpen(true); }} className="mb-4">New Enquiry</Button>
        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <p className="text-red-500">Error loading enquiries. Please try again.</p>
        ) : (
          <>
            <EnquiryList
              enquiries={paginatedEnquiries}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentPage={currentPage}
              totalPages={Math.ceil(filteredEnquiries.length / 20)}
              onPageChange={setCurrentPage}
            />
            <div className="mt-4 flex justify-center items-center space-x-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span>Page {currentPage} of {Math.ceil(filteredEnquiries.length / 20)}</span>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredEnquiries.length / 20)))}
                disabled={currentPage === Math.ceil(filteredEnquiries.length / 20)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      {isFormOpen && (
        <EnquiryForm
          enquiry={selectedEnquiry}
          onSubmit={handleSubmit}
          onCancel={() => { setIsFormOpen(false); setSelectedEnquiry(null); }}
        />
      )}
        <Toaster />
      </main>
    </div>
  );
};

export default Index;

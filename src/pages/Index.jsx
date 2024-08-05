import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAddEnquiry, useEnquiries, useUpdateEnquiry, useDeleteEnquiry, useSavedSearches, useAddSavedSearch, useUpdateSavedSearch, useDeleteSavedSearch } from "@/integrations/supabase";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import EnquiryForm from '@/components/EnquiryForm';
import EnquiryList from '@/components/EnquiryList';
import QuoteOfTheDay from '@/components/QuoteOfTheDay';
import AdvancedSearch from '@/components/AdvancedSearch';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTheme } from 'next-themes';
import Logo from '@/components/Logo';
import { Moon, Sun } from 'lucide-react';

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCriteria, setSearchCriteria] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const { data: savedSearchesData } = useSavedSearches();
  const addSavedSearchMutation = useAddSavedSearch();
  const updateSavedSearchMutation = useUpdateSavedSearch();
  const deleteSavedSearchMutation = useDeleteSavedSearch();
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
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    if (savedSearchesData && user) {
      // Filter saved searches for the current user
      const userSavedSearches = savedSearchesData.filter(search => search.user_id === user.user_id);
      setSavedSearches(userSavedSearches);
    }
  }, [savedSearchesData, user]);

  const filteredEnquiries = useMemo(() => {
    let result = enquiries?.filter(enquiry => {
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

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [enquiries, searchCriteria, sortConfig]);

  const paginatedEnquiries = filteredEnquiries.slice((currentPage - 1) * 20, currentPage * 20);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    }));
  };

  const handleSaveSearch = async (name) => {
    if (!user) {
      toast.error("You must be logged in to save a search.");
      return;
    }
    try {
      const searchToSave = { 
        name, 
        criteria: JSON.stringify(searchCriteria),
        user_id: user.user_id,
        application_name: 'Enquiry'
      };
      await addSavedSearchMutation.mutateAsync(searchToSave);
      toast.success("Search saved successfully!");
      setSavedSearches([...savedSearches, { ...searchToSave, criteria: searchCriteria }]);
    } catch (error) {
      toast.error("Failed to save search. Please try again.");
      console.error("Error saving search:", error);
    }
  };

  const handleEditSearch = async (savedSearch) => {
    const newName = prompt("Enter new name for the search:", savedSearch.name);
    if (newName) {
      try {
        const updatedSearch = { ...savedSearch, name: newName };
        await updateSavedSearchMutation.mutateAsync({ id: savedSearch.id, ...updatedSearch });
        toast.success("Search updated successfully!");
        setSavedSearches(searches => searches.map(s => s.id === savedSearch.id ? updatedSearch : s));
      } catch (error) {
        toast.error("Failed to update search. Please try again.");
        console.error("Error updating search:", error);
      }
    }
  };

  const handleDeleteSearch = async (savedSearch) => {
    if (window.confirm("Are you sure you want to delete this saved search?")) {
      try {
        await deleteSavedSearchMutation.mutateAsync(savedSearch.id);
        toast.success("Search deleted successfully!");
        setSavedSearches(searches => searches.filter(s => s.id !== savedSearch.id));
      } catch (error) {
        toast.error("Failed to delete search. Please try again.");
        console.error("Error deleting search:", error);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
            <Button onClick={toggleTheme} variant="ghost" size="icon">
              {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            <Button onClick={handleLogout} variant="secondary">Logout</Button>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">
        <div className="text-center mb-8">
          <Logo />
          <h1 className="text-3xl font-bold mt-4">Welcome to Enquiry Application</h1>
          <p className="text-lg text-muted-foreground">Streamline your logistics operations</p>
        </div>
        <QuoteOfTheDay />
        <AdvancedSearch
          onSearch={setSearchCriteria}
          savedSearches={savedSearches}
          onSaveSearch={handleSaveSearch}
          onEditSearch={handleEditSearch}
          onDeleteSearch={handleDeleteSearch}
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
              onSort={handleSort}
              sortConfig={sortConfig}
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

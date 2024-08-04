import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAddEnquiry, useEnquiries, useUpdateEnquiry, useDeleteEnquiry } from "@/integrations/supabase";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import EnquiryForm from '@/components/EnquiryForm';
import EnquiryList from '@/components/EnquiryList';
import QuoteOfTheDay from '@/components/QuoteOfTheDay';
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilters, setDateFilters] = useState({
    created_date: null,
    cargo_readiness: null,
    cut_off_eta: null,
  });
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

  const filteredEnquiries = enquiries?.filter(enquiry => {
    const matchesSearch = Object.values(enquiry).some(value => 
      typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesDateFilters = Object.entries(dateFilters).every(([key, value]) => 
      !value || new Date(enquiry[key]).toDateString() === value.toDateString()
    );
    return matchesSearch && matchesDateFilters;
  }) || [];

  const paginatedEnquiries = filteredEnquiries.slice((currentPage - 1) * 20, currentPage * 20);

  if (!user) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Enquiries</h1>
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>
      <QuoteOfTheDay />
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search enquiries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
        <div className="flex space-x-2">
          {Object.entries(dateFilters).map(([key, value]) => (
            <Popover key={key}>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {value ? value.toDateString() : `Filter by ${key.replace('_', ' ')}`}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={value}
                  onSelect={(date) => setDateFilters(prev => ({ ...prev, [key]: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>
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

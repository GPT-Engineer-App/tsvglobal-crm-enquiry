import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAddEnquiry } from "@/integrations/supabase";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import EnquiryForm from '@/components/EnquiryForm';

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [user, setUser] = useState(null);
  const addEnquiryMutation = useAddEnquiry();
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
      await addEnquiryMutation.mutateAsync(data);
      toast.success("Enquiry created successfully!");
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Failed to create enquiry. Please try again.");
      console.error("Error creating enquiry:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Enquiries</h1>
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>
      <Button onClick={() => setIsFormOpen(true)}>New Enquiry</Button>
      {isFormOpen && (
        <EnquiryForm
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
      <Toaster />
    </div>
  );
};

export default Index;

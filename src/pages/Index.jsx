import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAddEnquiry } from "@/integrations/supabase";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import EnquiryForm from '@/components/EnquiryForm';

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const addEnquiryMutation = useAddEnquiry();

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Enquiries</h1>
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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  sno: z.number().int().positive(),
  created_by: z.string().min(1),
  created_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  enquiry_id: z.string().optional(),
  channel: z.string().min(1),
  enquiry_mode: z.string().min(1),
  enquiry_type: z.string().min(1),
  enquiry_subtype: z.string().min(1),
  client: z.string().min(1),
  inco_terms: z.string().min(1),
  origin_country: z.string().min(1),
  origin_port: z.string().min(1),
  destination_country: z.string().min(1),
  destination_port: z.string().min(1),
  length: z.number().int().positive(),
  breadth: z.number().int().positive(),
  height: z.number().int().positive(),
  unit_of_measurement: z.string().min(1),
  package_type: z.string().min(1),
  no_of_pkgs: z.number().int().positive(),
  net_weight: z.number().int().positive().optional(),
  total_net: z.number().int().positive().optional(),
  gross_weight: z.number().int().positive(),
  total_gross: z.number().int().positive().optional(),
  equipment: z.string().min(1),
  no_of_units: z.number().int().positive().optional(),
  commodity: z.string().min(1),
  cargo_readiness: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  cut_off_eta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  indication_in_usd: z.string().optional(),
  remarks: z.string().optional(),
  is_assigned: z.boolean().optional(),
  is_deleted: z.boolean().optional(),
  updated_by: z.string().min(1),
  updated_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const EnquiryForm = ({ onSubmit, onCancel }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sno: 1,
      created_by: "",
      created_date: new Date().toISOString().split('T')[0],
      channel: "",
      enquiry_mode: "",
      enquiry_type: "",
      enquiry_subtype: "",
      client: "",
      inco_terms: "",
      origin_country: "",
      origin_port: "",
      destination_country: "",
      destination_port: "",
      length: 0,
      breadth: 0,
      height: 0,
      unit_of_measurement: "",
      package_type: "",
      no_of_pkgs: 0,
      gross_weight: 0,
      equipment: "",
      commodity: "",
      updated_by: "",
      updated_date: new Date().toISOString().split('T')[0],
    },
  });

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Enquiry</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="sno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="created_by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Created By</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="created_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Created Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="channel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Add more form fields here */}
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit">Save Enquiry</Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EnquiryForm;

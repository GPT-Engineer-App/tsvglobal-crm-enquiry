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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  // User Input Fields
  enquiry_id: z.string().min(1, "Enquiry ID is required"),
  channel: z.string().min(1, "Channel is required"),
  enquiry_mode: z.string().min(1, "Enquiry mode is required"),
  enquiry_type: z.string().min(1, "Enquiry type is required"),
  enquiry_subtype: z.string().min(1, "Enquiry subtype is required"),
  client: z.string().min(1, "Client is required"),
  inco_terms: z.string().min(1, "Incoterms are required"),
  origin_country: z.string().min(1, "Origin country is required"),
  origin_port: z.string().min(1, "Origin port is required"),
  destination_country: z.string().min(1, "Destination country is required"),
  destination_port: z.string().min(1, "Destination port is required"),
  length: z.number().positive("Length must be positive"),
  breadth: z.number().positive("Breadth must be positive"),
  height: z.number().positive("Height must be positive"),
  unit_of_measurement: z.string().min(1, "Unit of measurement is required"),
  package_type: z.string().min(1, "Package type is required"),
  no_of_pkgs: z.number().int().positive("Number of packages must be positive"),
  net_weight: z.number().positive("Net weight must be positive").optional(),
  gross_weight: z.number().positive("Gross weight must be positive"),
  equipment: z.string().min(1, "Equipment is required"),
  no_of_units: z.number().int().positive("Number of units must be positive").optional(),
  commodity: z.string().min(1, "Commodity is required"),
  cargo_readiness: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format").optional(),
  cut_off_eta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format").optional(),
  indication_in_usd: z.string().optional(),
  remarks: z.string().optional(),
});

const EnquiryForm = ({ onSubmit, onCancel }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enquiry_id: "",
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
    },
  });

  const handleSubmit = (data) => {
    // Add system fields
    const enquiryData = {
      ...data,
      sno: Date.now(), // Use timestamp as a temporary serial number
      created_by: "Current User", // Replace with actual user info
      created_date: new Date().toISOString().split('T')[0],
      updated_by: "Current User", // Replace with actual user info
      updated_date: new Date().toISOString().split('T')[0],
      is_assigned: false,
      is_deleted: false,
    };
    onSubmit(enquiryData);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create New Enquiry</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enquiry Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="enquiry_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enquiry ID</FormLabel>
                        <Input {...field} />
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
                  <FormField
                    control={form.control}
                    name="enquiry_mode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enquiry Mode</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="enquiry_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enquiry Type</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="enquiry_subtype"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enquiry Subtype</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="inco_terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incoterms</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Origin and Destination</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="origin_country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origin Country</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="origin_port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origin Port</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="destination_country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination Country</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="destination_port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination Port</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cargo Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length</FormLabel>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="breadth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Breadth</FormLabel>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height</FormLabel>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unit_of_measurement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit of Measurement</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="package_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package Type</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="no_of_pkgs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Packages</FormLabel>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="net_weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Net Weight</FormLabel>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gross_weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gross Weight</FormLabel>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="equipment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipment</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="no_of_units"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Units</FormLabel>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="commodity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commodity</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cargo_readiness"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cargo Readiness Date</FormLabel>
                        <Input type="date" {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cut_off_eta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cut-off ETA</FormLabel>
                        <Input type="date" {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="indication_in_usd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indication in USD</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <Textarea {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

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

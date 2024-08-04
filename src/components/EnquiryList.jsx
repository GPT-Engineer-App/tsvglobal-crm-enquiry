import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const EnquiryList = ({ enquiries, onEdit, onDelete, currentPage, totalPages, onPageChange }) => {
  return (
    <div>
      <ScrollArea className="h-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enquiry ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Enquiry Mode</TableHead>
              <TableHead>Enquiry Type</TableHead>
              <TableHead>Enquiry Subtype</TableHead>
              <TableHead>Incoterms</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Dimensions (L x B x H)</TableHead>
              <TableHead>Unit of Measurement</TableHead>
              <TableHead>Package Type</TableHead>
              <TableHead>No. of Packages</TableHead>
              <TableHead>Net Weight</TableHead>
              <TableHead>Gross Weight</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead>No. of Units</TableHead>
              <TableHead>Commodity</TableHead>
              <TableHead>Cargo Readiness</TableHead>
              <TableHead>Cut-off ETA</TableHead>
              <TableHead>Indication in USD</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiries.map((enquiry) => (
              <TableRow key={enquiry.id}>
                <TableCell>{enquiry.enquiry_id}</TableCell>
                <TableCell>{enquiry.client}</TableCell>
                <TableCell>{enquiry.channel}</TableCell>
                <TableCell>{enquiry.enquiry_mode}</TableCell>
                <TableCell>{enquiry.enquiry_type}</TableCell>
                <TableCell>{enquiry.enquiry_subtype}</TableCell>
                <TableCell>{enquiry.inco_terms}</TableCell>
                <TableCell>{`${enquiry.origin_country} - ${enquiry.origin_port}`}</TableCell>
                <TableCell>{`${enquiry.destination_country} - ${enquiry.destination_port}`}</TableCell>
                <TableCell>{`${enquiry.length} x ${enquiry.breadth} x ${enquiry.height}`}</TableCell>
                <TableCell>{enquiry.unit_of_measurement}</TableCell>
                <TableCell>{enquiry.package_type}</TableCell>
                <TableCell>{enquiry.no_of_pkgs}</TableCell>
                <TableCell>{enquiry.net_weight}</TableCell>
                <TableCell>{enquiry.gross_weight}</TableCell>
                <TableCell>{enquiry.equipment}</TableCell>
                <TableCell>{enquiry.no_of_units}</TableCell>
                <TableCell>{enquiry.commodity}</TableCell>
                <TableCell>{enquiry.cargo_readiness}</TableCell>
                <TableCell>{enquiry.cut_off_eta}</TableCell>
                <TableCell>{enquiry.indication_in_usd}</TableCell>
                <TableCell>{enquiry.remarks}</TableCell>
                <TableCell>{new Date(enquiry.created_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(enquiry)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(enquiry.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="flex justify-center items-center mt-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EnquiryList;

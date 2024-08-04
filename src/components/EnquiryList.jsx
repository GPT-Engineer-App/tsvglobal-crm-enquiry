import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";

const EnquiryList = ({ enquiries, onEdit, onDelete, currentPage, totalPages, onPageChange }) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Enquiry ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enquiries.map((enquiry) => (
            <TableRow key={enquiry.id}>
              <TableCell>{enquiry.enquiry_id}</TableCell>
              <TableCell>{enquiry.client}</TableCell>
              <TableCell>{`${enquiry.origin_country} - ${enquiry.origin_port}`}</TableCell>
              <TableCell>{`${enquiry.destination_country} - ${enquiry.destination_port}`}</TableCell>
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

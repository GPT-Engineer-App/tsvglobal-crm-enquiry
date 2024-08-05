import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

export default LoadingSpinner;

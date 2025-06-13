import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { canUpdateProductStatus } from '@/utils/auth';

export type ProductStatus = 'active' | 'pending' | 'out_of_stock' | 'draft' | 'archived';

interface ProductStatusManagerProps {
  currentStatus: ProductStatus;
  productId: string;
  onStatusChange?: (newStatus: ProductStatus) => void;
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'out_of_stock', label: 'Out of Stock' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

const getStatusBadge = (status: ProductStatus) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending Review</Badge>;
    case 'out_of_stock':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Out of Stock</Badge>;
    case 'draft':
      return <Badge variant="secondary">Draft</Badge>;
    case 'archived':
      return <Badge variant="outline">Archived</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const ProductStatusManager: React.FC<ProductStatusManagerProps> = ({
  currentStatus,
  productId,
  onStatusChange,
}) => {
  const { toast } = useToast();
  const canUpdate = canUpdateProductStatus();

  const handleStatusChange = async (newStatus: ProductStatus) => {
    if (!canUpdate) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to update product status.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Here you would typically make an API call to update the product status
      // await updateProductStatus(productId, newStatus);
      
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
      
      toast({
        title: "Status Updated",
        description: `Product status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Failed to update product status:', error);
      toast({
        title: "Error",
        description: "Failed to update product status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!canUpdate) {
    return getStatusBadge(currentStatus);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          {getStatusBadge(currentStatus)}
          <MoreHorizontal className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleStatusChange(option.value as ProductStatus)}
            disabled={option.value === currentStatus}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProductStatusManager;

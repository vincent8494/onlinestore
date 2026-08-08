import React from 'react';
import { useParams } from 'react-router-dom';
import ProductForm from '@/components/product/ProductForm';

/** Thin wrapper — the form itself lives in ProductForm, shared with creating. */
const EditProduct = () => {
  const { id } = useParams();
  return <ProductForm mode="edit" productId={id} />;
};

export default EditProduct;

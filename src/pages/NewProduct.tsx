import React from 'react';
import ProductForm from '@/components/product/ProductForm';

/** Thin wrapper — the form itself lives in ProductForm, shared with editing. */
const NewProduct = () => <ProductForm mode="create" />;

export default NewProduct;

import ApiBase from "./ApiBase";

export const createProduct = async (product: { title: string; price: number; image: string; categoryId: string }) => {
  const payload = {
    fields: {
      title: { stringValue: product.title },
      price: { doubleValue: product.price },
      image: { stringValue: product.image },
      categoryId: { stringValue: product.categoryId }, // ← مهم جداً للفلترة
      createdAt: { timestampValue: new Date().toISOString() },
    }
  };
  
  return await ApiBase.post("/products", payload);
};
export const getProducts = async () => {
  const res = await ApiBase.get("/products");
  return res.data.documents.map((doc: any) => ({
    id: doc.name.split("/").pop(),
    ...Object.fromEntries(
      Object.entries(doc.fields).map(([key, value]: any) => [key, Object.values(value)[0]])
    )
  }));
};

export const getProductById = async (id: string) => {
  const res = await ApiBase.get(`/products/${id}`);
  const doc = res.data;
  return {
    id: doc.name.split("/").pop(),
    ...Object.fromEntries(
      Object.entries(doc.fields).map(([key, value]: any) => [key, Object.values(value)[0]])
    )
  };
};

export const updateProduct = async (id: number, product: { title?: string; price?: number; image?: string }) => {
    return await ApiBase.put(`/products/${id}`, product);
}
export const deleteProduct = async (id: number) => {
    return await ApiBase.delete(`/products/${id}`);
}
import { useProducts } from "@ebike/shared-code/hooks";

const ProductsPage = () => {
  const { items, loading } = useProducts();

  return (
    <section>
      <h2>Products</h2>
      {loading ? <p>Loading products...</p> : <p>Products loaded: {items.length}</p>}
    </section>
  );
};

export default ProductsPage;

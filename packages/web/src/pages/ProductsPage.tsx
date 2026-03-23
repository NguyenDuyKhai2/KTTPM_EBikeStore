import { Link } from "react-router-dom";
import { useProducts } from "@ebike/shared-code/hooks";

const fallbackProducts = [
  {
    id: "concept-1",
    name: "Volt Edge S",
    description: "A streamlined electric scooter concept for fast city movement and daily commuting.",
    price: 18900000,
    rating: 4.8,
    category: { id: "urban", name: "Urban Scooter" },
    images: [],
    reviews: []
  },
  {
    id: "concept-2",
    name: "Neo Ride X",
    description: "Sportier styling with stronger motor output and elevated road presence.",
    price: 27900000,
    rating: 4.9,
    category: { id: "performance", name: "Performance" },
    images: [],
    reviews: []
  },
  {
    id: "concept-3",
    name: "Campus Lite",
    description: "Practical, lightweight, and budget-aware for students and short daily routes.",
    price: 15900000,
    rating: 4.6,
    category: { id: "student", name: "Student" },
    images: [],
    reviews: []
  }
];

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

const ProductsPage = () => {
  const { items, loading, error } = useProducts();
  const products = items.length > 0 ? items : fallbackProducts;

  return (
    <div className="catalog-page">
      <section className="section-heading">
        <span className="section-label">Electric Collection</span>
        <h1>Choose from city-ready scooters and e-bikes designed around modern urban life.</h1>
        <p>
          This page is ready to run in parallel with backend development: it can show real API products when available
          and still present a polished storefront layout during early integration.
        </p>
      </section>

      <section className="catalog-toolbar">
        <div>
          <strong>{products.length}</strong>
          <span> models in view</span>
        </div>
        <Link className="button button--ghost" to="/chatbot">
          Need help choosing?
        </Link>
      </section>

      {loading ? <p className="state-panel">Loading electric lineup...</p> : null}
      {error ? <p className="state-panel state-panel--warning">Backend not ready yet. Showing curated concept data.</p> : null}

      <section className="catalog-grid">
        {products.map((product, index) => (
          <article className="product-card" key={product.id}>
            <div className={`product-card__visual product-card__visual--${(index % 3) + 1}`}>
              <span>{product.category.name}</span>
            </div>

            <div className="product-card__body">
              <div className="product-card__meta">
                <span>{product.category.name}</span>
                <strong>{product.rating.toFixed(1)}</strong>
              </div>

              <h2>{product.name}</h2>
              <p>{product.description}</p>

              <div className="product-card__footer">
                <strong>{currencyFormatter.format(product.price)}</strong>
                <Link className="button button--dark" to="/chatbot">
                  Consult Advisor
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default ProductsPage;

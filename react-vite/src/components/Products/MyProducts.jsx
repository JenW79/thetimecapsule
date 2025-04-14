import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUserProducts } from "../../redux/products";
import ProductItem from "./ProductItem";
import "./MyProducts.css"; 

const MyProducts = () => {
  const dispatch = useDispatch();
  const productsObj = useSelector((state) => state.products);
  const products = Object.values(productsObj);
  const handleProductDeleted = () => {
    dispatch(fetchCurrentUserProducts());
  };

  useEffect(() => {
    dispatch(fetchCurrentUserProducts());
  }, [dispatch]);

  if (!products.length) {
    return (
      <div className="my-products-empty">
        <h2>You haven’t listed any products yet.</h2>
        <p>Get started by creating your first listing!</p>
        <a href="/products/new" className="cta-button">
          Create Your First Listing
        </a>
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="my-products-header">
  <h2>My Listings</h2>
  <a href="/products/new" className="cta-button small">+ Create New Listing</a>
</div>
      <div className="products-grid">
        {products.map((product) => (
          <ProductItem
          key={product.id}
          product={product}
          onProductDeleted={handleProductDeleted}
        />
        ))}
      </div>
    </div>
  );
};

export default MyProducts;

// MyProducts.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUserProducts } from "../../redux/products";
import ProductItem from "./ProductItem";
import styles from "./MyProducts.module.css";

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
      <div className={styles.myProductsEmpty}>
        <h2>You haven’t listed any products yet.</h2>
        <p>Get started by creating your first listing!</p>
        <a href="/products/new" className={styles.ctaButton}>
          Create Your First Listing
        </a>
      </div>
    );
  }

  return (
    <div className={styles.myProductsPage}>
      <div className={styles.productList}>
        <div className={styles.myProductsHeader}>
          <h2>My Listings</h2>
          <a href="/products/new" className={styles.ctaButtonSmall}>
            + Create New Listing
          </a>
        </div>
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div className={styles.productCard} key={product.id}>
              <ProductItem
                product={product}
                onProductDeleted={handleProductDeleted}
                customThumbnailClass={styles.productThumbnail}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProducts;
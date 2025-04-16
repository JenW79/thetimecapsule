import { createBrowserRouter } from "react-router-dom";
import OrderFormPage from "../components/OrderFormPage/OrderFormPage";
import CartPage from "../components/CartPage/CartPage";
import Layout from "./Layout";
import ReviewList from "../components/Reviews/ReviewList";
import CurrentUserReviews from "../components/Reviews/CurrentUserReviews";
import LandingPage from "../components/LandingPage/LandingPage";
import ProductList from "../components/Products/ProductList";
import MyProducts from "../components/Products/MyProducts";
import ProductForm from "../components/Products/ProductForm";
import ProductDetail from "../components/Products/ProductDetail";
import FavoritesList from "../components/Favorites/FavoritesList";
import ProtectedRoute from "../utils/ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <OrderFormPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "products/:productId/reviews",
        element: <ReviewList />,
      },
      {
        path: "my-reviews",
        element: (
          <ProtectedRoute>
            <CurrentUserReviews />
          </ProtectedRoute>
        ),
      },
      {
        path: "products",
        element: <ProductList />,
      },
      {
        path: "products/1980s",
        element: <ProductList />,
      },
      {
        path: "products/1990s",
        element: <ProductList />,
      },
      {
        path: "products/2000s",
        element: <ProductList />,
      },
      {
        path: "/my-products",
        element: (
          <ProtectedRoute>
            <MyProducts />
          </ProtectedRoute>
        ),
      },
      {
        path: "/products/new",
        element: (
          <ProtectedRoute>
            <ProductForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "products/:id",
        element: <ProductDetail />,
      },
      {
        path: "/favorites",
        element: (
          <ProtectedRoute>
            <FavoritesList />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

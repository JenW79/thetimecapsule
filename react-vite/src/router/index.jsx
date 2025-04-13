import { createBrowserRouter } from 'react-router-dom';
import OrderFormPage from '../components/OrderFormPage/OrderFormPage';
import CartPage from '../components/CartPage/CartPage'
import Layout from './Layout';
import ReviewList from '../components/Reviews/ReviewList';
import LandingPage from '../components/LandingPage/LandingPage';
import ProductList from '../components/Products/ProductList';

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
        element: <OrderFormPage />,
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
    ],
  },
]);
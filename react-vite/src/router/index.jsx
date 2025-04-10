import { createBrowserRouter } from 'react-router-dom';
import OrderFormPage from '../components/OrderFormPage/OrderFormPage';
import CartPage from '../components/CartPage/CartPage'
import Layout from './Layout';
import ReviewList from '../components/Reviews/ReviewList';
import LandingPage from '../components/LandingPage/LandingPage';

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
    ],
  },
]);
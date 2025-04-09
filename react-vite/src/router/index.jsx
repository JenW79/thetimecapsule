import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import OrderFormPage from '../components/OrderFormPage/OrderFormPage';
import CartPage from '../components/CartPage/CartPage'
import Layout from './Layout';
import ReviewList from '../components/Reviews/ReviewList';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
        <div>
            <img src="/the-time-capsule-logo.png" alt="The Time Capsule Logo" className="logo" />
          </div>
        ),
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
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
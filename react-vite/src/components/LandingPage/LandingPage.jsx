import './LandingPage.css';

function LandingPage() {
    return (
        <div className="landing-page">
            <h1>Welcome to The Time Capsule!</h1>
            <img
                src="/the-time-capsule-landing-page.png"
                alt="The Time Capsule"
                className="landing-page-image"
            />
        </div>
    );
}

  
export default LandingPage;





// import { createBrowserRouter } from 'react-router-dom';
// import LoginFormPage from '../components/LoginFormPage';
// import SignupFormPage from '../components/SignupFormPage';
// import OrderFormPage from '../components/OrderFormPage/OrderFormPage';
// import CartPage from '../components/CartPage/CartPage';
// import Layout from './Layout';
// import ReviewList from '../components/Reviews/ReviewList';

// export const router = createBrowserRouter([
//   {
//     element: <Layout />,
//     children: [
//       {
//         path: "/",
//         element: (
//           <div
//             style={{
//               backgroundImage: `url('/the-time-capsule-landing-page.png')`
//             //   , // Landing page background image
//         //       backgroundSize: 'cover',
//         //       backgroundPosition: 'center',
//         //       height: '100vh', // Full viewport height
//         //       position: 'relative', // Make it relative to position logo correctly
//             }}
//             className="landing-page" // Add class for additional styling
//           >
//         {/* //     <img */}
//         {/* //       src="/the-time-capsule-logo.png" // Logo image */}
//         {/* //       alt="The Time Capsule Logo" */}
//         {/* //       style={{ */}
//         {/* //         position: 'absolute', // Absolutely position the logo */}
//         {/* //         top: '20px', // 20px from the top */}
//         {/* //         right: '20px', // 20px from the right */}
//         {/* //         width: '150px', // Adjust logo size */}
//         {/* //       }} */}
//         {/* //     /> */}
//         //   </div>
//         <div className="landing-page">
//             <img
//               src="/the-time-capsule-logo.png" // Logo image
//               alt="The Time Capsule Logo"
//             //   style={{
//             //     position: 'absolute', // Absolutely position the logo
//             //     top: '20px', // 20px from the top
//             //     left: '20px', // 20px from the left
//             //     width: '150px', // Logo size
//             //   }}
//             />
//           </div>
//         ),
//       },
//       {
//         path: "login",
//         element: <LoginFormPage />,
//       },
//       {
//         path: "signup",
//         element: <SignupFormPage />,
//       },
//       {
//         path: "checkout",
//         element: <OrderFormPage />,
//       },
//       {
//         path: "cart",
//         element: <CartPage />,
//       },
//       {
//         path: "products/:productId/reviews",
//         element: <ReviewList />,
//       },
//     ],
//   },
// ]);
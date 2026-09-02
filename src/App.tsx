
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import CookieConsent from "@/components/legal/CookieConsent";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SellDashboard from "./pages/SellDashboard";
import NewProduct from "./pages/NewProduct";

import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Deals from "./pages/Deals";
import NewArrivals from "./pages/NewArrivals";
import Sellers from "./pages/Sellers";
import SellerGuide from "./pages/SellerGuide";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import EditProduct from "./pages/EditProduct";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Fees from "./pages/Fees";
import SellerSupport from "./pages/SellerSupport";
import SellerPolicies from "./pages/SellerPolicies";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import { Privacy, Terms, Cookies } from "./pages/Legal";

// exceljs is close to a megabyte and is only needed by the bulk importer, so
// this route is split out rather than shipped to every visitor.
const ImportProducts = lazy(() => import("./pages/ImportProducts"));

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-gold" />
  </div>
);

const queryClient = new QueryClient();

/**
 * Wraps every route. The cookie banner lives here rather than beside
 * <RouterProvider> because it links to the cookie policy, and <Link> only
 * works inside the router.
 */
const RootLayout = () => (
  <>
    <Outlet />
    <CookieConsent />
  </>
);

// Create router with type assertion for future flags
const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/sell",
      element: <SellDashboard />,
    },
    {
      path: "/sell/import",
      element: (
        <Suspense fallback={<RouteFallback />}>
          <ImportProducts />
        </Suspense>
      ),
    },
    {
      path: "/sell/new-product",
      element: <NewProduct />,
    },
    {
      path: "/sell/edit-product/:id",
      element: <EditProduct />,
    },
    {
      path: "/products",
      element: <Products />,
    },
    {
      path: "/products/:id",
      element: <ProductDetails />,
    },
    {
      path: "/categories",
      element: <Categories />,
    },
    {
      path: "/deals",
      element: <Deals />,
    },
    {
      path: "/new-arrivals",
      element: <NewArrivals />,
    },
    {
      path: "/sellers",
      element: <Sellers />,
    },
    {
      path: "/seller-guide",
      element: <SellerGuide />,
    },
    {
      path: "/cart",
      element: <Cart />,
    },
    {
      path: "/wishlist",
      element: <Wishlist />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/checkout",
      element: <Checkout />,
    },
    {
      path: "/orders",
      element: <OrderHistory />,
    },
    {
      path: "/settings",
      element: <Settings />,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "/fees",
      element: <Fees />,
    },
    {
      path: "/seller-support",
      element: <SellerSupport />,
    },
    {
      path: "/seller-policies",
      element: <SellerPolicies />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/privacy",
      element: <Privacy />,
    },
    {
      path: "/terms",
      element: <Terms />,
    },
    {
      path: "/cookies",
      element: <Cookies />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_normalizeFormMethod: true,
      v7_relativeSplatPath: true,
      v7_prependBasename: true,
    } as any // Type assertion to bypass TypeScript's type checking for future flags
  }
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

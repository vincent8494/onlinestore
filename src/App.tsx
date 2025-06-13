
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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

const queryClient = new QueryClient();

// Create router with type assertion for future flags
const router = createBrowserRouter(
  [
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
      path: "*",
      element: <NotFound />,
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

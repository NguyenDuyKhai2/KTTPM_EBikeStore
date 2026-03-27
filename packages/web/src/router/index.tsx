import { createBrowserRouter } from "react-router-dom";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import Layout from "../components/common/Layout";

// Pages
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import ChatbotPage from "../pages/ChatbotPage";
import CheckoutPage from "../pages/CheckoutPage";
import FavoritesPage from "../pages/FavoritesPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPageApi";
import NotFoundPage from "../pages/NotFoundPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import ProductsPage from "../pages/ProductsPage";
import CustomerDashboardPage from "../pages/customer/CustomerDashboardPage";
import CustomerOrdersPage from "../pages/customer/CustomerOrdersPage";
import CustomerProfilePage from "../pages/customer/CustomerProfilePageApi";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      // Guest
      { index: true, element: <HomePage /> },
      { path: "auth", element: <LoginPage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "product/:id", element: <ProductDetailPage /> },
      { path: "favorites", element: <FavoritesPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "chatbot", element: <ChatbotPage /> }
    ]
  },
  {
    path: "/customer",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "",
        element: <CustomerLayout />,
        children: [
          { index: true, element: <CustomerDashboardPage /> },
          { path: "orders", element: <CustomerOrdersPage /> },
          { path: "profile", element: <CustomerProfilePage /> }
        ]
      }
    ]
  },
  {
    path: "/admin",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: "products", element: <AdminProductsPage /> },
          { path: "users", element: <AdminUsersPage /> }
        ]
      }
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);

export default router;

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
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProductsPage from "../pages/ProductsPage";
import CustomerDashboardPage from "../pages/customer/CustomerDashboardPage";
import CustomerOrdersPage from "../pages/customer/CustomerOrdersPage";
import CustomerProfilePage from "../pages/customer/CustomerProfilePage";

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

import { Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ChatbotPage from "./pages/ChatbotPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/chatbot" element={<ChatbotPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Layout>
);

export default App;

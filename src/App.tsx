import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
import { MyRecipesPage } from "./pages/MyRecipesPage";
import { BrowsePage } from "./pages/BrowsePage";
import { RecipeDetailPage } from "./pages/RecipeDetailPage";
import { RecipeFormPage } from "./pages/RecipeFormPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter basename="/cookbook">
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route path="/browse" element={<BrowsePage />} />
            <Route
              path="/recipe/new"
              element={
                <ProtectedRoute>
                  <RecipeFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipe/:id/edit"
              element={
                <ProtectedRoute>
                  <RecipeFormPage />
                </ProtectedRoute>
              }
            />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
            <Route
              path="/my-recipes"
              element={
                <ProtectedRoute>
                  <MyRecipesPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/my-recipes" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

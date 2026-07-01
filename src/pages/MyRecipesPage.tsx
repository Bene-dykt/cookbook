import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RecipeCard } from "../components/RecipeCard";
import { getUserRecipes } from "../lib/recipes";
import type { Recipe } from "../types";

export function MyRecipesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    getUserRecipes(user.uid)
      .then(setRecipes)
      .catch(() => setError("Failed to load recipes."))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Recipes</h1>
        <button onClick={() => navigate("/recipe/new")}>+ New recipe</button>
      </div>

      {loading && <p className="muted">Loading…</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && recipes.length === 0 && (
        <p className="muted">No recipes yet. Create your first one!</p>
      )}

      {recipes.length > 0 && (
        <div className="recipe-grid">
          {recipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}

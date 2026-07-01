import { useEffect, useState } from "react";
import { RecipeCard } from "../components/RecipeCard";
import { getPublicRecipes } from "../lib/recipes";
import type { Recipe } from "../types";

export function BrowsePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPublicRecipes()
      .then(setRecipes)
      .catch(() => setError("Failed to load recipes."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Browse</h1>
      </div>

      {loading && <p className="muted">Loading…</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && recipes.length === 0 && (
        <p className="muted">No public recipes yet.</p>
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

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRecipe, deleteRecipe } from "../lib/recipes";
import type { Recipe } from "../types";

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getRecipe(id)
      .then((r) => {
        if (!r) setError("Recipe not found.");
        else setRecipe(r);
      })
      .catch(() => setError("Failed to load recipe."))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = Boolean(user && recipe && user.uid === recipe.authorId);

  const handleDelete = async () => {
    if (!id || !window.confirm("Delete this recipe?")) return;
    setDeleting(true);
    try {
      await deleteRecipe(id);
      navigate("/my-recipes");
    } catch {
      setDeleting(false);
      setError("Failed to delete recipe.");
    }
  };

  if (loading) return <div className="loading">Loading…</div>;
  if (error || !recipe) {
    return (
      <div className="page">
        <p className="form-error">{error || "Recipe not found."}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>{recipe.title}</h1>
        <div className="page-header-actions">
          <span className={`badge ${recipe.isPublic ? "badge-public" : "badge-private"}`}>
            {recipe.isPublic ? "Public" : "Private"}
          </span>
          {isOwner && (
            <>
              <Link to={`/recipe/${id}/edit`} className="btn-secondary">
                Edit
              </Link>
              <button
                className="btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </>
          )}
        </div>
      </div>

      <section className="recipe-section">
        <h2>Ingredients</h2>
        <ul className="recipe-list">
          {recipe.ingredients.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="recipe-section">
        <h2>Steps</h2>
        <ol className="recipe-list">
          {recipe.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}

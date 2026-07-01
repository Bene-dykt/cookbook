import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RecipeForm } from "../components/RecipeForm";
import { createRecipe, getRecipe, updateRecipe } from "../lib/recipes";
import type { Recipe } from "../types";

export function RecipeFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getRecipe(id)
      .then((r) => {
        if (!r) { setError("Recipe not found."); return; }
        if (r.authorId !== user?.uid) { navigate(`/recipe/${id}`, { replace: true }); return; }
        setRecipe(r);
      })
      .catch(() => setError("Failed to load recipe."))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  if (loading) return <div className="loading">Loading…</div>;
  if (error) return <div className="page"><p className="form-error">{error}</p></div>;

  const handleSubmit = async (values: {
    title: string;
    ingredients: string[];
    steps: string[];
    isPublic: boolean;
  }) => {
    if (isEdit && id) {
      await updateRecipe(id, values);
      navigate(`/recipe/${id}`);
    } else {
      const newId = await createRecipe({ ...values, authorId: user!.uid });
      navigate(`/recipe/${newId}`);
    }
  };

  return (
    <div className="page">
      <h1>{isEdit ? "Edit recipe" : "New recipe"}</h1>
      <RecipeForm
        initial={recipe ?? undefined}
        onSubmit={handleSubmit}
        onCancel={() => navigate(isEdit && id ? `/recipe/${id}` : "/my-recipes")}
        submitLabel={isEdit ? "Save changes" : "Create recipe"}
      />
    </div>
  );
}

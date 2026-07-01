import { Link } from "react-router-dom";
import type { Recipe } from "../types";

interface Props {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: Props) {
  return (
    <Link to={`/recipe/${recipe.id}`} className="recipe-card">
      <div className="recipe-card-title">{recipe.title}</div>
      <span className={`badge ${recipe.isPublic ? "badge-public" : "badge-private"}`}>
        {recipe.isPublic ? "Public" : "Private"}
      </span>
    </Link>
  );
}

import { useState, type FormEvent } from "react";

interface RecipeFormValues {
  title: string;
  ingredients: string[];
  steps: string[];
  isPublic: boolean;
}

interface Props {
  initial?: RecipeFormValues;
  onSubmit: (values: RecipeFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export function RecipeForm({ initial, onSubmit, onCancel, submitLabel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [ingredients, setIngredients] = useState(
    initial?.ingredients.join("\n") ?? ""
  );
  const [steps, setSteps] = useState(initial?.steps.join("\n") ?? "");
  const [isPublic, setIsPublic] = useState(initial?.isPublic ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        ingredients: ingredients.split("\n").map((s) => s.trim()).filter(Boolean),
        steps: steps.split("\n").map((s) => s.trim()).filter(Boolean),
        isPublic,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save recipe.");
      setSubmitting(false);
    }
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <label className="form-field">
        Title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="e.g. Spaghetti Carbonara"
        />
      </label>

      <label className="form-field">
        Ingredients <span className="form-hint">one per line</span>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          rows={6}
          placeholder={"200g spaghetti\n2 eggs\n100g pancetta"}
          required
        />
      </label>

      <label className="form-field">
        Steps <span className="form-hint">one per line</span>
        <textarea
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          rows={8}
          placeholder={"Cook pasta until al dente.\nFry pancetta until crisp."}
          required
        />
      </label>

      <label className="form-check">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        Make recipe public
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

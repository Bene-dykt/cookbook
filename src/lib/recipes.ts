import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Recipe } from "../types";

export async function createRecipe(
  data: Omit<Recipe, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "recipes"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getRecipe(id: string): Promise<Recipe | null> {
  const snap = await getDoc(doc(db, "recipes", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Recipe;
}

export async function updateRecipe(
  id: string,
  data: Partial<Pick<Recipe, "title" | "ingredients" | "steps" | "isPublic">>
): Promise<void> {
  await updateDoc(doc(db, "recipes", id), data);
}

export async function deleteRecipe(id: string): Promise<void> {
  await deleteDoc(doc(db, "recipes", id));
}

export async function getUserRecipes(authorId: string): Promise<Recipe[]> {
  const q = query(collection(db, "recipes"), where("authorId", "==", authorId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Recipe)
    .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
}

export async function getPublicRecipes(): Promise<Recipe[]> {
  const q = query(collection(db, "recipes"), where("isPublic", "==", true));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Recipe)
    .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
}

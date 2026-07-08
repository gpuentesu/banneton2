import { SandboxSession, SandboxComparison, SandboxMetrics, SandboxModification } from "../domain/types/sandbox";
import { findMasterRecipeById } from "../domain/data/recipes";
import { createSession, computeSandboxMetrics, compareSessions, isSessionExpired } from "../utils/sandboxUtils";

const activeSessions: Map<string, SandboxSession> = new Map();

export function openSession(recipeId: string): { session: SandboxSession; error?: string } {
	const recipe = findMasterRecipeById(recipeId);
	if (!recipe) {
		return { session: null as unknown as SandboxSession, error: `Receta maestra "${recipeId}" no encontrada` };
	}

	const session = createSession(recipe);
	activeSessions.set(session.sessionId, session);
	return { session };
}

export function getSession(sessionId: string): { session?: SandboxSession; error?: string } {
	const session = activeSessions.get(sessionId);
	if (!session) {
		return { error: `Sesión sandbox "${sessionId}" no encontrada` };
	}
	if (isSessionExpired(session)) {
		session.status = "expired";
		return { error: "La sesión ha expirado. Crea una nueva." };
	}
	return { session };
}

export function getComparison(sessionId: string): { comparison?: SandboxComparison; error?: string } {
	const { session, error } = getSession(sessionId);
	if (error || !session) {return { error };}
	if (session.status !== "active") {return { error: "La sesión no está activa" };}

	const recipe = findMasterRecipeById(session.masterRecipeId);
	if (!recipe) {return { error: "Receta maestra no encontrada" };}

	const comparison = compareSessions(recipe, session);
	return { comparison };
}

export function modifyIngredientQuantity(
	sessionId: string,
	ingredientId: string,
	newQuantityGrams: number,
): { session?: SandboxSession; error?: string } {
	const { session, error } = getSession(sessionId);
	if (error || !session) {return { error };}

	const ingredient = session.modifiedIngredients.find((i) => i.id === ingredientId);
	if (!ingredient) {return { error: `Ingrediente "${ingredientId}" no encontrado` };}

	const previousValue = ingredient.quantityGrams;
	ingredient.quantityGrams = newQuantityGrams;
	session.lastActivityAt = new Date();

	const mod: SandboxModification = {
		componentId: ingredientId,
		field: "quantityGrams",
		previousValue,
		newValue: newQuantityGrams,
	};
	session.modifications.push(mod);

	return { session };
}

export function modifyBakingParameter(
	sessionId: string,
	field: "bakingTimeHours" | "unitsPerBatch",
	newValue: number,
): { session?: SandboxSession; error?: string } {
	const { session, error } = getSession(sessionId);
	if (error || !session) {return { error };}

	const previousValue = session.modifiedBakingParameters[field];
	session.modifiedBakingParameters[field] = newValue;
	session.lastActivityAt = new Date();

	const mod: SandboxModification = {
		componentId: "baking_params",
		field,
		previousValue,
		newValue,
	};
	session.modifications.push(mod);

	return { session };
}

export function discardSession(sessionId: string): { success?: boolean; error?: string } {
	const session = activeSessions.get(sessionId);
	if (!session) {return { error: "Sesión no encontrada" };}

	session.status = "discarded";
	activeSessions.delete(sessionId);
	return { success: true };
}

export function saveSessionAsVersion(
	sessionId: string,
	_versionName: string,
): { session?: SandboxSession; error?: string } {
	const { session, error } = getSession(sessionId);
	if (error || !session) {return { error };}

	session.status = "saved";
	session.lastActivityAt = new Date();
	return { session };
}

export function getSessionMetrics(sessionId: string): { metrics?: SandboxMetrics; error?: string } {
	const { session, error } = getSession(sessionId);
	if (error || !session) {return { error };}

	const metrics = computeSandboxMetrics(
		session.modifiedIngredients,
		session.modifiedBakingParameters,
	);
	return { metrics };
}

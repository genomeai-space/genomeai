/**
 * Production API client for genome-engine backend
 * Falls back to mock engine if backend is unavailable or not configured
 * Safe for public repo: no secrets required locally
 */

import type { GeneratedOutput, Genes } from "./dna";

const PRODUCTION_ENGINE_URL = import.meta.env.VITE_ENGINE_API_URL;

/**
 * Call the production genome engine backend
 * Returns null if backend unavailable (falls back to mock engine)
 */
export async function callProductionEngine(
  genome: Genes,
  task: string,
  name?: string
): Promise<GeneratedOutput | null> {
  if (!PRODUCTION_ENGINE_URL) {
    // No production URL configured — use mock engine
    return null;
  }

  try {
    const response = await fetch(`${PRODUCTION_ENGINE_URL}/api/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        genome,
        task,
        modelName: name,
      }),
    });

    if (!response.ok) {
      console.warn(
        `[Genome Engine] Backend returned ${response.status}, falling back to mock`
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn(
      "[Genome Engine] Backend call failed, falling back to mock engine:",
      error
    );
    return null;
  }
}

/**
 * Call production benchmark backend
 */
export async function callProductionBenchmark(
  genomeId: string,
  taskIds: string[]
): Promise<any | null> {
  if (!PRODUCTION_ENGINE_URL) {
    return null;
  }

  try {
    const response = await fetch(`${PRODUCTION_ENGINE_URL}/api/benchmark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        genomeId,
        tasks: taskIds,
      }),
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn("[Genome Engine] Benchmark call failed:", error);
    return null;
  }
}

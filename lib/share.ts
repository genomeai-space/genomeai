import { type GeneratedOutput, whyThisAnswer } from "@/lib/engine";
import { GENE_MAP, GENE_IDS } from "@/lib/dna";

// Serialize a generated output into clean, shareable plain text.
export function outputToText(output: GeneratedOutput): string {
  const lines: string[] = [];
  lines.push(`# GenomeAI — Response`);
  lines.push(`Topic: ${output.topic}`);
  lines.push("");

  // traits
  if (output.tags.length) {
    lines.push("Traits:");
    for (const t of output.tags)
      lines.push(`  • ${GENE_MAP[t.geneId].icon} ${GENE_MAP[t.geneId].name}: ${t.label}`);
    lines.push("");
  }

  // trace
  if (output.trace.length) {
    lines.push("Reasoning trace:");
    for (const step of output.trace) {
      lines.push(`  ${step.icon} ${step.title}`);
      for (const l of step.lines) lines.push(`    - ${l}`);
    }
    lines.push("");
  }

  // body
  lines.push("Response:");
  for (const b of output.blocks) {
    if (b.type === "para" && b.text) lines.push(b.text);
    else if (b.type === "list" && b.items) {
      for (const it of b.items) lines.push(`  • ${it}`);
    } else if (b.type === "quote" && b.text) lines.push(`  "${b.text}"`);
    else if (b.type === "caveat" && b.text) lines.push(`  ⚠ ${b.text}`);
    lines.push("");
  }

  // metrics
  const m = output.metrics;
  lines.push("---");
  lines.push(
    `Tokens: ${m.tokens.toLocaleString()} · Latency: ${(m.latencyMs / 1000).toFixed(2)}s · Cost: ${m.costCents}¢ · Coherence: ${m.coherence}`
  );
  lines.push("");

  // why this answer
  const why = whyThisAnswer(output.genes);
  if (why.influences.length) {
    lines.push("Why this answer (gene influence):");
    for (const inf of why.influences) {
      const sign = inf.deltaPct > 0 ? "+" : "";
      lines.push(
        `  ${GENE_MAP[inf.geneId].name}: ${sign}${inf.deltaPct}%`
      );
    }
    lines.push(why.summary);
    lines.push("");
  }

  // genome snapshot
  lines.push("Genome:");
  for (const id of GENE_IDS) {
    lines.push(`  ${GENE_MAP[id].name}: ${output.genes[id] ?? 0}`);
  }
  lines.push("");
  lines.push("Generated with GenomeAI — engineer AI behavior with Digital DNA.");

  return lines.join("\n");
}

export function genomeShareLink(output: GeneratedOutput): string {
  // Encode the gene profile into a compact URL fragment for sharing.
  const seq = GENE_IDS.map((id) => String(output.genes[id] ?? 0).padStart(2, "0")).join("");
  return `${location.origin}${location.pathname}#genome=${seq}`;
}

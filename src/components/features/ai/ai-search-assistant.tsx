"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAiSearch } from "@/hooks/use-ai-search";
import { intentToListingsUrl } from "@/lib/ai-intent-to-filters";
import { cn } from "@/lib/utils";

const EXAMPLE_PROMPTS = [
  "Studio in Hanoi for 2 guests under $45",
  "Top rated apartment in Ho Chi Minh City",
  "Budget-friendly house in Da Nang",
];

export function AiSearchAssistant() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const { loading, error, result, search, reset } = useAiSearch();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = prompt.trim();
      if (trimmed.length < 3) return;

      try {
        const data = await search(trimmed);
        const url = intentToListingsUrl(data.intent);
        router.push(url);
      } catch {
        // error surfaced in UI
      }
    },
    [prompt, search, router],
  );

  return (
    <div
      data-testid="ai-search-assistant"
      className="mx-auto mt-6 max-w-2xl rounded-2xl border border-[#b8e6d4] bg-white/90 p-4 shadow-sm backdrop-blur sm:p-5"
    >
      <div className="mb-3 flex items-center justify-center gap-2 text-sm font-semibold text-[#1e4d3b]">
        <Sparkles className="size-4 text-[var(--nestfind-green)]" aria-hidden />
        AI search assistant
      </div>
      <p className="mb-3 text-center text-xs text-[#2d6b52] sm:text-sm">
        Describe your stay in plain language — we extract filters and find matching
        listings.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="ai-search-prompt" className="sr-only">
          Describe your ideal stay
        </label>
        <input
          id="ai-search-prompt"
          data-testid="ai-search-input"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='e.g. "Studio in Hanoi for 2 under $50"'
          className={cn(
            "h-11 flex-1 rounded-full border border-zinc-200 px-4 text-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nestfind-green)]",
          )}
          disabled={loading}
          maxLength={500}
        />
        <Button
          type="submit"
          data-testid="ai-search-submit"
          disabled={loading || prompt.trim().length < 3}
          className="shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Searching…
            </>
          ) : (
            "Ask AI"
          )}
        </Button>
      </form>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {EXAMPLE_PROMPTS.map((example) => (
          <button
            key={example}
            type="button"
            data-testid="ai-search-example"
            className="rounded-full bg-[var(--nestfind-hero)] px-3 py-1 text-xs text-[#2d6b52] hover:bg-[#c8efe0]"
            onClick={() => setPrompt(example)}
            disabled={loading}
          >
            {example}
          </button>
        ))}
      </div>

      {error && (
        <p
          data-testid="ai-search-error"
          className="mt-3 text-center text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}

      {result && !loading && (
        <div
          data-testid="ai-search-result"
          className="mt-3 rounded-xl bg-[var(--nestfind-hero)] px-3 py-2 text-left text-xs text-[#2d6b52] sm:text-sm"
        >
          <p>{result.intent.summary}</p>
          {result.validation.warnings.length > 0 && (
            <ul className="mt-1 list-inside list-disc text-amber-800">
              {result.validation.warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          )}
          <p className="mt-1 text-[10px] uppercase tracking-wide text-zinc-500">
            Provider: {result.provider}
            {result.validation.usedFallback ? " · fallback" : ""}
            {" · "}
            {result.listings.total} matches
          </p>
          <button
            type="button"
            className="mt-2 text-xs font-semibold text-[var(--nestfind-green)] underline"
            onClick={() => reset()}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

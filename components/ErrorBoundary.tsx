import { Component, type ErrorInfo, type ReactNode } from "react";
import { captureError } from "@/lib/reporting";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render-time errors anywhere in the tree, reports them, and shows a
 * friendly fallback so the app never goes fully blank.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    captureError(error, {
      componentStack: info.componentStack ?? undefined,
    });
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-cream px-5 text-center">
        <div className="text-forest">
          {/* Same HelixMark geometry as BrandLogo */}
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <defs>
              <mask id="err-helix-cut-top">
                <rect width="24" height="24" fill="white" stroke="none" />
                <path d="M 17 2 C 17 7, 7 7, 7 12" stroke="black" strokeWidth="7" fill="none" />
              </mask>
              <mask id="err-helix-cut-bot">
                <rect width="24" height="24" fill="white" stroke="none" />
                <path d="M 17 12 C 17 17, 7 17, 7 22" stroke="black" strokeWidth="7" fill="none" />
              </mask>
            </defs>
            <path d="M 7 2 C 7 7, 17 7, 17 12" mask="url(#err-helix-cut-top)" />
            <path d="M 7 12 C 7 17, 17 17, 17 22" mask="url(#err-helix-cut-bot)" />
            <path d="M 17 2 C 17 7, 7 7, 7 12" />
            <path d="M 17 12 C 17 17, 7 17, 7 22" />
          </svg>
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-forest">
            Something went wrong
          </h1>
          <p className="mt-2 max-w-md text-[14px] text-stone">
            We hit an unexpected error while engineering behavior. Your genomes are
            safe in your browser. Try reloading — and if it keeps happening, let us
            know.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-moss px-4 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-forest-700"
          >
            Reload page
          </button>
          <button
            onClick={() => {
              this.reset();
              window.location.assign("/");
            }}
            className="rounded-xl border border-sand bg-paper px-4 py-2.5 text-sm font-medium text-forest transition-colors hover:border-moss"
          >
            Back to home
          </button>
        </div>
        <pre className="mt-2 max-w-lg overflow-auto rounded-lg border border-sand bg-paper px-3 py-2 text-left text-[11px] text-stone">
          {error.message}
        </pre>
      </div>
    );
  }
}

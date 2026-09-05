import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { failed: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Poster War render error', error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="app">
        <section className="verb-panel" style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center' }}>
          <h1 className="lobby-hero-title">The chamber flickered.</h1>
          <p className="lobby-hero-sub">Reload to return to the lawn. Your seat is still yours.</p>
          <button className="btn-primary-action" onClick={() => window.location.reload()}>
            RE-ENTER
          </button>
        </section>
      </div>
    );
  }
}

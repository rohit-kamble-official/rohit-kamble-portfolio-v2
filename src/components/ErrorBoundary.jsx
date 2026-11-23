import { Component } from 'react'

/** Contains failures in optional, enhancement-only UI (e.g. the WebGL hero) so the page keeps working. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error) {
    this.props.onError?.(error)
    if (import.meta.env.DEV) console.error('[ErrorBoundary]', error)
  }
  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children
  }
}

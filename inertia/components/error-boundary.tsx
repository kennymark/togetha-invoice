import { Component, type ErrorInfo, type ReactNode } from 'react'
import { router } from '@inertiajs/react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      // If it's an auth error, redirect to login
      if (this.state.error?.message?.includes('Unauthorized')) {
        router.visit('/auth/login')
        return null
      }

      // If it's a "Cannot GET" error, redirect to not found page
      if (this.state.error?.message?.includes('Cannot GET')) {
        router.visit('/errors/not-found')
        return null
      }

      return (
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold mb-4'>Something went wrong</h1>
            <p className='text-gray-600 mb-4'>
              {this.state.error?.message || "We're working on fixing this issue"}
            </p>
            <button
              type='button'
              onClick={() => window.location.reload()}
              className='px-4 py-2 bg-primary text-white rounded hover:opacity-80'>
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

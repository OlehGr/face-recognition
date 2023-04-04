import { useState } from 'preact/hooks'
import Camera from './Camera/Camera'
import RegForm from './RegForm/RegForm'
import { QueriesObserver, QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RegForm />
      </QueryClientProvider>
    </>
  )
}

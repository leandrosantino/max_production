import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppRoutes } from './routes'
import { ThemeModeProvider } from './contexts/themeContext.js'
import { SideBarContextProvider } from './contexts/sideBarContext.js'
import { GlobalStyle } from './styles/global'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <ThemeModeProvider>
      <SideBarContextProvider>
        <GlobalStyle />
        <AppRoutes />
      </SideBarContextProvider>
    </ThemeModeProvider>
  </QueryClientProvider>
)

import React from 'react'
import { Route, Router } from 'electron-router-dom'

import { Layout } from './components/Layout'
import { Home } from './screens/home'
import { ElogData } from './screens/elog_data'

export function AppRoutes() {
  return (
    <Router
      main={
        <>
          <Route path="/" Component={Layout} >

            <Route path="" element={<Home/>} />
            <Route path="/register" element={<h1>Registro de produção</h1>} />
            <Route path="/item/:days/:id" element={<ElogData />} />

          </Route>
        </>
      }
    />
  )
}


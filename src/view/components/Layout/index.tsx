import { Header } from '../Header'
import { Sidebar } from '../Sidebar'
import { Outlet } from 'react-router-dom'
import { Main } from './style'
import React from 'react'

export function Layout () {

  return (
    <Main isAuth={'true'}>
      <Header />
      {true && <>
        <Sidebar />
      </>}
      <section>
        <Outlet />
      </section>
    </Main>
  )
}

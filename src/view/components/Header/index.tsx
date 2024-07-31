import {
  Avatar,
  AvatarFallback,
  Container,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator
} from './style'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { PersonIcon, ExitIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'
import { useSideBarShow } from '../../hooks/useSideBarShow'
import { ShowSideBarButton } from '../ShowSideBarButton'
import React from 'react'

export function Header () {
  const navigate = useNavigate()
  const { setShowSideBar } = useSideBarShow()

  return (
    <Container isAuth={'true'} >

      {false &&
          <h2>
            Service<span>Orders</span>
          </h2>
      }

      <div>
        <ShowSideBarButton onClick={() => { setShowSideBar(true) }} />
        <h3>Adler Pelzer Group</h3>
      </div>

      {false && <div>

        <label >User</label>

        <DropdownMenu.Root>
          <DropdownMenuTrigger>

              <Avatar>
                <AvatarFallback>
                  PR
                </AvatarFallback>
              </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenu.Portal>
            <DropdownMenuContent sideOffset={10}>
              <DropdownMenu.Item>
                <button
                  onClick={() => { navigate('userInfo') }}
                >
                  <span>Info. Usuário</span>
                  <PersonIcon/>
                </button>

              </DropdownMenu.Item>
              <DropdownMenuSeparator/>
              <DropdownMenu.Item>
                <button
                  className='btQuit'
                  // onClick={() => { signOut() }}
                >
                  <span>Sair</span>
                  <ExitIcon/>
                </button>
              </DropdownMenu.Item>
            </DropdownMenuContent>
          </DropdownMenu.Portal>

        </DropdownMenu.Root>

      </div>}

    </Container>
  )
}

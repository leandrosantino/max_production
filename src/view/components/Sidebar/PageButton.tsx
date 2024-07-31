import { ToggleGroupItem } from './style'
import { useNavigate } from 'react-router-dom'
import { type ToggleGroupItemProps } from '@radix-ui/react-toggle-group'
import React from 'react'


export function PageButton ({ value, children, ...rest }: ToggleGroupItemProps) {
  const navigate = useNavigate()

  return (
    <>
      {
        true &&
        <ToggleGroupItem {...rest} onClick={() => { navigate(value) }} value={value}>
          {children}
        </ToggleGroupItem>
      }
    </>
  )
}

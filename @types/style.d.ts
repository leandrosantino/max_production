import 'styled-components'
import { type Theme } from '../src/contexts/themeContext'

declare module 'styled-components' {
  export interface DefaultTheme extends Theme { }
}

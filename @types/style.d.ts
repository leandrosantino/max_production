import 'styled-components'
import { type Theme } from '../src/view/contexts/themeContext'

declare module 'styled-components' {
  export interface DefaultTheme extends Theme { }
}

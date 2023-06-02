import { extendTheme } from '@chakra-ui/react'
import type { StyleFunctionProps } from '@chakra-ui/styled-system'


const theme = extendTheme({
  fontSizes: {
    md: 'var(--body-text-size)',
  },
  components: {
    Tabs: {
      variants: {
        'nevysha': {
          tab: {
            marginBottom: '-1px',
            border: '1px solid transparent',
            borderColor: 'transparent',
            borderBottom: 'none',
            borderTopRightRadius: 'var(--container-radius)',
            borderTopLeftRadius: 'var(--container-radius)',
            padding: 'var(--size-1) var(--size-4)',
            color: 'var(--body-text-color-subdued)',
            fontWeight: 'var(--section-header-text-weight)',
            fontSize: 'var(--section-header-text-size)',
          }
        }
      }
    }
  }
})

export default theme
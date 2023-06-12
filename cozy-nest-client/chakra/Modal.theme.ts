import {createMultiStyleConfigHelpers} from "@chakra-ui/react";
import {modalAnatomy} from "@chakra-ui/anatomy";

let { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(modalAnatomy.keys)

export const modalTheme = defineMultiStyleConfig({
  defaultProps: {
    variant: 'nevysha'
  },
  variants: {
    nevysha:
        definePartsStyle({
          dialog: {
            opacity: 1,
            width: '800px',
            marginRight: 'auto',
            marginLeft: 'auto',
            transform: 'none',
            maxWidth: 'fit-content',
            background: 'none',
          },
        }),
    'nevysha-confirm':
        definePartsStyle({
          dialog: {
            opacity: 1,
            width: '800px',
            marginRight: 'auto',
            marginLeft: 'auto',
            transform: 'none',
            maxWidth: 'fit-content',
            border: '1px solid var(--ae-input-border-color)',
            backgroundColor: 'var(--block-background-fill)',
            color: 'var(--body-text-color)',
            borderRadius: '0 !important',
            fontSize: 'var(--body-text-size)',
          },
          footer: {
            display: 'flex !important',
            gap: '5px',
          }
        })
  },
})
import {createMultiStyleConfigHelpers} from "@chakra-ui/react";
import {modalAnatomy} from "@chakra-ui/anatomy";

let { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(modalAnatomy.keys)

export const modalTheme = defineMultiStyleConfig({
  defaultProps: {
    variant: 'nevysha'
  },
  variants: { nevysha: definePartsStyle({
      dialog: {
        opacity: 1,
        width: '800px',
        marginRight: 'auto',
        marginLeft: 'auto',
        transform: 'none',
        maxWidth: 'fit-content',
        background: 'none',
      }
  }) },
})
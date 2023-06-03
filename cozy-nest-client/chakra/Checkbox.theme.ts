import {createMultiStyleConfigHelpers} from "@chakra-ui/react";
import {checkboxAnatomy, radioAnatomy} from "@chakra-ui/anatomy";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys)

export const checkboxTheme = defineMultiStyleConfig({
  defaultProps: {
    variant: 'nevysha'
  },
  variants: { nevysha: definePartsStyle({
      control: {
        boxShadow: 'var(--input-shadow)',
        border: '1px solid var(--ae-input-border-color) !important',
        borderRadius: 'var(--checkbox-border-radius)',
        backgroundColor: 'var(--checkbox-background-color)',
        lineHeight: 'var(--line-sm)',
      }
    }) },
})

const {
  definePartsStyle: radioDefinePartsStyle,
  defineMultiStyleConfig: radioDefineMultiStyleConfig
} = createMultiStyleConfigHelpers(radioAnatomy.keys);

export const radioTheme = radioDefineMultiStyleConfig({
  defaultProps: {
    variant: 'nevysha'
  },
  variants: { nevysha: radioDefinePartsStyle({
    control: {
      boxShadow: 'var(--input-shadow)',
      border: '1px solid var(--ae-input-border-color) !important',
      // borderRadius: 'var(--checkbox-border-radius)',
      backgroundColor: 'var(--checkbox-background-color)',
      lineHeight: 'var(--line-sm)',
    }
  }) },
})



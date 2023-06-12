import {createMultiStyleConfigHelpers} from "@chakra-ui/react";
import {inputAnatomy, numberInputAnatomy} from "@chakra-ui/anatomy";

let { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

export const inputTheme = defineMultiStyleConfig({
  defaultProps: {
    variant: 'nevysha'
  },
  variants: { nevysha: definePartsStyle({
      field: {
        outline: 'none!important',
        boxShadow: 'var(--input-shadow)',
        border: '1px solid var(--ae-input-border-color) !important',
        borderRadius: '0 !important',
        backgroundColor: 'var(--input-background-fill) !important',
        padding: 'var(--input-padding) !important',
        width: '100%',
        color: 'var(--body-text-color)',
        fontSize: 'var(--input-text-size)',
        lineHeight: 'var(--line-sm)',
        fontFamily: 'monospace !important',
      }
    }) },
})

const {
  definePartsStyle: numberInputDefinePartsStyle,
  defineMultiStyleConfig: numberInputDefineMultiStyleConfig
} = createMultiStyleConfigHelpers(numberInputAnatomy.keys);

export const numberInputTheme = numberInputDefineMultiStyleConfig({
  defaultProps: {
    variant: 'nevysha'
  },
  variants: { nevysha: numberInputDefinePartsStyle({
      field: {
        outline: 'none!important',
        boxShadow: 'var(--input-shadow)',
        border: '1px solid var(--ae-input-border-color) !important',
        borderRadius: '0 !important',
        backgroundColor: 'var(--input-background-fill) !important',
        padding: 'var(--input-padding) !important',
        width: '100%',
        color: 'var(--body-text-color)',
        fontSize: 'var(--input-text-size) !important',
        lineHeight: 'var(--line-sm)',
        fontFamily: 'monospace !important',
      },
      stepperGroup: {
        border: '1px solid var(--ae-input-border-color) !important',
        borderTop: 'none !important',
        borderRight: 'none !important',
      },
      stepper: {
        color: 'var(--body-text-color)',
        borderTop: 'none !important',
        borderLeft: 'none !important',
      }
    }) },
})
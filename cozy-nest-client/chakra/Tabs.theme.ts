import {createMultiStyleConfigHelpers} from "@chakra-ui/react";
import {tabsAnatomy} from "@chakra-ui/anatomy";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys)

export const tabsTheme = defineMultiStyleConfig({
  defaultProps: {
    variant: 'nevysha'
  },
  variants: { nevysha: definePartsStyle({
      tab: {
        marginBottom: '-1px',
        border: '1px solid transparent',
        borderColor: 'transparent',
        borderBottom: 'none',
        borderRadius: '0 !important',
        padding: 'var(--size-1) var(--size-4) !important',
        color: 'var(--body-text-color-subdued) !important',
        fontWeight: 'var(--section-header-text-weight) !important',
        fontSize: 'var(--section-header-text-size) !important',
        borderTop: '2px solid transparent !important',
        _selected: {
          borderTop: '2px solid var(--ae-primary-color) !important',
          backgroundColor: 'var(--tab-nav-background-color-selected) !important',
          color: 'var(--body-text-color) !important',
        },
        _focus: {
          outline: 'none'
        },
        _hover: {
          outline: 'none',
          borderRight: '1px solid transparent',
          borderLeft: '1px solid transparent',
        }
      },
      tabpanel: {
        border: '1px solid var(--border-color-primary)',
        borderTop: 'none',
        borderBottomRightRadius: 'var(--container-radius)',
        borderBottomLeftRadius: 'var(--container-radius)',
        padding: 'var(--block-padding)',
        backgroundColor: 'var(--tab-nav-background-color-selected) !important',
        gap: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: '500px',
        overflowY: 'auto',
      }
    }) },
})
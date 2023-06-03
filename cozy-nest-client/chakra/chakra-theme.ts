import { extendTheme } from '@chakra-ui/react'


import {inputTheme, numberInputTheme} from "./input.theme";
import {tabsTheme} from "./Tabs.theme";
import {checkboxTheme, radioTheme} from "./Checkbox.theme";

export const theme = extendTheme({
  fontSizes: {
    md: 'var(--body-text-size)',
  },
  components: {
    Input: inputTheme,
    Tabs: tabsTheme,
    Checkbox: checkboxTheme,
    NumberInput: numberInputTheme,
    Radio: radioTheme,
  },
})
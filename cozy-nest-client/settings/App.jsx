import React, {useState} from "react";
import './App.css'
import {svg_magic_wand} from "../main/svg.js";
import {Header} from "./Header.jsx";
import {Column, Row, RowFullWidth} from "../main/Utils.jsx";
import {
  Radio,
  RadioGroup,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Checkbox,
  CheckboxGroup,
  Stack,
  Input,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberDecrementStepper
} from '@chakra-ui/react'
import {HexColorPicker} from "react-colorful";
import {PopoverColorPicker} from "./PopoverColorPicker.jsx";





export function App() {

  const [isVisible, setIsVisible] = useState(true)

  // "font_color": "#d4d4d4",
  // "font_color_light": "#474747",
  // "waves_color": "#5e1a91",
  // "bg_gradiant_color": "#65005e",
  // "accent_color": "#5cafd6",
  const [fontColor, setFontColor] = useState(COZY_NEST_CONFIG.font_color);
  const [fontColorLight, setFontColorLight] = useState(COZY_NEST_CONFIG.font_color_light);
  const [wavesColor, setWavesColor] = useState(COZY_NEST_CONFIG.waves_color);
  const [bgGradiantColor, setBgGradiantColor] = useState(COZY_NEST_CONFIG.bg_gradiant_color);
  const [accentColor, setAccentColor] = useState(COZY_NEST_CONFIG.accent_color);

  const toggle = () => {
    CozyLogger.debug('toggle')
    setIsVisible(!isVisible)
  }

  return (
    <div style={{display: 'flex'}}>
      <button className="nevysha-btn-menu"
              id="nevyui_sh_options"
              title="Nevysha Cozy Nest Settings"
              dangerouslySetInnerHTML={{__html:svg_magic_wand}}
              onClick={toggle}
      />
      { isVisible &&
        <div className="App nevysha">
          <Header onClickClose={() => setIsVisible(false)}/>

          <div className="container">
            <Tabs variant='nevysha'>
              <TabList style={{backgroundColor: 'var(--tab-nav-background-color)'}}>
                <Tab>Main Settings</Tab>
                <Tab>Image Browser Settings</Tab>
                <Tab>Others</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <RowFullWidth>
                    <Checkbox>Display information dialog on Cozy Nest error</Checkbox>
                    <Checkbox>Disable waves and gradiant background animations</Checkbox>
                  </RowFullWidth>
                  <Column>
                    <label>Main menu position</label>
                    <RadioGroup>
                      <Stack direction='row'>
                        <Radio value='1'>left</Radio>
                        <Radio value='2'>top</Radio>
                        <Radio value='3'>top centered</Radio>
                      </Stack>
                    </RadioGroup>
                  </Column>
                  <Column>
                    <label>Quicksettings position</label>
                    <RadioGroup>
                      <Stack direction='row'>
                        <Radio value='1'>left</Radio>
                        <Radio value='2'>split</Radio>
                        <Radio value='3'>centered</Radio>
                      </Stack>
                    </RadioGroup>
                  </Column>
                  <Row>
                    <Checkbox>Accent Generate Button</Checkbox>
                  </Row>
                  <RowFullWidth>
                    <FormControl>
                      <FormLabel>Font size</FormLabel>
                      <NumberInput defaultValue={12} min={10} max={18}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Extra network card height</FormLabel>
                      <NumberInput defaultValue={8} min={5} max={20}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Extra network card width</FormLabel>
                      <NumberInput defaultValue={13} min={5} max={20}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                  </RowFullWidth>
                  <RowFullWidth>
                    <PopoverColorPicker label="Font Color" color={fontColor} onChange={setFontColor} />
                    <PopoverColorPicker label="Font Color" color={fontColorLight} onChange={setFontColorLight} />
                    <PopoverColorPicker label="Waves Color" color={wavesColor} onChange={setWavesColor} />
                    <PopoverColorPicker label="Background gradiant Color" color={bgGradiantColor} onChange={setBgGradiantColor} />
                    <PopoverColorPicker label="Accent Color" color={accentColor} onChange={setAccentColor} />
                  </RowFullWidth>
                  <RowFullWidth>
                    <Checkbox>SFW mode 👀 (blur all images)</Checkbox>
                  </RowFullWidth>
                </TabPanel>

                <TabPanel>
                  <RowFullWidth>
                    <Checkbox>Disable image browser (Reload UI required)</Checkbox>
                  </RowFullWidth>
                  <RowFullWidth>
                    <FormControl>
                      <FormLabel>Socket port for image browser</FormLabel>
                      <Input placeholder='3333' />
                    </FormControl>
                    <Checkbox>Auto search port</Checkbox>
                    <Checkbox>Fetch output folder from a1111 settings (Reload needed to enable)</Checkbox>
                  </RowFullWidth>
                  <Column>
                    <FormLabel>Archive path</FormLabel>
                    <Input placeholder='C:/stable-difusion/...' />
                  </Column>
                  <Column>
                    <FormLabel>Output path</FormLabel>
                    <Input placeholder='C:/stable-difusion/...' />
                    <Input placeholder='C:/stable-difusion/...' />
                    <Input placeholder='C:/stable-difusion/...' />
                  </Column>
                </TabPanel>

                <TabPanel>
                  <p>Those settings are heavy on DOM modification and might conflict with some others extensions</p>
                  <p>Reload UI needed to apply</p>
                  <Column>
                    <Checkbox>Enable clear gallery button in txt2img and img2img tabs</Checkbox>
                    <Checkbox>Enable extra network tweaks</Checkbox>
                  </Column>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <RowFullWidth className="btn-toolbar" style={{gap: '25px', padding: '15px'}}>
              <div className="btn" style={{width:'100%'}}>Save</div>
              <div className="btn" style={{width:'100%'}}>Reset</div>
              <div className="btn" style={{width:'100%'}}>Reload UI</div>
            </RowFullWidth>

            <div>Made by Nevysha with luv</div>
          </div>

        </div>
      }
    </div>
  )
}
import React, {useEffect, useRef, useState} from "react";
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
  Stack,
  Input,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberDecrementStepper,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import {PopoverColorPicker} from "./PopoverColorPicker.jsx";
import {OuputFolderSelector} from "./OuputFolderSelector.jsx";
import {
  applyAccentColor,
  applyBgGradiantColor,
  applyFontColor,
  applyWavesColor,
  applyDisabledWavesAndGradiant,
  applyAccentForGenerate,
  applyFontSize,
  setCardHeight,
  setCardWidth,
  applyMenuPosition, setQuicksettingPosition, setSfwSettings, recalcOffsetFromMenuHeight
} from "../main/tweaks/various-tweaks.js";
import {getTheme} from "../main/cozy-utils.js";
import {WEBUI_A1111, WEBUI_SDNEXT} from "../main/Constants.js";
import {saveCozyNestConfig} from "../main/nevysha-cozy-nest.js";
import {ButtonWithConfirmDialog} from "../chakra/ButtonWithConfirmDialog.jsx";


function DialogWrapper({children, isVisible}) {
  const { isOpen, onOpen, onClose } = useDisclosure({isOpen: isVisible})
  const cancelRef = useRef()

  useEffect(() => {
    if (isVisible) {
      onOpen()
    }
    else {
      onClose()
    }
  }, [isVisible])

  return (
    <AlertDialog
      motionPreset='scale'
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogBody>
            {children}
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

const nevyshaScrollbar = {
  '&::-webkit-scrollbar': {
    width: '5px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'var(--ae-primary-color)',
    borderRadius: '20px',
  },
}

export function App() {

  const [isVisible, setIsVisible] = useState(false)

  const [config, setConfig] = useState(COZY_NEST_CONFIG)

  function applySettings() {
    applyWavesColor(config.waves_color);
    applyFontColor(
      getTheme() === "dark" ?
        config.font_color :
        config.font_color_light
    )
    applyBgGradiantColor(config.bg_gradiant_color);
    applyDisabledWavesAndGradiant(config.disable_waves_and_gradiant);
    applyAccentColor(config.accent_color, config.accent_color);
    applyAccentForGenerate(config.accent_generate_button, config.accent_color);
    applyFontSize(config.font_size)
    setCardHeight(config.card_height)
    setCardWidth(config.card_width)
    applyMenuPosition(config.main_menu_position)
    setQuicksettingPosition(config.quicksettings_position)
    setSfwSettings(config.sfw_mode)
    recalcOffsetFromMenuHeight()
  }

  useEffect(() => {
    applySettings();
  }, [config])

  useEffect(() => {
    setConfig(COZY_NEST_CONFIG)
  }, [COZY_NEST_CONFIG])

  useEffect(() => {
    applySettings();
  }, [])

  const toggle = () => {
    CozyLogger.debug('toggle')
    setIsVisible(!isVisible)
  }

  const updateConfig = (e, what) => {

    const newConfig = {...config}
    if (e.target)
      newConfig[what] = e.target.value
    else
      newConfig[what] = e

    setConfig(newConfig)
  }

  const saveConfig = () => {
    (async () => await saveCozyNestConfig(config))()
  }

  const resetConfig = () => {
    (async () => {
      // call to @app.delete("/cozy-nest/config")
      await fetch(`/cozy-nest/config`, {
        method: 'DELETE',
      })
    })();
  }

  const reloadUi = () => {

    if (config.webui === WEBUI_A1111) {
      document.querySelector('#settings_restart_gradio').click();
      return;
    }
    else if (config.webui === WEBUI_SDNEXT) {
      document.querySelector('#restart_submit').click();
      return;
    }

    (async () => {
      // call to @app.get("/cozy-nest/reloadui")
      await fetch(`/cozy-nest/reloadui`)
      //reload the page
      window.location.reload()
    })();
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
        <DialogWrapper isVisible={isVisible}>
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
                  <TabPanel css={nevyshaScrollbar}>
                    <RowFullWidth>
                      <Checkbox
                          isChecked={config.error_popup}
                          onChange={(e) => setConfig({...config, error_popup: e.target.checked})}
                      >Display information dialog on Cozy Nest error</Checkbox>
                      <Checkbox
                          isChecked={config.disable_waves_and_gradiant}
                          onChange={(e) => setConfig({...config, disable_waves_and_gradiant: e.target.checked})}
                      >Disable waves and gradiant background animations</Checkbox>
                    </RowFullWidth>
                    <Column>
                      <label>Main menu position</label>
                      <RadioGroup
                          value={config.main_menu_position}
                          onChange={(value) => setConfig({...config, main_menu_position: value})}
                      >
                        <Stack direction='row'>
                          <Radio value='left'>left</Radio>
                          <Radio value='top'>top</Radio>
                          <Radio value='top_centered'>top centered</Radio>
                        </Stack>
                      </RadioGroup>
                    </Column>
                    <Column>
                      <label>Quicksettings position</label>
                      <RadioGroup
                          value={config.quicksettings_position}
                          onChange={(value) => setConfig({...config, quicksettings_position: value})}
                      >
                        <Stack direction='row'>
                          <Radio value='left'>left</Radio>
                          <Radio value='split'>split</Radio>
                          <Radio value='centered'>centered</Radio>
                        </Stack>
                      </RadioGroup>
                    </Column>
                    <Row>
                      <Checkbox
                          isChecked={config.accent_generate_button}
                          onChange={(e) => setConfig({...config, accent_generate_button: e.target.checked})}
                      >Accent Generate Button</Checkbox>
                    </Row>
                    <RowFullWidth>
                      <FormControl>
                        <FormLabel>Font size</FormLabel>
                        <NumberInput defaultValue={12} min={10} max={18}>
                          <NumberInputField/>
                          <NumberInputStepper>
                            <NumberIncrementStepper/>
                            <NumberDecrementStepper/>
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Extra network card height</FormLabel>
                        <NumberInput
                            value={config.card_height}
                            onChange={(e) => updateConfig(e, 'card_height')}
                            min={5} max={20}
                        >
                          <NumberInputField/>
                          <NumberInputStepper>
                            <NumberIncrementStepper/>
                            <NumberDecrementStepper/>
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Extra network card width</FormLabel>
                        <NumberInput
                            value={config.card_width}
                            onChange={(e) => updateConfig(e, 'card_width')}
                            min={5} max={20}
                        >
                          <NumberInputField/>
                          <NumberInputStepper>
                            <NumberIncrementStepper/>
                            <NumberDecrementStepper/>
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>

                    </RowFullWidth>
                    <RowFullWidth>
                      <PopoverColorPicker
                          label="Font Color"
                          color={config.font_color}
                          onChange={(e) => updateConfig(e, 'font_color')} />
                      <PopoverColorPicker
                          label="Font Color"
                          color={config.font_color_light}
                          onChange={(e) => updateConfig(e, 'font_color_light')} />
                      <PopoverColorPicker
                          label="Waves Color"
                          color={config.waves_color}
                          onChange={(e) => updateConfig(e, 'waves_color')} />
                      <PopoverColorPicker
                          label="Background gradiant Color"
                          color={config.bg_gradiant_color}
                          onChange={(e) => updateConfig(e, 'bg_gradiant_color')} />
                      <PopoverColorPicker
                          label="Accent Color"
                          color={config.accent_color}
                          onChange={(e) => updateConfig(e, 'accent_color')} />
                    </RowFullWidth>
                    <RowFullWidth>
                      <Checkbox
                          isChecked={config.sfw_mode}
                          onChange={(e) => setConfig({...config, sfw_mode: e.target.checked})}
                      >SFW mode 👀 (blur all images)</Checkbox>
                    </RowFullWidth>
                  </TabPanel>

                  <TabPanel css={nevyshaScrollbar}>
                    <RowFullWidth>
                      <Checkbox
                          isChecked={config.disable_image_browser}
                          onChange={(e) => setConfig({...config, disable_image_browser: e.target.checked})}
                      >Disable image browser (Reload UI required)</Checkbox>
                    </RowFullWidth>
                    <RowFullWidth>
                      <FormControl style={{width: "30%"}}>
                        <FormLabel>Socket port for image browser</FormLabel>
                        <Input
                            placeholder='3333'
                            value={config.server_default_port}
                            onChange={(e) => updateConfig(e, 'server_default_port')}
                        />
                      </FormControl>
                      <Checkbox
                      >Auto search port</Checkbox>
                      <Checkbox
                        visibility={config.webui === WEBUI_SDNEXT ? 'hidden' : 'visible'}
                        isChecked={config.fetch_output_folder_from_a1111_settings}
                        onChange={(e) => setConfig({...config, fetch_output_folder_from_a1111_settings: e.target.checked})}
                      >Fetch output folder from a1111 settings (Reload needed to enable)</Checkbox>
                    </RowFullWidth>
                    <Column>
                      <FormLabel>Archive path</FormLabel>
                      <Input
                          placeholder='C:/stable-difusion/...'
                          value={config.archive_path}
                          onChange={(e) => updateConfig(e, 'archive_path')}
                      />
                    </Column>
                    <Column>
                      <FormLabel>Output path</FormLabel>
                      <OuputFolderSelector config={config} setConfig={setConfig}/>
                    </Column>
                  </TabPanel>

                  <TabPanel css={nevyshaScrollbar}>
                    <p>Those settings are heavy on DOM modification and might conflict with some others extensions</p>
                    <p>Reload UI needed to apply</p>
                    <Column>
                      <Checkbox
                          isChecked={config.enable_clear_button}
                          onChange={(e) => setConfig({...config, enable_clear_button: e.target.checked})}
                      >Enable clear gallery button in txt2img and img2img tabs</Checkbox>
                      <Checkbox
                          isChecked={config.enable_extra_network_tweaks}
                          onChange={(e) => setConfig({...config, enable_extra_network_tweaks: e.target.checked})}
                      >Enable extra network tweaks</Checkbox>
                      <Checkbox
                          isChecked={config.enable_cozy_prompt}
                          onChange={(e) => setConfig({...config, enable_cozy_prompt: e.target.checked})}
                      >Enable Cozy Prompt</Checkbox>
                    </Column>
                  </TabPanel>
                </TabPanels>
              </Tabs>

              <RowFullWidth className="btn-toolbar" style={{gap: '25px', padding: '15px'}}>
                <button
                  className="btn-settings"
                  style={{width: '100%'}}
                  onClick={saveConfig}
                >Save</button>
                <ButtonWithConfirmDialog
                  message="Are you sure you want to reset all settings ? This will trigger a UI Reload"
                  confirmLabel="Reset"
                  cancelLabel="Cancel"
                  onConfirm={resetConfig}
                />
                <button
                  className="btn-settings"
                  style={{width: '100%'}}
                  onClick={reloadUi}
                >Reload UI</button>
              </RowFullWidth>

              <div>Made by Nevysha with luv</div>
            </div>
          </div>
        </DialogWrapper>
      }
    </div>
  )
}
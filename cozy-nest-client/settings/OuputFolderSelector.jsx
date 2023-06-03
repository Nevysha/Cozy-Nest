import React, {useEffect, useState} from "react";
import {Input, InputGroup, InputRightElement} from "@chakra-ui/react";


export function OuputFolderSelector({config, setConfig}) {

  const [outputFolder, setOutputFolder] = useState(config.cnib_output_folder)

  const [newOutputFolder, setNewOutputFolder] = useState('')

  useEffect(() => {
    setOutputFolder(config.cnib_output_folder)
  }, [config]);

  const addNewOutputFolder = () => {
    if (newOutputFolder === '') {
      return
    }
    const newOutputFolderArray = [...outputFolder]
    newOutputFolderArray.push(newOutputFolder)
    setOutputFolder(newOutputFolderArray)
    setConfig({...config, cnib_output_folder: newOutputFolderArray})
    setNewOutputFolder('')
  }

  return (
    <>
      <div className="OutputFolderSelector">
      {outputFolder.map((folder, index) => {
        return (
            <InputGroup key={index}>
              <Input
                placeholder="C:/stable-difusion/..."
                value={folder}
                onChange={(e) => {
                  const newOutputFolder = [...outputFolder]
                  newOutputFolder[index] = e.target.value
                  setOutputFolder(newOutputFolder)
                  setConfig({...config, cnib_output_folder: newOutputFolder})
                }}
              />
              <InputRightElement width='4.5rem'>
                <button
                    className="btn-settings"
                    onClick={() => {
                        const newOutputFolder = [...outputFolder]
                        newOutputFolder.splice(index, 1)
                        setOutputFolder(newOutputFolder)
                        setConfig({...config, cnib_output_folder: newOutputFolder})
                    }}
                >Delete</button>
              </InputRightElement>
            </InputGroup>
        )
      })}
        <InputGroup>
          <Input
              placeholder="Add a new folder..."
              value={newOutputFolder}
              onChange={(e) => {
                  setNewOutputFolder(e.target.value)
              }}
          />
          <InputRightElement width='4.5rem'>
            <button className="btn-settings" onClick={addNewOutputFolder}>Add</button>
          </InputRightElement>
        </InputGroup>
      </div>
    </>
  );
}
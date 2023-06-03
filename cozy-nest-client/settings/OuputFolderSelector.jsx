import React, {useEffect, useState} from "react";
import {Input, InputGroup, InputRightElement} from "@chakra-ui/react";


export function OuputFolderSelector({config, setConfig}) {

  const [outputFolder, setOutputFolder] = useState(config.cnib_output_folder)

  useEffect(() => {
    setOutputFolder(config.cnib_output_folder)
  }, [config]);

  return (
    <>
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
                <div className="btn">Delete</div>
              </InputRightElement>
            </InputGroup>
        )
      })}
      <InputGroup>
        <Input
            placeholder="Add a new folder..."
        />
        <InputRightElement width='4.5rem'>
          <div className="btn">Add</div>
        </InputRightElement>
      </InputGroup>
    </>
  );
}
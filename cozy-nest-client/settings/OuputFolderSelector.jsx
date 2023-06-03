import React, {useEffect, useState} from "react";
import {Input} from "@chakra-ui/react";


export function OuputFolderSelector({config, setConfig}) {

  const [outputFolder, setOutputFolder] = useState(config.cnib_output_folder)

  useEffect(() => {
    setOutputFolder(config.cnib_output_folder)
  }, [config]);

  return (
    <>
      {outputFolder.map((folder, index) => {
        return <Input
          placeholder="C:/stable-difusion/..."
          value={folder}
          onChange={(e) => {
            const newOutputFolder = [...outputFolder]
            newOutputFolder[index] = e.target.value
            setOutputFolder(newOutputFolder)
            setConfig({...config, cnib_output_folder: newOutputFolder})
          }}
        />
      })}
    </>
  );
}
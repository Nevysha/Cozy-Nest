import React, {useCallback, useEffect, useRef, useState} from "react";
import { HexColorPicker } from "react-colorful";

export const PopoverColorPicker = ({ color, onChange, label }) => {
  const popover = useRef();
  const [isOpen, toggle] = useState(false);

  return (
    <div>
      <label>{label}</label>
      <div className="picker">
        <div
          className="swatch"
          style={{ backgroundColor: color }}
          onClick={() => toggle(true)}
        />

        {isOpen && (
          <>
            <div className="popoverWrap" onClick={() => toggle(false)} />
            <div className="popover" ref={popover}>
              <HexColorPicker color={color} onChange={onChange} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
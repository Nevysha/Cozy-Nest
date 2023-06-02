import React, { useCallback, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

import useClickOutside from "./useClickOutside";

export const PopoverColorPicker = ({ color, onChange, label }) => {
  const popover = useRef();
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

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
          <div className="popover" ref={popover}>
            <HexColorPicker color={color} onChange={onChange} />
          </div>
        )}
      </div>
    </div>
  );
};
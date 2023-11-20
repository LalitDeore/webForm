import React from "react";
import { FaBold, FaItalic, FaUnderline } from "react-icons/fa";

import "./EditableInputText.css";

const EditableInputText = ({
  isBold,
  isItalic,
  isUnderline,
  boldEventHandler,
  italicEventHandler,
  underlineEventHandler,
}) => {
  return (
    <div className="font-design">
      <button onClick={boldEventHandler} className="bold">
        <FaBold />
      </button>
      <button className="italic" onClick={italicEventHandler}>
        <FaItalic />
      </button>
      <button className="underline" onClick={underlineEventHandler}>
        <FaUnderline />
      </button>
    </div>
  );
};
export default EditableInputText;

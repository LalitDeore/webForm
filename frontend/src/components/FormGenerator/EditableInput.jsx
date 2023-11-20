import React, { useRef, useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { useFormContext } from "./FormContext";
import "./EditableInput.css";

const EditableInput = ({
  index,
  value,
  isBold,
  isItalic,
  isUnderline,
  fieldKey,
  styleOfSection,
  placeholder,
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const inputRef = useRef(null);
  const { setAddFields, setData } = useFormContext();

  const getStyle = () => {
    return {
      ...styleOfSection,
      ...(isBold && { fontWeight: "bold" }),
      ...(isItalic && { fontStyle: "italic" }),
      ...(isUnderline && { textDecoration: "underline" }),
    };
  };

  const editableEventHandler = () => {
    setIsEditable(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const changeHandler = (event) => {
    setAddFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index] = {
        ...updatedFields[index],
        value: event.target.value,
      };
      return updatedFields;
    });

    setData((prevData) => ({
      ...prevData,
      [fieldKey]: event.target.value,
    }));
  };

  const pageReloadingHandler = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  };

  return (
    <div className="all-editable-input">
      <span className="change-input">
        <input
          ref={inputRef}
          placeholder={placeholder ? placeholder : "Type a Question"}
          readOnly={!isEditable}
          onMouseDown={editableEventHandler}
          onBlur={() => {
            setIsEditable(false);
          }}
          onChange={changeHandler}
          onKeyDown={pageReloadingHandler}
          style={getStyle()}
          value={value}
        />
        <MdModeEditOutline
          className="editable-icon"
          onMouseDown={editableEventHandler}
        />
      </span>
    </div>
  );
};

export default EditableInput;

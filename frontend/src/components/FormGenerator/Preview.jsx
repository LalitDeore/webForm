import React from "react";
import "./GeneratedForm.css";
import { useFormContext } from "./FormContext";
import { IoIosCloseCircleOutline } from "react-icons/io";

const Preview = ({ closePreviewModal }) => {
  const { data, addFields } = useFormContext();

  const styles = {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    position: "absolute",
    color: "white",
    marginLeft: "530px",
  };

  return (
    <div className="generatedFormContainer">
      <form>
        <div className="registration-form-title">
          <button style={styles} onClick={closePreviewModal}>
            <IoIosCloseCircleOutline />
          </button>
          <div className="title">
            <span className="main-title">{data.title}</span>
            <span className="main-subtitle">{data.subTitle}</span>
          </div>
        </div>
        {addFields.map((field, index) => (
          <div key={index}>
            <div className="fieldName">
              <span
                style={{
                  fontWeight: field.isBold ? "bold" : "normal",
                  fontStyle: field.isItalic ? "italic" : "normal",
                  textDecoration: field.isUnderline ? "underline" : "normal",
                }}
              >
                {field.value}
              </span>
              <span>
                {field.isRequired && <span className="is-required">{"*"}</span>}
              </span>
            </div>
            {field.isFile ? (
              <div key={`file-${index}`}>
                <input
                  className="file-input"
                  type="file"
                  name="file"
                  {...(field.isRequired && { required: true })}
                  readOnly
                />
              </div>
            ) : field.isMultipleOption ? (
              <div
                className="options-checkbox-group"
                key={`checkbox-group-${index}`}
              >
                {field.options.map((option, optionIndex) => (
                  <div className="option-box" key={optionIndex}>
                    <input
                      type="checkbox"
                      id={`checkbox-${index}-${optionIndex}`}
                      className="checkboxOptions"
                      readOnly
                    />
                    <label
                      htmlFor={`checkbox-${index}-${optionIndex}`}
                      className="checkbox-label"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <input
                className="input-bar"
                type="text"
                required={field.isRequired}
                key={`text-${index}`}
                readOnly
              />
            )}
          </div>
        ))}
      </form>
    </div>
  );
};

export default Preview;

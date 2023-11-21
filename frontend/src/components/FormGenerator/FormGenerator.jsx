import React, { useState } from "react";
import "./FormGenerator.css";
import { AiFillDelete } from "react-icons/ai";
import EditableInput from "./EditableInput";
import { useFormContext } from "./FormContext";
import axios from "axios";
import EditableInputText from "./EditableInputText";
import Modal from "react-modal";
import Preview from "./Preview";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormGenerator = () => {
  const { addFields, setAddFields, formURL, setFormURL, data } =
    useFormContext();

  const [text, setText] = useState("");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const styleOfSection = {
    borderBottom: "1px solid grey",
    color: "white",
    fontSize: "30px",
  };
  const styleOfSubTitle = {
    borderBottom: "1px solid grey",
    color: "white",
    fontSize: "18px",
    marginTop: "15px",
    marginBottom: "10px",
  };
  const addFieldEventHandler = (event) => {
    event.preventDefault();
    let n = addFields.length;
    const newField = {
      id: n,
      value: "",
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isRequired: false,
      isFile: false,
      isMultipleOption: false,
      options: [],
    };

    const newArray = [...addFields, newField];
    setAddFields(newArray);
  };

  const deleteEventHandler = (event, index) => {
    event.preventDefault();
    const updatedFields = addFields.filter((_, i) => i !== index);
    setAddFields(updatedFields);
  };

  const generateFormURL = async () => {
    console.log({ formStructure: addFields, data: data });
    try {
      const response = await axios.post(
        "https://webform-te9r.onrender.com/forms/generate",
        {
          formStructure: addFields,
          data: data,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = response.data;
      setFormURL(responseData.uniqueIdentifier);
    } catch (error) {
      console.error("Error sending data to the backend:", error);
    }
  };

  const boldEventHandler = (event, id) => {
    event.preventDefault();
    setAddFields((prevFields) => {
      return prevFields.map((field) =>
        field.id === id ? { ...field, isBold: !field.isBold } : field
      );
    });
  };

  const italicEventHandler = (event, id) => {
    event.preventDefault();
    setAddFields((prevFields) => {
      return prevFields.map((field) =>
        field.id === id ? { ...field, isItalic: !field.isItalic } : field
      );
    });
  };

  const underlineEventHandler = (event, id) => {
    event.preventDefault();
    setAddFields((prevFields) => {
      return prevFields.map((field) =>
        field.id === id ? { ...field, isUnderline: !field.isUnderline } : field
      );
    });
  };

  const handleCheckboxChange = (event, id) => {
    const isChecked = event.target.checked;
    setAddFields((prevFields) => {
      return prevFields.map((field) =>
        field.id === id ? { ...field, isRequired: isChecked } : field
      );
    });
  };

  const handleCheckFileChange = (event, id) => {
    const isChecked = event.target.checked;
    setAddFields((prevFields) => {
      const updatedFields = prevFields.map((field) =>
        field.id === id ? { ...field, isFile: isChecked } : field
      );

      if (isChecked) {
        return updatedFields.map((field) => ({
          ...field,
          isMultipleOption: false,
          options: [],
        }));
      }

      return updatedFields;
    });
  };

  const copy = async () => {
    const updatedText = `https://web-form-git-main-lalits-projects-8efafb24.vercel.app/forms/${formURL}`;
    await navigator.clipboard.writeText(updatedText);
    setText(updatedText);
    toast.success("URL copied!", { position: toast.POSITION.TOP_RIGHT });
  };

  const openPreviewModal = async (e) => {
    e.preventDefault();
    setIsPreviewModalOpen(true);
  };
  const closePreviewModal = (e) => {
    e.preventDefault();
    setIsPreviewModalOpen(false);
  };

  const addOption = (e, index) => {
    e.preventDefault();
    setAddFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index] = {
        ...updatedFields[index],
        options: [...updatedFields[index].options, ""],
      };
      return updatedFields;
    });
  };

  const handleOptionChange = (e, index, optionIndex) => {
    e.preventDefault();
    setAddFields((prevFields) =>
      prevFields.map((field) =>
        field.id === index
          ? {
              ...field,
              options: field.options.map((option, i) =>
                i === optionIndex ? e.target.value : option
              ),
            }
          : field
      )
    );
  };
  const handleMultipleOptionChange = (event, id) => {
    const isChecked = event.target.checked;
    setAddFields((prevFields) => {
      const updatedFields = prevFields.map((field) =>
        field.id === id ? { ...field, isMultipleOption: isChecked } : field
      );
      if (isChecked) {
        return updatedFields.map((field) => ({
          ...field,
          options:
            field.isMultipleOption && field.options.length === 0
              ? [""]
              : field.options,
          isFile: false,
        }));
      }

      return updatedFields;
    });
  };
  console.log(addFields);
  const deleteOption = (event, index, optionIndex) => {
    event.preventDefault();
    setAddFields((prevFields) =>
      prevFields.map((field) =>
        field.id === index
          ? {
              ...field,
              options: field.options.filter((_, i) => i !== optionIndex),
            }
          : field
      )
    );
  };
  return (
    <div className="whole-form">
      <div className="registration-form">
        <form className="whole-registration-form">
          <div className="registration-form-title">
            <div className="title">
              <EditableInput
                value={data.title}
                style={{ fontSize: "20px" }}
                fieldKey="title"
                styleOfSection={styleOfSection}
                placeholder="Title"
              />
              <EditableInput
                value={data.subTitle}
                style={{ fontSize: "20px" }}
                fieldKey="subTitle"
                styleOfSection={styleOfSubTitle}
                placeholder="Subtitle"
              />
            </div>
          </div>

          <div className="all-added-fields">
            {addFields.map((arrayData, index) => {
              return (
                <div className="added-field-box" key={arrayData.id}>
                  <div className="field-box">
                    <div className="icons-container">
                      <EditableInput
                        isBold={addFields[index].isBold}
                        isItalic={addFields[index].isItalic}
                        isUnderline={addFields[index].isUnderline}
                        index={index}
                      />
                      <button
                        onClick={(event) => {
                          deleteEventHandler(event, index);
                        }}
                        className="delete-button"
                      >
                        <AiFillDelete className="delete-icon" />
                      </button>
                    </div>
                    <div className="box">
                      <EditableInputText
                        isBold={addFields[index].isBold}
                        isItalic={addFields[index].isItalic}
                        isUnderline={addFields[index].isUnderline}
                        boldEventHandler={(event) => {
                          boldEventHandler(event, addFields[index].id);
                        }}
                        italicEventHandler={(event) => {
                          italicEventHandler(event, addFields[index].id);
                        }}
                        underlineEventHandler={(event) => {
                          underlineEventHandler(event, addFields[index].id);
                        }}
                      />
                      <div className="all-user-input">
                        <div className="switch" title="Mark field as Required">
                          <label className="switcher">
                            <input
                              type="checkbox"
                              id={`toggleSwitch-${arrayData.id}`}
                              checked={arrayData.isRequired}
                              onChange={(event) => {
                                handleCheckboxChange(event, arrayData.id);
                              }}
                            />
                            <label
                              htmlFor={`toggleSwitch-${arrayData.id}`}
                              className="slider round"
                            ></label>
                          </label>
                          <span className="require-text">Required</span>
                        </div>
                        <div
                          className="switch file-box "
                          title="Allow user to upload file"
                        >
                          <label className="switcher">
                            <input
                              type="checkbox"
                              id={`toggleSwitchFile-${arrayData.id}`}
                              checked={arrayData.isFile}
                              onChange={(event) => {
                                handleCheckFileChange(event, arrayData.id);
                              }}
                            />
                            <label
                              htmlFor={`toggleSwitchFile-${arrayData.id}`}
                              className="slider round"
                            ></label>
                          </label>
                          <span className="require-text">File</span>
                        </div>

                        <div
                          className="switch option-box"
                          title="Multiple Options"
                        >
                          <label className="switcher">
                            <input
                              type="checkbox"
                              id={`toggleSwitchOptions-${arrayData.id}`}
                              checked={arrayData.isMultipleOption}
                              onChange={(event) => {
                                handleMultipleOptionChange(event, arrayData.id);
                              }}
                            />
                            <label
                              htmlFor={`toggleSwitchOptions-${arrayData.id}`}
                              className="slider round"
                            ></label>
                          </label>
                          <div className="option-block">
                            <p className="require-text-1">Multiple Options</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {addFields[index].isMultipleOption ? (
                      <div className="multiple-options-block">
                        <label
                          style={{ marginTop: "10px", marginBottom: "10px" }}
                        >
                          Options:
                        </label>
                        {arrayData.options.map((option, optionIndex) => (
                          <div key={optionIndex}>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(e, index, optionIndex)
                              }
                              placeholder={`Option ${optionIndex + 1}`}
                              style={{ marginBottom: "5px" }}
                            />
                            <button
                              onClick={(event) =>
                                deleteOption(event, index, optionIndex)
                              }
                              className="delete-input-field"
                            >
                              <AiFillDelete className="delete-icon" />
                            </button>
                          </div>
                        ))}
                        <button
                          className="add-option-button"
                          onClick={(e) => addOption(e, index)}
                        >
                          Add Option
                        </button>
                      </div>
                    ) : (
                      <input className="readOnlyInput" readOnly />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="both-button">
            <button className="standard-button" onClick={addFieldEventHandler}>
              Add Fields
            </button>
            <div>
              <button className="preview-button" onClick={openPreviewModal}>
                Preview
              </button>
              <Modal
                isOpen={isPreviewModalOpen}
                onRequestClose={closePreviewModal}
                contentLabel="preview modal"
                className="modal-preview"
              >
                <div>
                  <Preview closePreviewModal={closePreviewModal} />
                </div>
              </Modal>
            </div>
            <button
              className="url-generator standard-button"
              type="button"
              onClick={generateFormURL}
            >
              Generate Form URL
            </button>
          </div>
        </form>
        {formURL && (
          <div className="url-and-button">
            <div>
              <p>Your form URL:</p>
              <a
                id="url"
                href={`/forms/${formURL}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {`https://web-form-git-main-lalits-projects-8efafb24.vercel.app/forms/${formURL}`}
              </a>
            </div>
            <button className="button" onClick={copy}>
              Copy url
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormGenerator;

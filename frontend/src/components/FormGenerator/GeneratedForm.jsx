import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./GeneratedForm.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./preview.css";

const GeneratedForm = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState([]);
  const [data, setData] = useState({
    title: "",
    subTitle: "",
  });
  const [file, setFile] = useState();
  const [userInput, setUserInput] = useState({});
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://43.205.114.60:3005/forms/${id}`);
        const responseData = await response.json();
        setFormData(responseData.formStructure || []);
        setData({
          title: responseData.data.title,
          subTitle: responseData.data.subTitle,
        });
      } catch (error) {
        console.error("Error fetching form data:", error);
        setFormData([]);
      }
    };

    fetchData();
  }, [id]);

  const handleFile = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleInputChange = (fieldId, value) => {
    setUserInput((prevInput) => ({
      ...prevInput,
      [fieldId]: value,
    }));
  };

  const renderField = (field, index) => {
    if (field.isMultipleOption) {
      return (
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
          {field.options.map((option, optionIndex) => (
            <div className="option-box" key={optionIndex}>
              <input
                type="checkbox"
                id={`checkbox-${index}-${optionIndex}`}
                onChange={(e) =>
                  handleInputChange(
                    `${field.id}-${optionIndex}`,
                    e.target.checked
                  )
                }
                checked={userInput[`${field.id}-${optionIndex}`] || false}
                className="checkboxOptions"
              />
              <p
                className="options"
                htmlFor={`checkbox-${index}-${optionIndex}`}
              >
                {option}
              </p>
            </div>
          ))}
        </div>
      );
    } else {
      return (
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
                onChange={handleFile}
                {...(field.isRequired && { required: true })}
              />
            </div>
          ) : (
            <input
              className="input-bar"
              type="text"
              required={field.isRequired}
              key={`text-${index}`}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              value={userInput[field.id] || ""}
            />
          )}
        </div>
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("file", file);

    try {
      const response = await fetch(
        `https://webform-te9r.onrender.com/forms/${id}`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      const responseText = await response.text();
      const responseData = JSON.parse(responseText);

      console.log(responseData);
      if (responseData.success) {
        setSubmissionSuccess(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    toast.success("Thank you for submitting the form!");
  };

  return (
    <div className="generatedFormContainer">
      <form onSubmit={handleSubmit}>
        <div className="registration-form-title">
          <div className="title">
            <span style={{ fontSize: "30px" }} className="main-title">
              {data.title}
            </span>
            <span style={{ fontSize: "18px" }} className="main-subtitle">
              {data.subTitle}
            </span>
          </div>
        </div>
        {formData.map((field, index) => renderField(field, index))}
        <button type="submit" className="standard-button">
          Submit
        </button>
        {submissionSuccess && (
          <div className="success-message">
            Thank you for submitting the form!
          </div>
        )}
      </form>
    </div>
  );
};

export default GeneratedForm;

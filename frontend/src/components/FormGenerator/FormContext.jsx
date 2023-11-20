import React, { createContext, useContext, useState } from "react";

const FormContext = createContext();

export function useFormContext() {
  return useContext(FormContext);
}

export default function FormProvider(props) {
  const [data, setData] = useState({
    title: "Registration Form",
    subTitle: "Fill out the form carefully for registration",
  });
  const [addFields, setAddFields] = useState([
    {
      id: 0,
      value: "",
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isRequired: false,
      isFile: false,
      isMultipleOption: false,
      options: [],
    },
  ]);

  const [formURL, setFormURL] = useState("");
  return (
    <FormContext.Provider
      value={{
        addFields,
        setAddFields,
        formURL,
        setFormURL,
        data,
        setData,
      }}
    >
      {props.children}
    </FormContext.Provider>
  );
}

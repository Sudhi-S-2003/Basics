import React, { createContext, useContext, useState, type ReactNode } from "react";

type InputConfig = {
  name: string;
  validate?: () => boolean;
};

type RegisteredInput = {
  name: string;
  validate?: () => boolean;
  value?: string;
};

type FormContextType = {
  inputs: RegisteredInput[];
  register: (config: InputConfig) => void;
  setValue: (name: string, value: string) => void;
  getValue: (name: string) => string | undefined;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [inputs, setInputs] = useState<RegisteredInput[]>([]);

  const register = ({ name, validate }: InputConfig) => {
    setInputs((prevInputs) => {
      if (prevInputs.some((input) => input.name === name)) {
        return prevInputs;
      }
      return [...prevInputs, { name, validate, value: "" }];
    });
  };

  const setValue = (name: string, value: string) => {
    setInputs((prevInputs) =>
      prevInputs.map((input) =>
        input.name === name ? { ...input, value } : input
      )
    );
  };

  const getValue = (name: string) => {
    return inputs.find((input) => input.name === name)?.value;
  };

  return React.createElement(
    FormContext.Provider,
    { value: { inputs, register, setValue, getValue } },
    children
  );
};

// Custom hook to consume the context easily
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

import type { ReactNode } from "react";
import FormBtn from "./FormBtn";
import { FormProvider, useFormContext } from "../../context/FormContext";

type FormProps = {
  children: ReactNode;
  onSubmit: (inputs: { [key: string]: string }) => void;
};

const Form = ({ children, onSubmit }: FormProps) => {
  const { inputs } = useFormContext();

  const handleSubmit = () => {
    // You could do validation here by checking inputs' validate methods
    // For simplicity, just collect values and pass to onSubmit
    const values: { [key: string]: string } = {};
    inputs.forEach((input) => {
      values[input.name] = input.value || "";
    });
    onSubmit(values);
  };

  return (
    <FormProvider>
      <>
        {children}
        <FormBtn handleSubmit={handleSubmit} />
      </>
    </FormProvider>
  );
};

export default Form;

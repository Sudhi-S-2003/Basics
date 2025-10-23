

type FormBtnProps = {
    handleSubmit: () => void;
};

const FormBtn = ({ handleSubmit }: FormBtnProps) => {
    return (
        <button onClick={handleSubmit}>
            Submit
        </button>
    );
};

export default FormBtn
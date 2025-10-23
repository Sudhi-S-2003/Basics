type TextInputProps = {
    placeholder: string;
    type?: "text" | "number" | "email" | "password";
};

const TextInput = ({ placeholder, type="text" }: TextInputProps) => {
    return (
        <input
            type={type}
            className="border border-slate-500 rounded-2xl px-3 py-1"
            placeholder={placeholder}
        />
    );
};

export default TextInput;

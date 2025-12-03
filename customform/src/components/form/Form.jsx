import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

const Form = ({ header = {}, content = {}, footer = {}, handleFormSubmit }) => {
    const { handleSubmit, control, reset, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false); // <-- loading state

    const onSubmit = async (data) => {
        setIsLoading(true); // start loading
        try {
            await handleFormSubmit(data); // wait for API call
            alert("Form submitted successfully!");
            reset(); // clear form
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to submit form. Please try again.");
        } finally {
            setIsLoading(false); // stop loading
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-slate-200"
        >
            {/* HEADER */}
            <div className={cn(
                "px-6 py-6 bg-gradient-to-r from-slate-50 to-slate-100 text-center border-b border-slate-200",
                header.headerClassName
            )}>
                <h1 className={cn("text-2xl font-semibold text-slate-700", header.headClassName)}>
                    {header?.head}
                </h1>
                <p className={cn("text-sm text-slate-500 mt-1", header.descriptionClassName)}>
                    {header?.description}
                </p>
            </div>

            {/* CONTENT */}
            <div className={cn("px-6 py-8 flex flex-col gap-10", content.contentClassName)}>
                {content.FieldContainers?.map((container, containerIndex) => (
                    <div key={containerIndex} className="flex flex-col gap-4">
                        {container.sectionHead && (
                            <div className="mb-2">
                                <h3 className="text-lg font-semibold text-slate-700">{container.sectionHead}</h3>
                                {container.sectionDescription && (
                                    <p className="text-sm text-slate-500">{container.sectionDescription}</p>
                                )}
                            </div>
                        )}
                        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", container.className)}>
                            {container.Fields?.map((Field, fieldIndex) => (
                                <div key={`${containerIndex}-${fieldIndex}`} className="flex flex-col gap-1">
                                    {Field.label && (
                                        <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                            {Field.label}
                                            {Field.required && <span className="text-red-500">*</span>}
                                        </label>
                                    )}
                                    <Controller
                                        name={Field.label}
                                        control={control}
                                        rules={{ required: Field.required ? `${Field.label} is required` : false }}
                                        render={({ field }) => (
                                            Field.type === "textarea" ? (
                                                <textarea
                                                    {...field}
                                                    placeholder={Field.placeholder}
                                                    className={cn(
                                                        "w-full px-4 py-3 bg-slate-50 border rounded-lg",
                                                        "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all",
                                                        "text-sm text-slate-700 placeholder-slate-400 shadow-sm",
                                                        Field.inputClassName,
                                                        errors[Field.label] && "border-red-500"
                                                    )}
                                                />
                                            ) : Field.type === "select" ? (
                                                <select
                                                    {...field}
                                                    className={cn(
                                                        "w-full px-4 py-3 bg-slate-50 border rounded-lg",
                                                        "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all",
                                                        "text-sm text-slate-700 shadow-sm",
                                                        Field.inputClassName,
                                                        errors[Field.label] && "border-red-500"
                                                    )}
                                                >
                                                    <option value="">Select {Field.label}</option>
                                                    {Field.options?.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    {...field}
                                                    type={Field.type || "text"}
                                                    placeholder={Field.placeholder}
                                                    className={cn(
                                                        "w-full px-4 py-3 bg-slate-50 border rounded-lg",
                                                        "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all",
                                                        "text-sm text-slate-700 placeholder-slate-400 shadow-sm",
                                                        Field.inputClassName,
                                                        errors[Field.label] && "border-red-500"
                                                    )}
                                                />
                                            )
                                        )}
                                    />
                                    {errors[Field.label] && (
                                        <span className="text-xs text-red-500">{errors[Field.label]?.message}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* SUBMIT BUTTON */}
            <div className="px-6 py-6 border-t border-slate-200 flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading} // disable while loading
                    className={cn(
                        "px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all",
                        isLoading && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {isLoading ? "Submitting..." : "Submit"} {/* show loading text */}
                </button>
            </div>

            {/* FOOTER */}
            {footer && (
                <div className={cn("px-6 py-4 bg-slate-50 text-center border-t border-slate-200", footer.FooterClassName)}>
                    {footer?.head && (
                        <h2 className={cn("text-lg font-medium text-slate-700", footer.headClassName)}>
                            {footer.head}
                        </h2>
                    )}
                    {footer?.description && (
                        <p className={cn("text-sm text-slate-500 mt-1", footer.descriptionClassName)}>
                            {footer.description}
                        </p>
                    )}
                    <p className="text-xs text-slate-400 mt-4">© {new Date().getFullYear()} — All rights reserved.</p>
                </div>
            )}
        </form>
    );
};

export default Form;

import Form from "./Form";

const FormContainer = () => {
    const header = {
        head: "New Form",
        headClassName: "text-blue-500",
        description: "Fill in all required information below",
        descriptionClassName: "text-slate-500",
    };

    const content = {
        contentClassName: "mt-4 flex flex-col gap-10",
        FieldContainers: [
            // SECTION 1 — BASIC INFORMATION
            {
                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                Fields: [
                    { label: "First Name", required: true, type: "text", placeholder: "Enter first name", inputClassName: "p-3" },
                    { label: "Last Name", required: true, type: "text", placeholder: "Enter last name", inputClassName: "p-3" },
                    { label: "Date of Birth", required: true, type: "date", placeholder: "", inputClassName: "p-3" },
                    { label: "Gender", required: true, type: "select", options: ["Male", "Female", "Other"], inputClassName: "p-3" },
                    { label: "National ID", required: true, type: "number", placeholder: "Enter ID number", inputClassName: "p-3" },
                ],
                sectionHead: "Basic Information",
                sectionDescription: "Provide your personal details including your identification."
            },

            // SECTION 2 — CONTACT INFORMATION
            {
                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                Fields: [
                    { label: "Email Address", required: true, type: "email", placeholder: "Enter email", inputClassName: "p-3" },
                    { label: "Phone Number", required: true, type: "number", placeholder: "Enter phone number", inputClassName: "p-3" },
                    { label: "Alternative Phone", required: false, type: "number", placeholder: "Enter alternative phone", inputClassName: "p-3" },
                    { label: "Website", required: false, type: "url", placeholder: "Enter website (optional)", inputClassName: "p-3" },
                    { label: "Preferred Contact Method", required: true, type: "select", options: ["Email", "Phone", "SMS"], inputClassName: "p-3" },
                ],
                sectionHead: "Contact Information",
                sectionDescription: "Provide your email, phone, and preferred method of contact."
            },

            // SECTION 3 — ADDRESS
            {
                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                Fields: [
                    { label: "Country", required: true, type: "text", placeholder: "Enter country", inputClassName: "p-3" },
                    { label: "City", required: true, type: "text", placeholder: "Enter city", inputClassName: "p-3" },
                    { label: "State", required: true, type: "text", placeholder: "Enter state", inputClassName: "p-3" },
                    { label: "ZIP Code", required: true, type: "number", placeholder: "Enter ZIP code", inputClassName: "p-3" },
                    { label: "Street Address", required: true, type: "text", placeholder: "Enter street address", inputClassName: "col-span-2 p-3" },
                ],
                sectionHead: "Address",
                sectionDescription: "Provide your current residential address."
            },

            // SECTION 4 — PROFESSIONAL DETAILS
            {
                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                Fields: [
                    { label: "Occupation", required: false, type: "text", placeholder: "Enter occupation", inputClassName: "p-3" },
                    { label: "Company", required: false, type: "text", placeholder: "Enter company name", inputClassName: "p-3" },
                    { label: "Experience (Years)", required: false, type: "number", placeholder: "Enter experience", inputClassName: "p-3" },
                    { label: "LinkedIn Profile", required: false, type: "text", placeholder: "Enter link", inputClassName: "p-3" },
                    { label: "Skills", required: false, type: "text", placeholder: "Comma-separated skills", inputClassName: "col-span-2 p-3" },
                    { label: "Bio / Notes", required: false, type: "textarea", placeholder: "Enter notes", inputClassName: "col-span-2 p-3 h-24" },
                ],
                sectionHead: "Professional Details",
                sectionDescription: "Provide information about your career, skills, and experience."
            },

            // SECTION 5 — ADDITIONAL INFORMATION
            {
                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                Fields: [
                    { label: "Hobbies", required: false, type: "text", placeholder: "Enter hobbies", inputClassName: "p-3" },
                    { label: "Languages Known", required: false, type: "text", placeholder: "Comma-separated languages", inputClassName: "p-3" },
                    { label: "Emergency Contact Name", required: false, type: "text", placeholder: "Enter name", inputClassName: "p-3" },
                    { label: "Emergency Contact Phone", required: false, type: "number", placeholder: "Enter phone number", inputClassName: "p-3" },
                    { label: "Subscribe to Newsletter", required: false, type: "checkbox", inputClassName: "col-span-2 p-3" },
                ],
                sectionHead: "Additional Information",
                sectionDescription: "Add any additional information or preferences."
            },
        ]
    };

    const footer = {
        head: "Thank you!",
        headClassName: "text-blue-500",
        description: "Please review your details before submitting.",
        descriptionClassName: "text-slate-500",
    };
    const handleFormSubmit = async (data) => {
        // simulate network/API delay
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay

        console.log("data", data);
        // here you could do an actual API call, e.g.:
        // await fetch("/api/submit", { method: "POST", body: JSON.stringify(data) });
    };

    return <Form header={header} content={content} footer={footer} handleFormSubmit={handleFormSubmit} />;
};

export default FormContainer;

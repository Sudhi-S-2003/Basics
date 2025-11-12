import { useState } from "react";
import Input from "./components/Input";
import TextArea from "./components/TextArea";
import Select from "./components/Select";
import Icon from "./components/Icon";
import Button from "./components/Button";
import SelectOption from "./SelectOption";
import Model from "./components/Model";
import InputConfig from "./config/inputConfig";

function Sidebar() {
    const [selectedOption, setSelectedOption] = useState(null);

    // ======= Define all options dynamically ======= //
    const formComponents = [
        {
            head: "Input",
            component: Input,
            componentProps: { type: "text", placeholder: "Enter text..." },
            value: "input",
            desc: "Select input and use type email, number, text. Default is text.",
        },
        {
            head: "Text Area",
            component: TextArea,
            componentProps: { placeholder: "Enter your text here..." },
            value: "textarea",
            desc: "Text area component for multi-line input.",
        },
        {
            head: "Select Box",
            component: Select,
            componentProps: {},
            value: "selectBox",
            desc: "Dropdown select component.",
        },
    ];

    const iconComponents = [
        {
            head: "User Icon",
            component: Icon,
            componentProps: { name: "User", size: 32, color: "blue" },
            value: "userIcon",
            desc: "Select the user icon",
        },
        {
            head: "Home Icon",
            component: Icon,
            componentProps: { name: "Home", size: 32, color: "green" },
            value: "homeIcon",
            desc: "Select the home icon",
        },
        {
            head: "Other Icon",
            component: Icon,
            componentProps: { name: "Other", size: 32, color: "green" },
            value: "Icon",
            desc: "Select the Other icons",
        },

    ];

    const buttonComponents = [
        {
            head: "Primary Button",
            component: Button,
            componentProps: { children: "Click Me", color: "blue", },
            value: "primaryButton",
            desc: "A primary button",
        },
        {
            head: "Secondary Button",
            component: Button,
            componentProps: { children: "Cancel", color: "gray" },
            value: "secondaryButton",
            desc: "A secondary button",
        },
    ];

    // ======= Helper function to render SelectOptions ======= //
    const renderOptions = (options) =>
        options.map((item) => (
            <SelectOption
                key={item.value}
                {...item}
                selected={selectedOption === item.value}
                onSelect={setSelectedOption}
            />
        ));

    return (
        <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Pick From Options</h2>

            <div className="mb-4">
                <h1 className="mb-2 font-semibold">1. Form Components</h1>
                {renderOptions(formComponents)}
            </div>

            <div className="mb-4">
                <h1 className="mb-2 font-semibold">2. Icons</h1>
                {renderOptions(iconComponents)}
            </div>

            <div className="mb-4">
                <h1 className="mb-2 font-semibold">3. Buttons</h1>

                {renderOptions(buttonComponents)}

            </div>
            <Model
                isOpen={selectedOption !== null}
                onClose={() => setSelectedOption(null)}
                head={`You selected ${selectedOption}`}
                component={<InputConfig />}
                desc={"please complete config"}

            />
        </div>
    );
}

export default Sidebar;

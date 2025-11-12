
const OpenModel = ({ setIsOpen }) => {
    return (
        <>
            {/* Open Modal Button */}

            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-colors"
            >
                Open Modal
            </button>
        </>
    )
}

export default OpenModel;
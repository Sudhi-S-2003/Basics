function Model({ isOpen, onClose, head, component, desc }) {
  return (
    <>
      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose} // Close when clicking outside
        >
          {/* Modal Box */}
          <div
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Header */}
            {head && <h3 className="text-xl font-bold mb-4">{head}</h3>}

            {/* Dynamic Component */}
            {component && <div className="mb-4">{component}</div>}

            {/* Description */}
            {desc && <p className="text-gray-600 mb-6">{desc}</p>}

            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Model;

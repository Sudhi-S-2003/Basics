function SelectOption({
  head,
  component: Component,
  desc,
  value,
  selected = false,
  onSelect = () => {},
  componentProps = {},
}) {
  return (
    <div
      onClick={() => onSelect(value)}
      className={`border p-4 rounded-md cursor-pointer transition-colors 
        ${selected ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-100 border-gray-300'}`}
    >
      {head && <h1 className="text-lg font-semibold mb-2">{head}</h1>}

      {/* Render the passed component with its props */}
      {Component && (
        <div className="mb-2">
          <Component {...componentProps} />
        </div>
      )}

      {desc && <p className="text-gray-600 text-sm">{desc}</p>}
    </div>
  );
}

export default SelectOption;

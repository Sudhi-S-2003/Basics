"use client";

import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Autocomplete, MenuItem, TextField } from "@mui/material";
import SearchableSelect from "./SearchableSelect";

/**
 * FormModal Props
 * @typedef {Object} FormModalProps
 * @property {string} [head]
 * @property {()=>void} [onClose]
 * @property {(data:any)=>void} [onSubmit]
 * @property {Field[]} [fields]
 * @property {Record<string,any>} [initialValue]
 * @property {string} [btnLabel]
 */

const FormModal = ({
  head = "Add",
  onClose = () => {},
  onSubmit = () => {},
  fields = [],
  initialValue = {},
  btnLabel = "Submit",
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ 
    defaultValues: initialValue,
    mode: "onSubmit"
  });

  // Reset defaults when props change
  useEffect(() => {
    const defaults = fields.reduce((acc, field) => {
      acc[field.name] =
        initialValue[field.name] ??
        (field.type === "checkbox" ? false : field.defaultValue ?? "");
      return acc;
    }, {});
    reset(defaults, { keepDefaultValues: true });
  }, [JSON.stringify(fields), JSON.stringify(initialValue), reset]);

  const renderField = (field, parentName = "") => {
    const fullName = parentName ? `${parentName}.${field.name}` : field.name;
    const registerOptions = {
      required: field.required && `${field.head} is required`,
      minLength:
        field.minLength &&
        ((v) => v?.length >= field.minLength || `${field.head} must be at least ${field.minLength} characters`),
      maxLength:
        field.maxLength &&
        ((v) => v?.length <= field.maxLength || `${field.head} must be at most ${field.maxLength} characters`),
      validate: field.validate,
    };

    // Get nested error using path
    const getNestedError = (errors, path) => {
      const keys = path.split('.');
      let error = errors;
      for (const key of keys) {
        if (!error) return undefined;
        error = error[key];
      }
      return error;
    };

    const fieldError = getNestedError(errors, fullName);

    switch (field.type) {
      case "text":
      case "number":
      case "email":
      case "date":
      case "time":
      case "datetime-local":
        return (
          <div key={fullName}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.head} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder || ""}
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-gray-300"
              {...register(fullName, registerOptions)}
            />
            {fieldError && <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>}
          </div>
        );

      case "textarea":
        return (
          <div key={fullName}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.head} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              rows={field.rows || 4}
              placeholder={field.placeholder || ""}
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-gray-300"
              {...register(fullName, registerOptions)}
            />
            {fieldError && <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>}
          </div>
        );

      case "select":
        return (
          <div key={fullName}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.head} {field.required && <span className="text-red-500">*</span>}
            </label>
            <Controller
              name={fullName}
              control={control}
              rules={registerOptions}
              render={({ field: ctrl }) => (
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={ctrl.value || ""}
                  onChange={ctrl.onChange}
                  error={!!fieldError}
                  helperText={fieldError?.message}
                >
                  <MenuItem value="">{field.optionHead || "Select..."}</MenuItem>
                  {(field.options || []).map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </div>
        );

      case "multi-select":
        return (
          <div key={fullName}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.head} {field.required && <span className="text-red-500">*</span>}
            </label>
            <Controller
              name={fullName}
              control={control}
              rules={registerOptions}
              render={({ field: ctrl }) => (
                <Autocomplete
                  multiple
                  options={field.options || []}
                  getOptionLabel={(opt) => opt.label || ""}
                  value={(field.options || []).filter((opt) =>
                    (ctrl.value || []).includes(opt.value)
                  )}
                  onChange={(_, selected) => ctrl.onChange(selected.map((opt) => opt.value))}
                  renderInput={(params) => <TextField {...params} size="small" />}
                />
              )}
            />
            {fieldError && <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>}
          </div>
        );

      case "checkbox":
        return (
          <div key={fullName} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={fullName}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              {...register(fullName, registerOptions)}
            />
            <label htmlFor={fullName} className="text-sm font-medium text-gray-700">
              {field.head} {field.required && <span className="text-red-500">*</span>}
            </label>
            {fieldError && <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>}
          </div>
        );

      case "file":
        return (
          <div key={fullName}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.head} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              multiple={field.multiple || false}
              accept={field.accept || "*"}
              {...register(fullName, registerOptions)}
            />
            {fieldError && <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>}
          </div>
        );

      case "searchable-select":
        return (
          <div key={fullName}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.head} {field.required && <span className="text-red-500">*</span>}
            </label>
            <Controller
              name={fullName}
              control={control}
              rules={registerOptions}
              render={({ field: ctrl }) => (
                <SearchableSelect
                  value={ctrl.value}
                  onSelect={(opt) => ctrl.onChange(opt._id)}
                  placeholder={field.placeholder}
                  allowCreate={field.allowCreate}
                  getOption={field.getOption}
                  createOption={field.createOption}
                  error={fieldError?.message}
                />
              )}
            />
          </div>
        );

      case "field-group":
        return (
          <FieldGroup
            key={fullName}
            field={field}
            control={control}
            register={register}
            parentName={parentName}
            renderField={renderField}
            errors={errors}
          />
        );

      default:
        return null;
    }
  };

  const submitHandler = (data) => {
    console.log("Form submitted:", data);
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-gray-800">{head}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          {fields.map((field) => renderField(field))}
          <button
            type="submit"
            className="bg-black text-white w-full py-2 rounded-md text-sm hover:bg-gray-800"
          >
            {btnLabel}
          </button>
        </form>
      </div>
    </div>
  );
};

/** FieldGroup for nested arrays */
const FieldGroup = ({ field, control, parentName, renderField, errors }) => {
  const name = parentName ? `${parentName}.${field.name}` : field.name;
  const { fields: items, append, remove } = useFieldArray({ 
    control, 
    name,
  });

  const handleAdd = () => {
    if (field.maxItems && items.length >= field.maxItems) {
      alert(`You can add a maximum of ${field.maxItems} ${field.itemLabel || "items"}.`);
      return;
    }
    append({});
  };

  // Get nested error for field group
  const getNestedError = (errors, path) => {
    const keys = path.split('.');
    let error = errors;
    for (const key of keys) {
      if (!error) return undefined;
      error = error[key];
    }
    return error;
  };

  const fieldError = getNestedError(errors, name);

  return (
    <div className="border p-3 rounded-md bg-gray-50 space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold">
          {field.head} {field.minItems && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          className="text-xs bg-black text-white px-2 py-1 rounded hover:bg-gray-800"
          onClick={handleAdd}
        >
          + Add {field.itemLabel || "Item"}
        </button>
      </div>

      {/* Hidden Controller for array validation */}
      <Controller
        name={name}
        control={control}
        rules={{
          validate: (value) => {
            if (field.minItems && (!value || value.length < field.minItems)) {
              return `Please add at least ${field.minItems} ${field.itemLabel || "item"}(s) to ${field.head}`;
            }
            if (field.maxItems && value && value.length > field.maxItems) {
              return `Maximum ${field.maxItems} ${field.itemLabel || "item"}(s) allowed in ${field.head}`;
            }
            return true;
          },
        }}
        render={() => null}
      />

      {items.length === 0 && (
        <div className="text-sm text-gray-500 italic py-2">
          No {field.itemLabel || "items"} added yet. Click "+ Add {field.itemLabel || "Item"}" to begin.
        </div>
      )}

      {items.map((item, i) => (
        <div key={item.id} className="border rounded-md p-3 bg-white relative">
          <button
            type="button"
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-bold"
            onClick={() => remove(i)}
            title="Remove"
          >
            ✕
          </button>
          <div className="space-y-3 pr-6">
            {(field.subFields || []).map((subField) =>
              renderField(subField, `${name}.${i}`)
            )}
          </div>
        </div>
      ))}

      {/* Show field group validation error */}
      {fieldError && fieldError.message && (
        <p className="text-red-500 text-xs mt-1 font-medium">{fieldError.message}</p>
      )}
    </div>
  );
};

export default FormModal;;
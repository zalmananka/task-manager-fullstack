import React from "react";

function InputField({ value, onChange, placeholder, className = "" }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border bg-white rounded px-2 py-1 focus:outline-none focus:ring ${className}`}
    />
  );
}

export default InputField;

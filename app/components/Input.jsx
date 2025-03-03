import React, { useId } from 'react'

const Input = React.forwardRef(function Input(
  { label, type = 'text', className = '', onChange, ...props },
  ref
) {
  // Use `useId` to ensure each input has a unique id in the form.
  const id = useId()

  return (
    <div className="w-full">
      {label && (
        <label className="inline-block mb-1 pl-1 text-white" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type={type}
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
        ref={ref}
        {...props}
        onChange={onChange}
        id={id}
      />
    </div>
  )
})

export default Input

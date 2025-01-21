import React, { useId, forwardRef } from 'react'

const Select = forwardRef(
  ({ options, label, value, onChange, className, ...props }, ref) => {
    const id = useId()

    // Helper function to get the text and ID
    const getOptionData = (option) => {
      if (
        typeof option === 'object' &&
        option !== null &&
        option.title &&
        option.$id
      ) {
        return { text: option.title, id: option.$id }
      } else if (typeof option === 'string') {
        return { text: option, id: option } // Handle string options as before
      }
      return { text: '', id: null } // Handle unexpected types
    }

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block mb-2 text-white">
            {label}
          </label>
        )}
        <select
          {...props}
          id={id}
          ref={ref}
          className={`px-3 py-2 rounded-lg outline-none duration-200 w-full ${className}`}
          value={value}
          onChange={onChange}
        >
          {options?.map((option) => {
            const optionData = getOptionData(option)
            return (
              <option key={optionData.id} value={optionData.id}>
                {' '}
                {/* Use ID as value */}
                {optionData.text} {/* Display text */}
              </option>
            )
          })}
        </select>
      </div>
    )
  }
)

export default Select

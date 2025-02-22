import React from 'react'

export default function Button({
  children,
  type = 'button',
  bgColor = 'bg-blue-600',
  textColor = 'text-white',
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={`px-4 py-2 ${bgColor} ${textColor} ${className}`}
      {...props}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

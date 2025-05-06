import React, { useEffect, useRef } from 'react';

export default function TextInput({
    type = 'text',
    className = '',
    isFocused = false,
    ...props
}) {
    const input = useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm ' +
                className
            }
            ref={input}
        />
    );
} 
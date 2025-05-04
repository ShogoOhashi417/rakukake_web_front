import React from 'react';

const PrimaryButton = ({ children, type = 'button', className = '', disabled, onClick }) => {
    return (
        <button
            type={type}
            className={
                `inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default PrimaryButton; 
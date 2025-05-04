import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div className="mt-6">
                <Link to="/" className="flex items-center gap-2">
                    <Wallet className="h-8 w-8 text-green-600" />
                    <span className="text-2xl font-bold text-green-800">楽家計</span>
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
} 
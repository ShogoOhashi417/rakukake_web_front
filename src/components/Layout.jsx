import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="py-6">
        {children}
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} 楽家計 - 家計簿アプリ</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 
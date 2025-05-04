import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">楽家計</Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:underline">ホーム</Link></li>
            <li><Link to="/dashboard" className="hover:underline">ダッシュボード</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 
import React from 'react';
import HelloWorld from '../components/HelloWorld';

const HomePage: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>My React App</h1>
      <HelloWorld name="React Developer" />
      <HelloWorld />
    </div>
  );
};

export default HomePage; 
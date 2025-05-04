import React from 'react';

interface HelloWorldProps {
  name?: string;
}

const HelloWorld: React.FC<HelloWorldProps> = ({ name = 'World' }) => {
  return (
    <div style={{
      padding: '20px',
      margin: '20px auto',
      maxWidth: '500px',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ color: '#333' }}>Hello, {name}!</h1>
      <p style={{ color: '#666' }}>Welcome to React</p>
    </div>
  );
};

export default HelloWorld; 
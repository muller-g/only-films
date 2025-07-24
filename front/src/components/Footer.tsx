import React from 'react';

const Footer: React.FC = () => {

  return (
    <footer className='bg-white text-black p-2 text-center'>
      <p>Criado e desenvolvido por <a className='text-indigo-600 hover:underline' href="https://github.com/muller-g" target='__blank'>Gabriel Müller</a> &copy; {new Date().getFullYear()}</p>
    </footer>
  );
};

export default Footer; 
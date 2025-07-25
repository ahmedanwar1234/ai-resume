import React from 'react';
import { Link, useNavigate } from 'react-router';
import { usePuterStore } from '../../lib/puter';

const Navbar = () => {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();       // log out the user
    navigate('/auth');         // redirect to login page
  };

  return (
    <nav className='navbar flex justify-between items-center p-4 bg-white shadow-md'>
      <Link to='/' className='text-2xl font-bold text-gradient'>
        RESUMIND
      </Link>

      <div className="flex items-center gap-4">
        <Link to='/upload' className='primary-button text-nowrap max-sm: w-fit'>
          Upload Resume
        </Link>
        
        <button
          onClick={handleLogout}
          className='bg-red-500 text-white px-4 py-2 rounded-2xl hover:bg-red-600 transition'
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

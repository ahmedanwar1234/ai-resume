import React from 'react';
import { Link, useNavigate } from 'react-router';
import { usePuterStore } from '../../lib/puter';

const Navbar = () => {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut(); // log out the user
    navigate('/auth'); // redirect to login page
  };

  return (
    <nav className='navbar flex  sm:flex-row justify-between  items-center p-4 bg-white shadow-md gap-4 sm:gap-0'>
      <Link to='/' className='text-2xl font-bold text-gradient'>
        RESUMIND
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <Link
          to='/upload'
          className='primary-button w-full sm:w-fit text-center'
        >
          Upload Resume
        </Link>

        <button
          onClick={handleLogout}
          className='bg-red-500 text-white px-4 py-2 rounded-2xl hover:bg-red-600 transition w-full sm:w-fit'
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

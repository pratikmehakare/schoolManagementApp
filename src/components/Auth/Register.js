import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../services/oprations/authAPI';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Common fields for registration
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('Student'); // Default role
  const [gender, setGender]     = useState('');
  const [dob, setDob]           = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(name, email, password, role, gender, dob, navigate));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row gap-6">
            {/* Left Column: Account Information */}
            <div className="flex flex-col flex-1 gap-4">
              <h3 className="text-xl font-semibold text-gray-700">Account Information</h3>
              <div className="flex flex-col">
                <label className="text-gray-700 text-sm">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 text-sm">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 text-sm">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 text-sm">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  required
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Right Column: Personal Information */}
            <div className="flex flex-col flex-1 gap-4">
              <h3 className="text-xl font-semibold text-gray-700">Personal Information</h3>
              <div className="flex flex-col">
                <label className="text-gray-700 text-sm">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 text-sm">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  required
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-800 transition duration-200"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-red-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

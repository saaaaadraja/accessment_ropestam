import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Sanitize user input before submitting
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sanitize email input to remove any malicious content
    const sanitizedEmail = DOMPurify.sanitize(email);

    // Basic email validation (optional but recommended)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(sanitizedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      // Send sanitized email to the server
      await axios.post('http://localhost:5000/api/auth/signup', { email: sanitizedEmail });
      navigate('/login');
    } catch (err) {
      setError('Error signing up');
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;

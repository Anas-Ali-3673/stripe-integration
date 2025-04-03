import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Reauth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get accountId from query params if available
  const accountId = new URLSearchParams(window.location.search).get(
    'accountId'
  );

  const handleReauthorize = async () => {
    if (!accountId) {
      setError(
        'Account ID is missing. Please start the onboarding process again.'
      );
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post(
        `http://localhost:3000/stripe/create-onboarding-link/${accountId}`
      );
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      setError('Failed to generate onboarding link. Please try again.');
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    navigate('/');
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-medium text-center text-gray-900 mb-2">
            Session Expired
          </h3>
          <p className="text-sm text-gray-500 text-center mb-6">
            Your onboarding session has expired or was interrupted. You'll need
            to continue the process to complete your account setup.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {accountId ? (
            <button
              onClick={handleReauthorize}
              disabled={loading}
              className={`w-full flex justify-center items-center px-4 py-3 rounded-md text-white font-medium 
                ${
                  loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } mb-3`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Continue Onboarding'
              )}
            </button>
          ) : null}

          <button
            onClick={handleStartOver}
            className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}

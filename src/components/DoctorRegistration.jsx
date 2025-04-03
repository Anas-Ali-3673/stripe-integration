import { useState } from 'react';
import axios from 'axios';

export default function DoctorRegistration() {
  const [doctorId, setDoctorId] = useState('');
  const [email, setEmail] = useState('');
  const [onboardingUrl, setOnboardingUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [emailError, setEmailError] = useState('');

  // Validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  // 1️⃣ Create a Connected Account
  const createConnectedAccount = async () => {
    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post(
        'http://localhost:5001/api/payments/create-connected-account',
        { email: email }
      );
      setDoctorId(res.data.id);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createOnboardingLink = async () => {
    if (!doctorId) return;

    setLoading(true);
    setError('');

    try {
      const res = await axios.post(
        `http://localhost:5001/api/payments/create-onboarding-link/${doctorId}`
      );
      setOnboardingUrl(res.data.url);

      // Save the doctorId to localStorage before redirecting
      localStorage.setItem('doctorAccountId', doctorId);

      // Redirect to the Stripe onboarding
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      setError('Failed to generate onboarding link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center">
          {[1, 2].map((number) => (
            <div key={number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step >= number
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}
              >
                {number}
              </div>
              {number < 2 && (
                <div
                  className={`w-20 h-1 mx-2 ${
                    step > 1 ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex">
          <div className="w-8 text-xs text-center mr-20">Create Account</div>
          <div className="w-8 text-xs text-center">Complete Onboarding</div>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Create your account
          </h3>
          <p className="text-gray-600 mb-6">
            First, we'll create your secure payment account that allows you to
            receive payments from patients.
          </p>

          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) validateEmail(e.target.value);
              }}
              className={`w-full px-3 py-2 border ${
                emailError ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="doctor@example.com"
              required
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}
          </div>

          {doctorId && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-green-700">
                  Account created successfully!
                </p>
              </div>
              <p className="mt-1 text-xs text-green-600">ID: {doctorId}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <button
            onClick={createConnectedAccount}
            disabled={loading}
            className={`w-full flex justify-center items-center px-4 py-3 rounded-md text-white font-medium 
              ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
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
                Creating...
              </>
            ) : (
              'Create  Account'
            )}
          </button>

          {doctorId && (
            <button
              onClick={() => setStep(2)}
              className="w-full mt-3 px-4 py-2 border border-blue-600 rounded-md text-blue-600 font-medium hover:bg-blue-50"
            >
              Continue to next step
            </button>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Complete your onboarding
          </h3>
          <p className="text-gray-600 mb-6">
            Now we'll help you complete your profile and set up your payment
            details through Stripe's secure platform.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500 mr-2 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-blue-800">
                  Important information
                </h4>
                <p className="mt-1 text-xs text-blue-700">
                  You will be redirected to Stripe to securely provide your
                  banking and tax information. This information is handled
                  directly by Stripe and not stored on our servers.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="font-medium text-sm text-gray-700 mb-1">
              Email Address
            </p>
            <div className="flex items-center p-2 bg-gray-50 border border-gray-200 rounded">
              <span className="text-gray-500 text-sm">{email}</span>
            </div>
          </div>

          <div className="mb-6">
            <p className="font-medium text-sm text-gray-700 mb-1">Account ID</p>
            <div className="flex items-center p-2 bg-gray-50 border border-gray-200 rounded">
              <span className="text-gray-500 text-sm font-mono">
                {doctorId}
              </span>
            </div>
          </div>

          <button
            onClick={createOnboardingLink}
            disabled={loading || !doctorId}
            className={`w-full flex justify-center items-center px-4 py-3 rounded-md text-white font-medium 
              ${
                loading || !doctorId
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
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
                Preparing...
              </>
            ) : (
              'Continue to Stripe Onboarding'
            )}
          </button>

          <button
            onClick={() => setStep(1)}
            className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-md text-gray-600 font-medium hover:bg-gray-50"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}

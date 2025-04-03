import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [accountDetails, setAccountDetails] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const urlAccountId = new URLSearchParams(window.location.search).get(
    'accountId'
  );
  const storedAccountId = localStorage.getItem('doctorAccountId');
  const accountId = urlAccountId || storedAccountId;

  useEffect(() => {
    if (!accountId) {
      setTimeout(() => {
        navigate('/');
      }, 2000);
      setLoading(false);
      setError('No account information found. Redirecting to home page...');
      return;
    }

    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/payments/account/${accountId}`
        );
        setAccountDetails(response.data);
      } catch (err) {
        console.error('Error fetching account details:', err);
        setError('Could not load account information');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, [accountId, navigate]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm leading-5 text-green-700">
              Onboarding completed successfully! Your provider account is now
              active.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900">
            Provider Dashboard
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account and view payment information
          </p>
        </div>

        {loading ? (
          <div className="p-6 flex justify-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
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
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : (
          <div className="divide-y divide-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Account Status
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Account ID
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {accountId || 'N/A'}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {accountDetails?.email || 'N/A'}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Payouts</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {accountDetails?.payoutsEnabled ? 'Enabled' : 'Pending'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="px-4 py-5 sm:p-6">
              <h4 className="text-base font-medium text-gray-900 mb-2">
                Payment Information
              </h4>
              <p className="text-sm text-gray-500">
                Manage your payment settings and view transaction history in the
                Stripe dashboard.
              </p>
              <div className="mt-5">
                <a
                  href="https://dashboard.stripe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Open Stripe Dashboard
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import DoctorRegistration from './DoctorRegistration';
import Dashboard from './Dashboard';
import Reauth from './Reauth';

const stripePromise = loadStripe(
  'pk_test_51Q2YD9P48n83iVZPxKfIpQydPw1Zibj5PBZfWVKl4X2vIjhSV6jDbjOhaWQlDhruUQX3uqSLqqxMV6N1r1XbOBOx00cqrvCEQL'
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-md py-4">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                <h1 className="text-xl font-bold text-gray-800">MedConnect</h1>
              </div>
              <div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Provider Portal
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4 md:p-8">
          <Routes>
            <Route
              path="/"
              element={
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6 bg-blue-600 text-white">
                    <h2 className="text-2xl font-bold">
                      Doctor Onboarding Portal
                    </h2>
                    <p className="mt-2 text-blue-100">
                      Complete your registration to start accepting payments
                    </p>
                  </div>
                  <DoctorRegistration />
                </div>
              }
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reauth" element={<Reauth />} />
          </Routes>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Powered by <span className="font-medium">Stripe</span> payment
              processing
            </p>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;

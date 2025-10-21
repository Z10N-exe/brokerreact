import { useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../utils/api';
import Card from '../components/Card';
import { ArrowDownRight, CheckCircle, AlertCircle } from 'lucide-react';

const Deposit = ({ user, setUser }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }

    try {
      const response = await userAPI.createDeposit(parseFloat(amount));
      
      if (response.data.transaction) {
        setMessage('Deposit request submitted successfully! It will be processed within 24 hours.');
        setAmount('');
        
        // Refresh user data
        const userResponse = await userAPI.getMe();
        if (userResponse.data.user) {
          setUser(userResponse.data.user);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create deposit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 2500, 5000];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-gray-500">
                  Dashboard
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <span className="text-gray-900 font-medium">Deposit</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Make a Deposit</h1>
          <p className="text-gray-600 mt-2">
            Add funds to your account to start trading
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Deposit Form */}
          <div className="lg:col-span-2">
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                )}

                {message && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    {message}
                  </div>
                )}

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                    Deposit Amount (USD)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="input-field pl-7"
                      placeholder="0.00"
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Amounts
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {quickAmounts.map((quickAmount) => (
                      <button
                        key={quickAmount}
                        type="button"
                        onClick={() => setAmount(quickAmount.toString())}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        ${quickAmount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ArrowDownRight className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Deposit Information
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Minimum deposit: $100</li>
                          <li>Maximum deposit: $50,000</li>
                          <li>Processing time: 24 hours</li>
                          <li>No fees for deposits</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Submit Deposit Request'}
                  </button>
                  <Link to="/dashboard" className="btn-secondary">
                    Cancel
                  </Link>
                </div>
              </form>
            </Card>
          </div>

          {/* Account Summary */}
          <div className="lg:col-span-1">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Balance</span>
                  <span className="font-semibold">
                    ${user.balance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Profit</span>
                  <span className="font-semibold text-green-600">
                    ${user.profit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Withdrawals</span>
                  <span className="font-semibold text-yellow-600">
                    ${user.withdrawalsPending.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Deposit Methods</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Bank Transfer
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Credit Card
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Cryptocurrency
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;

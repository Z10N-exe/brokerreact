import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../utils/api';
import Card from '../components/Card';
import { DollarSign, TrendingUp, Clock, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

const Dashboard = ({ user, setUser }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [userResponse, transactionsResponse] = await Promise.all([
        userAPI.getMe(),
        userAPI.getTransactions()
      ]);

      if (userResponse.data.user) {
        setUser(userResponse.data.user);
      }
      setTransactions(transactionsResponse.data.transactions || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownRight className="h-5 w-5 text-green-600" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-5 w-5 text-red-600" />;
      case 'profit':
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'adjustment':
        return <RefreshCw className="h-5 w-5 text-purple-600" />;
      default:
        return <DollarSign className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-gray-600 mt-2">
                Here's your trading dashboard overview
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Account Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(user.balance)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Profit</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(user.profit)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Withdrawals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(user.withdrawalsPending)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <RefreshCw className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {transactions.length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/deposit" className="card hover:shadow-lg transition-shadow duration-200">
            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-4">
                <ArrowDownRight className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Make a Deposit</h3>
              <p className="text-gray-600 text-sm">
                Add funds to your account to start trading
              </p>
            </div>
          </Link>

          <Link to="/withdraw" className="card hover:shadow-lg transition-shadow duration-200">
            <div className="text-center">
              <div className="p-3 bg-red-100 rounded-lg w-fit mx-auto mb-4">
                <ArrowUpRight className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Withdraw Funds</h3>
              <p className="text-gray-600 text-sm">
                Request a withdrawal from your account
              </p>
            </div>
          </Link>

          <Link to="/transactions" className="card hover:shadow-lg transition-shadow duration-200">
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">View Transactions</h3>
              <p className="text-gray-600 text-sm">
                See all your transaction history
              </p>
            </div>
          </Link>
        </div>

        {/* Recent Transactions */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            <Link to="/transactions" className="text-primary-600 hover:text-primary-700 font-medium">
              View all
            </Link>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No transactions yet</p>
              <p className="text-gray-400 text-sm">Start by making your first deposit</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.slice(0, 5).map((transaction) => (
                    <tr key={transaction._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTransactionIcon(transaction.type)}
                          <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                            {transaction.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

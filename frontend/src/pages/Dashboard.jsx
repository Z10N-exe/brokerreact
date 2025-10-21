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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-slate-300 mt-2">
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
          <div className="card-dark card-hover p-6 mobile-card">
            <div className="flex items-center">
              <div className="p-3 bg-green-600/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-300">Account Balance</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(user.balance)}
                </p>
              </div>
            </div>
          </div>

          <div className="card-dark card-hover p-6 mobile-card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-300">Total Profit</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(user.profit)}
                </p>
              </div>
            </div>
          </div>

          <div className="card-dark card-hover p-6 mobile-card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-600/20 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-300">Pending Withdrawals</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(user.withdrawalsPending)}
                </p>
              </div>
            </div>
          </div>

          <div className="card-dark card-hover p-6 mobile-card">
            <div className="flex items-center">
              <div className="p-3 bg-purple-600/20 rounded-lg">
                <RefreshCw className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-300">Total Transactions</p>
                <p className="text-2xl font-bold text-white">
                  {transactions.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/deposit" className="card-dark card-hover p-6 mobile-card">
            <div className="text-center">
              <div className="p-3 bg-green-600/20 rounded-lg w-fit mx-auto mb-4">
                <ArrowDownRight className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Make a Deposit</h3>
              <p className="text-slate-300 text-sm">
                Add funds to your account to start trading
              </p>
            </div>
          </Link>

          <Link to="/withdraw" className="card-dark card-hover p-6 mobile-card">
            <div className="text-center">
              <div className="p-3 bg-red-600/20 rounded-lg w-fit mx-auto mb-4">
                <ArrowUpRight className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Withdraw Funds</h3>
              <p className="text-slate-300 text-sm">
                Request a withdrawal from your account
              </p>
            </div>
          </Link>

          <Link to="/transactions" className="card-dark card-hover p-6 mobile-card">
            <div className="text-center">
              <div className="p-3 bg-blue-600/20 rounded-lg w-fit mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">View Transactions</h3>
              <p className="text-slate-300 text-sm">
                See all your transaction history
              </p>
            </div>
          </Link>
        </div>

        {/* Recent Transactions */}
        <div className="card-dark p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
            <Link to="/transactions" className="text-blue-400 hover:text-blue-300 font-medium">
              View all
            </Link>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <RefreshCw className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-300">No transactions yet</p>
              <p className="text-slate-400 text-sm">Start by making your first deposit</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-dark min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 5).map((transaction) => (
                    <tr key={transaction._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTransactionIcon(transaction.type)}
                          <span className="ml-2 text-sm font-medium text-white capitalize">
                            {transaction.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

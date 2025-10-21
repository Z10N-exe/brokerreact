import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { Users, DollarSign, TrendingUp, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Overview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBalance: 0,
    totalProfit: 0,
    pendingTransactions: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      const [usersResponse, transactionsResponse] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getPendingTransactions()
      ]);

      const users = usersResponse.data.users || [];
      const transactions = transactionsResponse.data.transactions || [];

      // Calculate stats
      const totalBalance = users.reduce((sum, user) => sum + (user.balance || 0), 0);
      const totalProfit = users.reduce((sum, user) => sum + (user.profit || 0), 0);

      setStats({
        totalUsers: users.length,
        totalBalance,
        totalProfit,
        pendingTransactions: transactions.length
      });

      setRecentTransactions(transactions.slice(0, 5));
    } catch (error) {
      console.error('Error fetching overview data:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome to the Aspire Secure Trade admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalBalance)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Profit</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalProfit)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingTransactions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Pending Transactions</h2>
          <a href="/deposits" className="text-primary-600 hover:text-primary-700 font-medium">
            View all
          </a>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No pending transactions</p>
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
                    User
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
                {recentTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {transaction.type === 'deposit' ? (
                          <ArrowDownRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-red-600" />
                        )}
                        <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.userId?.firstName} {transaction.userId?.lastName}
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
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="text-center">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Users</h3>
            <p className="text-gray-600 text-sm mb-4">
              View and manage all user accounts
            </p>
            <a href="/users" className="btn-primary">
              View Users
            </a>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-4">
              <ArrowDownRight className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Process Deposits</h3>
            <p className="text-gray-600 text-sm mb-4">
              Review and approve pending deposits
            </p>
            <a href="/deposits" className="btn-primary">
              View Deposits
            </a>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="p-3 bg-red-100 rounded-lg w-fit mx-auto mb-4">
              <ArrowUpRight className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Process Withdrawals</h3>
            <p className="text-gray-600 text-sm mb-4">
              Review and approve pending withdrawals
            </p>
            <a href="/withdrawals" className="btn-primary">
              View Withdrawals
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

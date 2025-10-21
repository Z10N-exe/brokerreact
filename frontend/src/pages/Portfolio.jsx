import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../utils/api';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCw,
  Eye,
  EyeOff,
  Plus,
  Send,
  Download
} from 'lucide-react';

const Portfolio = ({ user, setUser }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

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

  const getTotalValue = () => {
    return user.balance + user.profit;
  };

  const getProfitPercentage = () => {
    if (user.balance === 0) return 0;
    return ((user.profit / user.balance) * 100).toFixed(2);
  };

  const isProfitPositive = () => {
    return user.profit >= 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Portfolio</h1>
              <p className="text-slate-400 text-sm">Your trading overview</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-blue-100 text-sm">Total Balance</span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-blue-200 hover:text-white transition-colors"
              >
                {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
            
            <div className="mb-4">
              <div className="text-3xl font-bold mb-2">
                {showBalance ? formatCurrency(getTotalValue()) : '••••••'}
              </div>
              <div className={`flex items-center text-sm ${
                isProfitPositive() ? 'text-green-300' : 'text-red-300'
              }`}>
                {showBalance && (
                  <>
                    {isProfitPositive() ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {isProfitPositive() ? '+' : ''}{getProfitPercentage()}%
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-200">Available</span>
                <div className="font-semibold">
                  {showBalance ? formatCurrency(user.balance) : '••••••'}
                </div>
              </div>
              <div>
                <span className="text-blue-200">Profit</span>
                <div className={`font-semibold ${
                  isProfitPositive() ? 'text-green-300' : 'text-red-300'
                }`}>
                  {showBalance ? formatCurrency(user.profit) : '••••••'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Link to="/deposit" className="bg-slate-800 rounded-xl p-4 text-center hover:bg-slate-700 transition-colors">
            <div className="bg-green-600/20 rounded-lg p-3 w-fit mx-auto mb-2">
              <ArrowDownRight className="h-6 w-6 text-green-400" />
            </div>
            <span className="text-white text-sm font-medium">Deposit</span>
          </Link>

          <Link to="/withdraw" className="bg-slate-800 rounded-xl p-4 text-center hover:bg-slate-700 transition-colors">
            <div className="bg-red-600/20 rounded-lg p-3 w-fit mx-auto mb-2">
              <ArrowUpRight className="h-6 w-6 text-red-400" />
            </div>
            <span className="text-white text-sm font-medium">Withdraw</span>
          </Link>

          <Link to="/send" className="bg-slate-800 rounded-xl p-4 text-center hover:bg-slate-700 transition-colors">
            <div className="bg-blue-600/20 rounded-lg p-3 w-fit mx-auto mb-2">
              <Send className="h-6 w-6 text-blue-400" />
            </div>
            <span className="text-white text-sm font-medium">Send</span>
          </Link>

          <Link to="/transactions" className="bg-slate-800 rounded-xl p-4 text-center hover:bg-slate-700 transition-colors">
            <div className="bg-purple-600/20 rounded-lg p-3 w-fit mx-auto mb-2">
              <Download className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-white text-sm font-medium">History</span>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <Link to="/transactions" className="text-blue-400 hover:text-blue-300 text-sm">
              View all
            </Link>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-slate-700 rounded-full p-4 w-fit mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-300 mb-2">No transactions yet</p>
              <p className="text-slate-400 text-sm">Start by making your first deposit</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-b-0">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${
                      transaction.type === 'deposit' ? 'bg-green-600/20' :
                      transaction.type === 'withdrawal' ? 'bg-red-600/20' :
                      transaction.type === 'profit' ? 'bg-blue-600/20' : 'bg-purple-600/20'
                    }`}>
                      {transaction.type === 'deposit' ? (
                        <ArrowDownRight className="h-4 w-4 text-green-400" />
                      ) : transaction.type === 'withdrawal' ? (
                        <ArrowUpRight className="h-4 w-4 text-red-400" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium capitalize">
                        {transaction.type}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${
                      transaction.type === 'deposit' || transaction.type === 'profit' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'deposit' || transaction.type === 'profit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === 'approved' ? 'bg-green-600/20 text-green-400' :
                      transaction.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                      'bg-red-600/20 text-red-400'
                    }`}>
                      {transaction.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

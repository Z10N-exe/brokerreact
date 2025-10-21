import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell } from '../components/Table';
import { FileText, User, DollarSign, TrendingUp, Clock, RefreshCw } from 'lucide-react';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await adminAPI.getAuditLogs();
      setLogs(response.data.logs || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLogs();
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'approve_withdrawal':
      case 'approve_deposit':
        return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'reject_withdrawal':
      case 'reject_deposit':
        return <DollarSign className="h-4 w-4 text-red-600" />;
      case 'add_profit':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'adjust_balance':
        return <RefreshCw className="h-4 w-4 text-purple-600" />;
      case 'impersonate_user':
        return <User className="h-4 w-4 text-orange-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'approve_withdrawal':
      case 'approve_deposit':
        return 'text-green-600 bg-green-100';
      case 'reject_withdrawal':
      case 'reject_deposit':
        return 'text-red-600 bg-red-100';
      case 'add_profit':
        return 'text-blue-600 bg-blue-100';
      case 'adjust_balance':
        return 'text-purple-600 bg-purple-100';
      case 'impersonate_user':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatAction = (action) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 mt-1">Track all admin actions and system changes</p>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Actions</p>
              <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approvals</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter(l => l.action.includes('approve')).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejections</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter(l => l.action.includes('reject')).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Adjustments</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter(l => l.action.includes('adjust') || l.action.includes('profit')).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card">
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No audit logs found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableHeaderCell>Action</TableHeaderCell>
              <TableHeaderCell>Admin</TableHeaderCell>
              <TableHeaderCell>Target User</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Note</TableHeaderCell>
              <TableHeaderCell>Timestamp</TableHeaderCell>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell>
                    <div className="flex items-center">
                      {getActionIcon(log.action)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                        {formatAction(log.action)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-gray-900">
                      {log.adminName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {log.targetUser?.firstName} {log.targetUser?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {log.targetUser?.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(log.amount)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {log.note || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {new Date(log.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Logs;

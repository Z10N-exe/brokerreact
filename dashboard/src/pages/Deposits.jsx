import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell } from '../components/Table';
import Modal from '../components/Modal';
import { ArrowDownRight, CheckCircle, XCircle, Clock, User } from 'lucide-react';

const Deposits = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [note, setNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await adminAPI.getPendingTransactions();
      const deposits = (response.data.transactions || []).filter(t => t.type === 'deposit');
      setTransactions(deposits);
    } catch (error) {
      console.error('Error fetching deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (transaction, type) => {
    setSelectedTransaction(transaction);
    setActionType(type);
    setNote('');
    setShowActionModal(true);
  };

  const submitAction = async () => {
    setActionLoading(true);
    setMessage('');

    try {
      if (actionType === 'approve') {
        await adminAPI.approveDeposit(selectedTransaction._id, { note });
      } else {
        await adminAPI.rejectDeposit(selectedTransaction._id, { note });
      }
      
      setMessage(`${actionType === 'approve' ? 'Deposit approved' : 'Deposit rejected'} successfully`);
      setShowActionModal(false);
      fetchTransactions();
    } catch (error) {
      setMessage(`Failed to ${actionType} deposit`);
    } finally {
      setActionLoading(false);
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
        <h1 className="text-2xl font-bold text-gray-900">Deposit Management</h1>
        <p className="text-gray-600 mt-1">Review and approve pending deposits</p>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
          {message}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Deposits</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.filter(t => t.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(transactions.reduce((sum, t) => sum + t.amount, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unique Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(transactions.map(t => t.userId._id)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deposits Table */}
      <div className="card">
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <ArrowDownRight className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No pending deposits</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableHeaderCell>User</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.userId?.firstName} {transaction.userId?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{transaction.userId?.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {transaction.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAction(transaction, 'approve')}
                          className="btn-success text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(transaction, 'reject')}
                          className="btn-danger text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Action Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title={`${actionType === 'approve' ? 'Approve' : 'Reject'} Deposit`}
      >
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Transaction Details</h4>
            <div className="text-sm text-gray-600">
              <p><strong>User:</strong> {selectedTransaction?.userId?.firstName} {selectedTransaction?.userId?.lastName}</p>
              <p><strong>Amount:</strong> {formatCurrency(selectedTransaction?.amount)}</p>
              <p><strong>Date:</strong> {new Date(selectedTransaction?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input-field"
              rows="3"
              placeholder={`Reason for ${actionType}...`}
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={submitAction}
              disabled={actionLoading}
              className={`${actionType === 'approve' ? 'btn-success' : 'btn-danger'} disabled:opacity-50`}
            >
              {actionLoading ? 'Processing...' : `${actionType === 'approve' ? 'Approve' : 'Reject'} Deposit`}
            </button>
            <button
              onClick={() => setShowActionModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Deposits;

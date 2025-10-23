// src/components/admin/UserListPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, Trash2, Shield, Loader, AlertCircle, User, Mail } from 'lucide-react';

const USER_API_URL = '/api/users';

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all'); // all, admin, user
    const [deleting, setDeleting] = useState(null);
    const { token } = useAuth();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const { data } = await axios.get(USER_API_URL, config);
            setUsers(data);
            setFilteredUsers(data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    useEffect(() => {
        let result = users;

        // Filter by search term
        if (searchTerm) {
            result = result.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by role
        if (filterRole === 'admin') {
            result = result.filter(user => user.isAdmin);
        } else if (filterRole === 'user') {
            result = result.filter(user => !user.isAdmin);
        }

        setFilteredUsers(result);
    }, [searchTerm, filterRole, users]);

    const deleteHandler = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            try {
                setDeleting(id);
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                await axios.delete(`${USER_API_URL}/${id}`, config);
                fetchUsers();
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setDeleting(null);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 font-medium">Loading users...</p>
                </div>
            </div>
        );
    }

    const adminCount = users.filter(u => u.isAdmin).length;
    const userCount = users.filter(u => !u.isAdmin).length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
                            <p className="text-gray-600 mt-1">
                                Total users: <span className="font-semibold">{users.length}</span> (
                                <span className="text-purple-600">{adminCount} admin</span>, 
                                <span className="text-blue-600 ml-1">{userCount} customers</span>)
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Users size={32} className="text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg flex items-start space-x-3">
                        <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{users.length}</p>
                            </div>
                            <Users size={32} className="text-purple-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Customers</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{userCount}</p>
                            </div>
                            <User size={32} className="text-blue-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Administrators</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{adminCount}</p>
                            </div>
                            <Shield size={32} className="text-amber-600 opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Search</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Filter by Role */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Filter by Role</label>
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="all">All Users</option>
                                <option value="admin">Administrators Only</option>
                                <option value="user">Customers Only</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                {filteredUsers.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredUsers.map(user => (
                                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-white font-bold text-sm">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{user.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <Mail size={16} className="text-gray-400" />
                                                    <a 
                                                        href={`mailto:${user.email}`}
                                                        className="text-blue-600 hover:text-blue-700 hover:underline"
                                                    >
                                                        {user.email}
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.isAdmin ? (
                                                    <span className="inline-flex items-center space-x-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                                                        <Shield size={16} />
                                                        <span>Admin</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                                        Customer
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600 font-mono">{user._id.substring(0, 8)}...</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => deleteHandler(user._id, user.name)}
                                                    disabled={deleting === user._id}
                                                    className="inline-flex items-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {deleting === user._id ? (
                                                        <Loader size={16} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                    <span>{deleting === user._id ? 'Deleting' : 'Delete'}</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <Users size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {searchTerm ? 'No users found' : 'No users to display'}
                        </h3>
                        <p className="text-gray-600">
                            {searchTerm ? 'Try adjusting your search or filters' : 'There are no users matching your criteria'}
                        </p>
                    </div>
                )}

                {/* Results Summary */}
                {filteredUsers.length > 0 && (
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Showing <span className="font-semibold text-gray-900">{filteredUsers.length}</span> of <span className="font-semibold text-gray-900">{users.length}</span> users
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserListPage;
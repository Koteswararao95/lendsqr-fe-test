import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Avatar from '../components/Avatar';
import apiService from '../services/api';
import { User } from '../types/index';
import '../styles/pages/Users.scss';

const PAGE_SIZE = 10;

/**
 * Users Page Component
 */
const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async (searchQuery = search, selectedStatus = status, pageNum = 1) => {
    try {
      setIsLoading(true);
      setError('');
      const result = await apiService.fetchUsers(pageNum, PAGE_SIZE, searchQuery, selectedStatus);
      setUsers(result.data);
      setTotal(result.total);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(search, status, 1);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    fetchUsers(value, status, 1);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatus(value);
    fetchUsers(search, value, 1);
  };

  const handleViewDetails = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      fetchUsers(search, status, page - 1);
    }
  };

  const handleNextPage = () => {
    if (page * PAGE_SIZE < total) {
      fetchUsers(search, status, page + 1);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="users-page">
      <Header />

      <main className="users-content">
        <div className="users-container">
          <div className="users-header">
            <h1>Users</h1>
            <p className="users-subtitle">Manage all users in the system</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="users-filters">
            <div className="search-box">
              <input
                type="search"
                placeholder="Search by name, email, phone, or ID"
                value={search}
                onChange={handleSearch}
                aria-label="Search users"
              />
              <span className="search-icon">🔍</span>
            </div>

            <select
              value={status}
              onChange={handleStatusFilter}
              className="filter-select"
              aria-label="Filter by status"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
              <option value="Blacklisted">Blacklisted</option>
            </select>
          </div>

          {isLoading ? (
            <div className="loading">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="no-results">
              <p>No users found</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Date Joined</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} onClick={() => handleViewDetails(user.id)} className="user-row">
                        <td data-label="User">
                          <div className="user-cell">
                            <Avatar name={user.name} size="md" />
                            <div className="user-info">
                              <p className="user-name">{user.name}</p>
                              <p className="user-id">{user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td data-label="Email">
                          <p className="cell-text">{user.email}</p>
                        </td>
                        <td data-label="Phone">
                          <p className="cell-text">{user.phone}</p>
                        </td>
                        <td data-label="Date Joined">
                          <p className="cell-text">{user.dateJoined}</p>
                        </td>
                        <td data-label="Status">
                          <span className={`status-badge status-${user.status.toLowerCase()}`}>
                            {user.status}
                          </span>
                        </td>
                        <td data-label="Action">
                          <button
                            className="btn btn-view"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(user.id);
                            }}
                            aria-label={`View details for ${user.name}`}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <span className="pagination-info">
                  Showing {(page - 1) * PAGE_SIZE + 1} to{' '}
                  {Math.min(page * PAGE_SIZE, total)} of {total} results
                </span>

                <div className="pagination-controls">
                  <button
                    className="btn btn-pagination"
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    aria-label="Previous page"
                  >
                    ← Previous
                  </button>

                  <span className="page-number">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    className="btn btn-pagination"
                    onClick={handleNextPage}
                    disabled={page >= totalPages}
                    aria-label="Next page"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default UsersPage;

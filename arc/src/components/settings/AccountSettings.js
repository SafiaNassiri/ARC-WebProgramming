/** 
 * Allows the authenticated user to:
 *  - View their account email
 *  - Access password reset functionality (future feature)
 *  - Log out of their session
 *  - (Placeholder) Delete their account permanently
 * 
 * This component consumes the AuthContext via `useAuth`
 * to access the current user and authentication functions.
 */

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

// AccountSettings Component
// Renders the Account Settings panel for the authenticated user. Displays user information and options to manage account settings.
function AccountSettings() {
    const { user, logout } = useAuth();

    return (
        <div className="settings-panel">
            <h2>Account</h2>
            <p>Manage your account settings and password.</p>

            <form className="settings-form">
                <div className="form-group-grid">
                    <div className="form-group-grid-left">
                        <label htmlFor="email">Email</label>
                        <small>Your email address is not displayed publicly.</small>
                    </div>
                    <div className="form-group-grid-right">
                        <input
                            type="email"
                            id="email"
                            value={user?.email || ''}
                            readOnly
                            aria-label="User email"
                        />
                    </div>
                </div>

                <div className="form-group-grid">
                    <div className="form-group-grid-left">
                        <label>Password</label>
                        <small>Reset your password.</small>
                    </div>
                    <div className="form-group-grid-right">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            // TODO: Implement password reset modal or page
                        >
                            Change Password
                        </button>
                    </div>
                </div>
            </form>

            <div className="logout-section">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>

            <div className="danger-zone">
                <h3>Danger Zone</h3>
                <p>Permanently delete your account and all of its content.</p>
                <button
                    type="button"
                    className="btn btn-danger"
                    // TODO: Implement delete account functionality
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
}

export default AccountSettings;

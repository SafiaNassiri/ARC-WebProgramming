import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

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
                            value={user?.email || ""}
                            readOnly
                        />
                    </div>
                </div>

                <div className="form-group-grid">
                    <div className="form-group-grid-left">
                        <label>Password</label>
                        <small>Reset your password.</small>
                    </div>
                    <div className="form-group-grid-right">
                        <button type="button" className="btn btn-secondary">Change Password</button>
                    </div>
                </div>
            </form>

            <div className="logout-section">
                <button type="button" className="btn btn-secondary" onClick={logout}>
                    Logout
                </button>
            </div>

            <div className="danger-zone">
                <h3>Danger Zone</h3>
                <p>Permanently delete your account and all of its content.</p>
                <button type="button" className="btn btn-danger">Delete Account</button>
            </div>
        </div>
    );
}

export default AccountSettings;


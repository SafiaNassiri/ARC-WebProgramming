/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: December 2025
 * Functional account settings - change password, logout, delete account
 */

import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../utils/api";

function AccountSettings() {
  const { user, logout } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Password form state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

  // Delete confirmation
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage({ type: "", text: "" });

    // Validation
    if (passwords.newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "New password must be at least 6 characters",
      });
      setPasswordLoading(false);
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match" });
      setPasswordLoading(false);
      return;
    }

    try {
      await api.put("/auth/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      setPasswordMessage({
        type: "success",
        text: "Password changed successfully!",
      });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordMessage({ type: "", text: "" });
      }, 2000);
    } catch (err) {
      console.error("Error changing password:", err);
      const errorMsg = err.response?.data?.msg || "Failed to change password";
      setPasswordMessage({ type: "error", text: errorMsg });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      alert("Please type DELETE to confirm");
      return;
    }

    if (
      !window.confirm("This action cannot be undone. Are you absolutely sure?")
    ) {
      return;
    }

    setDeleteLoading(true);

    try {
      await api.delete("/auth/account");
      alert("Account deleted successfully");
      logout();
    } catch (err) {
      console.error("Error deleting account:", err);
      alert(err.response?.data?.msg || "Failed to delete account");
      setDeleteLoading(false);
    }
  };

  return (
    <div className="settings-panel">
      <h2>Account</h2>
      <p>Manage your account settings and password.</p>

      <div className="form-group-grid">
        <div className="form-group-grid-left">
          <label>Email</label>
          <small>Your email address is not displayed publicly.</small>
        </div>
        <div className="form-group-grid-right">
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            aria-label="User email"
            style={{ color: "var(--text-secondary)" }}
          />
        </div>
      </div>

      <div className="form-group-grid">
        <div className="form-group-grid-left">
          <label>Password</label>
          <small>Change your account password.</small>
        </div>
        <div className="form-group-grid-right">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            {showPasswordForm ? "Cancel" : "Change Password"}
          </button>
        </div>
      </div>

      {showPasswordForm && (
        <div className="password-change-form">
          {passwordMessage.text && (
            <div className={`message-banner ${passwordMessage.type}`}>
              {passwordMessage.text}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="settings-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    currentPassword: e.target.value,
                  })
                }
                disabled={passwordLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                disabled={passwordLoading}
                minLength={6}
                required
              />
              <small>At least 6 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
                disabled={passwordLoading}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={passwordLoading}
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div
        className="logout-section"
        style={{
          marginTop: "2rem",
          paddingTop: "2rem",
          borderTop: "1px solid var(--bg-tertiary)",
        }}
      >
        <h3>Session</h3>
        <p>Log out of your current session.</p>
        <button type="button" className="btn btn-secondary" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="danger-zone">
        <h3>Danger Zone</h3>
        <p>
          Permanently delete your account and all of its content. This action
          cannot be undone.
        </p>

        {!showDeleteConfirm ? (
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Account
          </button>
        ) : (
          <div className="delete-confirm-section">
            <p style={{ fontWeight: 600, color: "var(--accent-primary)" }}>
              Type <strong>DELETE</strong> to confirm account deletion:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              style={{
                padding: "0.75rem",
                borderRadius: "4px",
                border: "2px solid var(--accent-primary)",
                marginBottom: "1rem",
                width: "100%",
                maxWidth: "300px",
              }}
            />
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteAccount}
                disabled={deleteLoading || deleteConfirmText !== "DELETE"}
              >
                {deleteLoading ? "Deleting..." : "Confirm Delete"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText("");
                }}
                disabled={deleteLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountSettings;

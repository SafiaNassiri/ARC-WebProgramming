/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: December 2025
 * Functional profile settings - update username and bio
 */

import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../utils/api";

function ProfileSettings() {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Validation
    if (!username.trim()) {
      setMessage({ type: "error", text: "Username cannot be empty" });
      setLoading(false);
      return;
    }

    if (username.length < 3) {
      setMessage({
        type: "error",
        text: "Username must be at least 3 characters",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await api.put("/auth/profile", {
        username: username.trim(),
        bio: bio.trim(),
      });

      setMessage({ type: "success", text: "Profile updated successfully!" });

      // Reload page to update user data everywhere
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMsg = err.response?.data?.msg || "Failed to update profile";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUsername(user?.username || "");
    setBio(user?.bio || "");
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="settings-panel">
      <h2>Public Profile</h2>
      <p>This information will be displayed publicly on your profile.</p>

      {message.text && (
        <div className={`message-banner ${message.type}`}>{message.text}</div>
      )}

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="form-group-grid">
          <div className="form-group-grid-left">
            <label htmlFor="username">Username</label>
            <small>This is your unique display name.</small>
          </div>
          <div className="form-group-grid-right">
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              aria-label="Username"
              maxLength={30}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={loading}
            aria-label="User bio"
            placeholder="Tell us about yourself..."
            maxLength={200}
          />
          <small className="char-count">{bio.length}/200 characters</small>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileSettings;

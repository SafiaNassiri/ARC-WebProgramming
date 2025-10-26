/** 
 * Allows users to edit and manage information displayed
 * publicly on their A.R.C. (Archive. Record. Connect.) profile.
 * 
 * Features:
 *  - Edit username (public handle)
 *  - Edit bio / personal description
 *  - Save updated profile information
 * 
 * Future enhancements:
 *  - Add avatar upload support
 *  - Include character/game tags and social links
 */

import React from 'react';

// ProfileSettings Component
// Renders the Public Profile settings panel, allowing the user to customize their visible identity (username and bio).
function ProfileSettings() {
    // Handles profile form submission. Currently a placeholder — to be connected to backend API for updating user data.
    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement profile update API call
        console.log('Profile update submitted');
    };

    return (
        <div className="settings-panel">
            <h2>Public Profile</h2>
            <p>This information will be displayed publicly on your profile.</p>
            <form className="settings-form" onSubmit={handleSubmit}>
                <div className="form-group-grid">
                    <div className="form-group-grid-left">
                        <label htmlFor="username">Username</label>
                        <small>This is your unique @username.</small>
                    </div>
                    <div className="form-group-grid-right">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            defaultValue="YourGamerTag"
                            aria-label="Username"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        rows="4"
                        defaultValue="Lover of ARPGs and story-heavy games. Tracking my journey across all platforms."
                        aria-label="User bio"
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProfileSettings;

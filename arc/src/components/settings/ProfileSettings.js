import React from 'react';

function ProfileSettings() {
    return (
        <div className="settings-panel">
            <h2>Public Profile</h2>
            <p>This information will be displayed publicly on your profile.</p>

            <form className="settings-form">

                <div className="form-group-grid">
                    <div className="form-group-grid-left">
                        <label htmlFor="username">Username</label>
                        <small>This is your unique @username.</small>
                    </div>
                    <div className="form-group-grid-right">
                        <input type="text" id="username" defaultValue="YourGamerTag" />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea id="bio" rows="4" defaultValue="Lover of ARPGs and story-heavy games. Tracking my journey across all platforms."></textarea>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    );
}

export default ProfileSettings;
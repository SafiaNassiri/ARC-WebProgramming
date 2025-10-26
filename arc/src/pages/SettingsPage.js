/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: October 2025
 * Main settings page for the A.R.C. application.
 * Users can switch between Profile, Account, and Display settings.
 */

import React, { useState } from 'react';
import '../Styles/SettingsPage.css';

// Import individual settings components
import ProfileSettings from '../components/settings/ProfileSettings';
import AccountSettings from '../components/settings/AccountSettings';
import DisplaySettings from '../components/settings/DisplaySettings';

// SettingsPage Component
function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile'); // Default tab

    // Renders the content of the currently active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSettings />;
            case 'account':
                return <AccountSettings />;
            case 'display':
                return <DisplaySettings />;
            default:
                return <ProfileSettings />;
        }
    };

    return (
        <div className="settings-page">
            <h1>Settings</h1>

            <div className="settings-layout">
                <nav className="settings-sidebar">
                    <button
                        className={activeTab === 'profile' ? 'active' : ''}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </button>
                    <button
                        className={activeTab === 'account' ? 'active' : ''}
                        onClick={() => setActiveTab('account')}
                    >
                        Account
                    </button>
                    <button
                        className={activeTab === 'display' ? 'active' : ''}
                        onClick={() => setActiveTab('display')}
                    >
                        Display
                    </button>
                </nav>
                <main className="settings-content">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

export default SettingsPage;

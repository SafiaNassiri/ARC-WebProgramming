import React, { useState } from 'react';
import '../Styles/SettingsPage.css';

import ProfileSettings from '../components/settings/ProfileSettings';
import AccountSettings from '../components/settings/AccountSettings';
import DisplaySettings from '../components/settings/DisplaySettings';

function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');

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
        <div>
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
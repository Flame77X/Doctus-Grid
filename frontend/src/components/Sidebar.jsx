import React from 'react';

// Maps persona IDs to their specific color classes (if needed by JS, though mostly handling via active class)
const Sidebar = ({
    user,
    mobileMenuOpen,
    setMobileMenuOpen,
    AI_PERSONAS,
    activeBotId,
    setActiveBotId
}) => {
    // Map persona IDs to their color themes
    const getPersonaClass = (id) => {
        switch (id) {
            case 'scibot': return 'persona-cyan';
            case 'jokebot': return 'persona-fuchsia';
            case 'helper': return 'persona-emerald';
            case 'explorer': return 'persona-violet';
            default: return 'persona-cyan'; // Fallback
        }
    };

    const personaClass = getPersonaClass(activeBotId);

    return (
        <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className={`sidebar glass-sidebar w-80 ${personaClass}`}>

                {/* Header */}
                <div className="sidebar-header">
                    <div className="logo-section">
                        <div className="logo-icon">D</div>
                        <div className="logo-text">
                            <h1>Doctus</h1>
                            <p>Education OS</p>
                        </div>
                    </div>

                    <div className="profile-card">
                        <div className="profile-avatar">
                            {user?.name?.[0] || 'G'}
                        </div>
                        <div className="profile-info">
                            <h3>{user?.name || 'Guest'}</h3>
                            <p>{user?.subject || 'Student'} Track</p>
                        </div>
                    </div>
                </div>

                {/* Personas */}
                <div className="personas-section">
                    <label className="personas-label">AI Assistants</label>

                    {AI_PERSONAS.map((p) => {
                        const isActive = activeBotId === p.id;
                        const Icon = p.icon;

                        return (
                            <button
                                key={p.id}
                                onClick={() => { setActiveBotId(p.id); setMobileMenuOpen(false); }}
                                className={`persona-btn ${isActive ? 'active' : ''}`}
                            >
                                <div className="persona-icon">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="persona-info text-left">
                                    <h3>{p.name}</h3>
                                    <p>{p.role}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Mobile Close */}
                {mobileMenuOpen && (
                    <button onClick={() => setMobileMenuOpen(false)} className="absolute top-4 right-[-50px] md:hidden btn-header">
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export default Sidebar;

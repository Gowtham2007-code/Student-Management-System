import "./Sidebar.css";

function Sidebar({ activePage, setActivePage, admin, onLogout }) {
    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <div className="sidebar-icon">
                    🎓
                </div>

                <div>
                    <h2>Student MS</h2>
                    <span>Admin Panel</span>
                </div>
            </div>

            <nav className="sidebar-nav">

                <button
                    className={
                        activePage === "dashboard"
                            ? "nav-item active"
                            : "nav-item"
                    }
                    onClick={() =>
                        setActivePage("dashboard")
                    }
                >
                    <span>📊</span>
                    Dashboard
                </button>

                <button
                    className={
                        activePage === "students"
                            ? "nav-item active"
                            : "nav-item"
                    }
                    onClick={() =>
                        setActivePage("students")
                    }
                >
                    <span>👨‍🎓</span>
                    Students
                </button>

            </nav>

            <div className="sidebar-bottom">

                <div className="sidebar-admin">

                    <div className="admin-avatar">
                        {admin?.username
                            ?.charAt(0)
                            .toUpperCase()}
                    </div>

                    <div>
                        <strong>
                            {admin?.username}
                        </strong>

                        <span>
                            Administrator
                        </span>
                    </div>

                </div>

                <button
                    className="sidebar-logout"
                    onClick={onLogout}
                >
                    🚪 Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;
import { NavLink } from "react-router-dom";
import {
  Cloud,
  LayoutDashboard,
  Heart,
  History,
  Coins,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">
          <Cloud size={24} />
        </div>

        <span>WeatherFlow</span>
      </div>

      <div className="sidebar-menu">
        <p className="menu-title">MENU</p>

        <NavLink to="/" className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/favorites" className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }>
          <Heart size={18} />
          <span>Favorites</span>
        </NavLink>

        <NavLink to="/history" className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }>
          <History size={18} />
          <span>History</span>
        </NavLink>

        <NavLink to="/crypto" className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }>
          <Coins size={18} />
          <span>Crypto</span>
        </NavLink>
      </div>
    </aside>
  );
}
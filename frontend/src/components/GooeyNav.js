import { NavLink } from 'react-router-dom';
import './SimpleNav.css';

const SimpleNav = ({ items = [] }) => {
  return (
    <div className="simple-nav">
      <nav>
        <ul>
          {items.map(item => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) => isActive ? 'simple-nav-link active' : 'simple-nav-link'}
                end={item.href === '/'}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SimpleNav;

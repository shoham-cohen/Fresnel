import { NavLink } from 'react-router';

import { navItems } from '@/routes/paths';

import styles from './Navbar.module.css';
import { RealityToggle } from './RealityToggle';
import { UserBadge } from './UserBadge';

export interface NavbarProps {
  /** Signed-in user's display name. Defaults to a placeholder until auth exists. */
  userName?: string;
}

/** App header. Figma: "מערכת שו״ב" › mainPage (132:52). */
export function Navbar({ userName }: NavbarProps) {
  return (
    <header className={styles.header}>
      <span className={styles.wordmark}>Palantir</span>

      <nav aria-label="ניווט ראשי">
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} end className={styles.navLink}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.end}>
        <RealityToggle />
        <UserBadge userName={userName} />
      </div>
    </header>
  );
}

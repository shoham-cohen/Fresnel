import userAvatarIcon from '@/assets/icons/user-avatar.svg';

import styles from './UserBadge.module.css';

// TODO: remove once the real name comes from Keycloak.
const DEFAULT_USER_NAME = 'שם משתמש';

export interface UserBadgeProps {
  userName?: string;
}

/** Avatar and name. Figma: carbon:user-avatar-filled-alt (146:67) + name (146:68). */
export function UserBadge({ userName = DEFAULT_USER_NAME }: UserBadgeProps) {
  return (
    <div className={styles.badge}>
      <img src={userAvatarIcon} alt="" width={45} height={45} />
      <span className={styles.name}>{userName}</span>
    </div>
  );
}

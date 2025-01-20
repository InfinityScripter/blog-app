import React from 'react';
import styles from './UserInfo.module.scss';

export const UserInfo = ({ avatarUrl, name, user, additionalText }) => {
  // Handle both direct name prop and nested user.name
  const userName = name || (user && user.name) || 'Unknown User';
  const userAvatarUrl = avatarUrl || (user && user.avatarUrl) || '/noavatar.png';

  return (
    <div className={styles.root}>
      <img className={styles.avatar} src={userAvatarUrl} alt={userName} />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{userName}</span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};

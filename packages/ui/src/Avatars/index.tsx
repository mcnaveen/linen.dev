import React from 'react';
import Avatar, { Size } from '../Avatar';
import styles from './index.module.scss';
import classNames from 'classnames';

interface AvatarType {
  src?: string | null;
  text?: string | null;
}

interface Props {
  users: AvatarType[];
  size?: Size;
  Image?: any;
  placeholder?: boolean;
}

export default function Avatars({ users, size, Image, placeholder }: Props) {
  const avatars = users.slice(0, 2);
  if (avatars.length === 0) {
    return <></>;
  }
  return (
    <div className={styles.group}>
      {avatars.map((user, index) => (
        <div key={`${user.text}-${index}`} className={styles.item}>
          <Avatar
            key={`${index}-avatar`}
            text={user.text}
            src={user.src}
            size={size}
            Image={Image}
            placeholder={placeholder}
          />
        </div>
      ))}
      {users.length > 2 && (
        <div className={styles.item}>
          <div
            className={classNames(styles.placeholder, size && styles[size])}
          >{`+${users.length - 2}`}</div>
        </div>
      )}
    </div>
  );
}

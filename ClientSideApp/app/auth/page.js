import React from 'react';
import styles from '../styles/AuthPortal.module.css'; // Import CSS module for styling

const AuthPortal = () => {
  return (
    <div className={styles.container}>
      <div className={styles.authBox}>
        <h2>Welcome to our Tennis Court Booking Portal</h2>
        <div className={styles.authOptions}>
          <button className={styles.loginButton}>Login</button>
          <button className={styles.signupButton}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default AuthPortal;
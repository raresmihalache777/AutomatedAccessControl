// components/LoadingOverlay.js
import React from 'react';
import styles from './LoadingOverlay.module.css';

const LoadingOverlay = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
      <h1 className={styles.loadingText}>Loading...</h1>
    </div>
  );
};

export default LoadingOverlay;
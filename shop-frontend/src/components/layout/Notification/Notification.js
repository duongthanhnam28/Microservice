// src/components/Notification.js - Beautiful notification system
import React, { useState, useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': 
      default: return 'ℹ️';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`notification ${type} ${isLeaving ? 'leaving' : ''}`}>
      <div className="notification-content">
        <span className="notification-icon">{getIcon()}</span>
        <span className="notification-message">{message}</span>
        <button 
          className="notification-close"
          onClick={() => {
            setIsLeaving(true);
            setTimeout(() => {
              setIsVisible(false);
              if (onClose) onClose();
            }, 300);
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Notification Manager
class NotificationManager {
  constructor() {
    this.notifications = [];
    this.listeners = [];
  }

  add(message, type = 'info', duration = 3000) {
    const notification = {
      id: Date.now() + Math.random(),
      message,
      type,
      duration
    };

    this.notifications.push(notification);
    this.notify();

    // Auto remove after duration + animation time
    setTimeout(() => {
      this.remove(notification.id);
    }, duration + 500);

    return notification.id;
  }

  remove(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notify();
  }

  clear() {
    this.notifications = [];
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  // Convenience methods
  success(message, duration) {
    return this.add(message, 'success', duration);
  }

  error(message, duration) {
    return this.add(message, 'error', duration);
  }

  warning(message, duration) {
    return this.add(message, 'warning', duration);
  }

  info(message, duration) {
    return this.add(message, 'info', duration);
  }
}

// Global instance
export const notificationManager = new NotificationManager();

// Container component
export const NotificationContainer = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => notificationManager.remove(notification.id)}
        />
      ))}
    </div>
  );
};

export default Notification;
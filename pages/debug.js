import React, { useState, useEffect } from 'react';
import Parse from '@/lib/parseConfig';

export default function DebugPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [localStorageData, setLocalStorageData] = useState({});
  const [parseUser, setParseUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get Parse current user
    const user = Parse.User.current();
    console.log('Parse.User.current():', user);
    setParseUser(user);

    // Get localStorage data
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('currentUser');
      const role = localStorage.getItem('role');
      const name = localStorage.getItem('name');
      const email = localStorage.getItem('email');
      const phone = localStorage.getItem('phone');

      console.log('LocalStorage data:', { userData, role, name, email, phone });

      setLocalStorageData({
        currentUser: userData ? JSON.parse(userData) : null,
        role: role,
        name: name,
        email: email,
        phone: phone
      });
    }

    setLoading(false);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Page</h1>

      <h2>Parse Current User</h2>
      <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
        {parseUser ? JSON.stringify(parseUser, null, 2) : 'No Parse user found'}
      </pre>

      <h2>Parse User Attributes</h2>
      {parseUser ? (
        <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          <p>ID: {parseUser.id}</p>
          <p>Email: {parseUser.get('email')}</p>
          <p>Phone: {parseUser.get('phone')}</p>
          <p>Name: {parseUser.get('name')}</p>
          <p>Role: {parseUser.get('role') || 'patient'}</p>
          <p>Username: {parseUser.get('username')}</p>
        </div>
      ) : (
        <p>No Parse user logged in</p>
      )}

      <h2>LocalStorage Data</h2>
      <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
        {JSON.stringify(localStorageData, null, 2)}
      </pre>

      <h2>Parse Configuration</h2>
      <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
        <p>App ID: {Parse.applicationId}</p>
        <p>Server URL: {Parse.serverURL}</p>
      </div>

      <h2>Instructions</h2>
      <ol>
        <li>Try signing up first (go to /signup)</li>
        <li>Then try logging in (go to home / or /login)</li>
        <li>After login, visit this page (/debug) to see if user data is stored</li>
        <li>Check browser console (F12) for detailed login logs</li>
      </ol>

      <h2>Test Actions</h2>
      <button
        onClick={() => {
          console.log('Parse.User.current():', Parse.User.current());
          console.log('LocalStorage:', window.localStorage);
        }}
        style={{
          padding: '10px 20px',
          margin: '5px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Log to Console
      </button>

      <button
        onClick={() => {
          localStorage.clear();
          location.reload();
        }}
        style={{
          padding: '10px 20px',
          margin: '5px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Clear & Reload
      </button>
    </div>
  );
}

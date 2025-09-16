import React from 'react';
import { getServerUser } from '../../lib/serverUser';

export default async function ProfilePage() {
  const user = await getServerUser();

  return (
    <div style={{ padding: 24 }}>
      <h1>Profile</h1>
      {user ? (
        <div>
          <p><strong>{user.username || user.id}</strong></p>
          <p>ID: {user.id}</p>
          <p>Email: {user.email || '—'}</p>
          <p>Admin: {user.isAdmin ? 'yes' : 'no'}</p>
          {user.isAdmin && (
            <div style={{ marginTop: 16, padding: 12, border: '1px solid #ccc' }}>
              <h3>Admin area</h3>
              <p>Only visible to admins.</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>You are not signed in.</p>
          <a href="/login">Sign in</a>
        </div>
      )}
    </div>
  );
}

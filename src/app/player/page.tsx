"use client";

import React, { useEffect, useState } from "react";

type User = {
  id: string;
  username: string;
  avatar?: string;
  discriminator?: string;
};

export default function PlayerPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Demo: load sample JSON that would be created after Discord OAuth
    fetch("/data/users/sample.json")
      .then((r) => {
        if (!r.ok) throw new Error("no sample user");
        return r.json();
      })
      .then((u) => setUser(u))
      .catch(() => {});
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Panel Gracza (Discord)</h1>
      {!user ? (
        <div>
          <p>Nie zalogowano.</p>
          <button onClick={() => alert("Stub: open Discord OAuth flow (configure client id/secret)")}>Zaloguj przez Discord</button>
        </div>
      ) : (
        <div>
          <h2>{user.username}#{user.discriminator}</h2>
          {user.avatar && <img src={user.avatar} alt="avatar" width={80} />}
          <p>ID: {user.id}</p>
        </div>
      )}
    </main>
  );
}

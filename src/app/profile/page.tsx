import React from 'react';

const ProfilePage = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1>Profile Page</h1>
        <nav>
          <a href="/home" style={{ marginRight: '10px' }}>Home</a>
          <a href="/settings">Settings</a>
        </nav>
      </header>
      <main>
        <section style={{ marginBottom: '20px' }}>
          <h2>User Information</h2>
          <p>Name: John Doe</p>
          <p>Email: john.doe@example.com</p>
        </section>
        <section>
          <h2>Activity</h2>
          <p>Recent activity will be displayed here.</p>
        </section>
      </main>
      <footer style={{ marginTop: '20px' }}>
        <p>&copy; 2025 Your Company</p>
      </footer>
    </div>
  );
};

export default ProfilePage;
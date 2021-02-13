import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import UserAuth from '../UserAuth';
import AppNav from './AppNav';
import logoImg from './logo192.png';

const AppHeaderTitle = () => {
  // const taglines = [
  //   <em>better together &#128149;</em>,
  //   <em>healthy relating &#128149;</em>,
  // ];
  // const randomTagline = taglines[Math.floor(Math.random() * taglines.length)];

  return (
    <h1 style={{ display: 'inline-block', marginBottom: 0 }}>
      <Link
        to="/"
        style={{
          color: 'inherit',
          textDecoration: 'inherit',
        }}
      >
        <span title="xBook">
          <img
            src={logoImg}
            alt="xBook logo"
            style={{ verticalAlign: 'bottom', height: '3rem' }}
          />
          <span className="ml-2">xBook</span>
        </span>
      </Link>
      <span className="text-muted ml-2 d-xs-none">
        <small style={{ fontSize: '50%', fontWeight: 300 }}>
          healthy community
        </small>
      </span>
    </h1>
  );
};

const AppHeader = ({ user, login, logout }) => (
  <header>
    <Card>
      <Card.Body>
        <AppHeaderTitle />
        <div style={{ float: 'right' }}>
          <UserAuth login={login} logout={logout} />
        </div>
      </Card.Body>
    </Card>
    {user && (
      <Card className="mt-1">
        <Card.Body
          style={{
            paddingBottom: '0.25rem',
            paddingTop: '0.25rem',
          }}
        >
          <AppNav />
        </Card.Body>
      </Card>
    )}
  </header>
);

export default AppHeader;

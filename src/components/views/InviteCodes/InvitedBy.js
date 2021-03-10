import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import { AppContext } from '../../AppProvider';

const InvitedBy = () => {
  const { user, users } = useContext(AppContext);
  return (
    <Card className="mt-3">
      <Card.Body>
        <Card.Title>Invited By You</Card.Title>
        <div>
          <small className="text-muted">
            (used one of your invite codes to register)
          </small>
        </div>
        {users &&
          Object.values(users)
            .filter((u) => u.invitedBy === user.uid)
            .map((user) => <div>{user.displayName}</div>)}
      </Card.Body>
    </Card>
  );
};
export default InvitedBy;

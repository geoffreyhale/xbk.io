import React, { useContext, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Card from 'react-bootstrap/Card';
import Jumbotron from 'react-bootstrap/Jumbotron';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Tooltip from 'react-bootstrap/Tooltip';
import { AppContext } from '../../AppProvider';
import { setModalityVote } from '../../../api';
import MODALITIES from './MODALITIES';

export const availableModalities = Object.entries(MODALITIES)
  .filter(([key, MODALITY]) => MODALITY.available)
  .map(([key, MODALITY]) => {
    const modality = MODALITY;
    modality.key = key;
    return modality;
  })
  .sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { ignorePunctuation: true })
  );

export const validModalityForRoom = ({ modalityKey, room }) => {
  const MODALITY = MODALITIES[modalityKey];
  if (!MODALITY) {
    return false;
  }
  if (MODALITY.room !== room) {
    return false;
  }
  return true;
};

const PreSelectDescription = (
  <p>Select a modality that you'd like to learn about or practice.</p>
);

const WriteDescription = () => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <>
      <p>You have selected a modality that you'd like to learn and practice.</p>
      {collapsed ? (
        <p>
          <span
            onClick={() => setCollapsed(false)}
            style={{ fontWeight: 600, cursor: 'pointer' }}
          >
            See More
          </span>
        </p>
      ) : (
        <>
          <p>Read the description below.</p>
          <p>Then, write and submit a post.</p>
          <p>
            Other users will provide feedback and vote on your proficiency in
            the modality
          </p>
          <p>
            You get real practice, real feedback, and earn proficiency points in
            the modality. Proficiency points can be used to determine
            eligibility for safer, deeper relating rooms.
          </p>
        </>
      )}
    </>
  );
};

const VoteDescription = (
  <>
    <p>
      Ultimately, we want you to <strong>vote</strong> on whether this user's
      post is a successful attempt at this, their selected modality. In this
      way, you get to learn, train, and determine together whether your
      community meets your standards for healthy relating.
    </p>
    <p>
      After voting, don't forget to join the conversation by replying to the
      post. If the user failed to meet your standards for the modality, help
      them; let's get better together!
    </p>
  </>
);

export const SelectModality = ({ room }) => {
  const { modality, setModality } = useContext(AppContext);
  const arrayOfAvailableModalities = Object.entries(MODALITIES)
    .filter(([key, MODALITY]) => MODALITY.available && MODALITY.room === room)
    .sort(
      ([aKey, a], [bKey, b]) =>
        a.title &&
        b.title &&
        a.title.localeCompare(b.title, undefined, { ignorePunctuation: true })
    );

  if (!arrayOfAvailableModalities || !arrayOfAvailableModalities.length > 0) {
    return null;
  }

  return (
    <DropdownButton
      id="dropdown-basic-button"
      title={modality ? MODALITIES[modality].title : 'Select Modality'}
      variant={modality ? 'warning' : 'outline-warning'}
    >
      {arrayOfAvailableModalities.map(([key, MODALITY]) => (
        <Dropdown.Item
          as="div" //"button" would trigger onSubmit
          onClick={() => setModality(modality === key ? null : key)}
        >
          {MODALITY.title}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

const ModalityDescription = () => {
  const { modality: modalityKey } = useContext(AppContext);
  const modality = MODALITIES[modalityKey];

  if (!modality) return null;

  return (
    <>
      <h3>{modality.title}</h3>
      {modality.description}
    </>
  );
};

export const Modality = ({ room }) => {
  const { modality: modalityKey, setModality } = useContext(AppContext);
  const modality = MODALITIES[modalityKey];

  const roomsWithAvailableModalities = Object.values(MODALITIES)
    .filter((MODALITY) => MODALITY.available === true)
    .map((MODALITY) => MODALITY.room);
  if (!roomsWithAvailableModalities.includes(room)) return null;

  return (
    <>
      <Card>
        <Card.Header>Modality Trainer</Card.Header>
        <Card.Body>
          {!modality && (
            <Card bg="light" className="mb-3">
              <Card.Body>{PreSelectDescription}</Card.Body>
            </Card>
          )}
          <SelectModality room={room} />
          {modality && (
            <Jumbotron className="mt-3">
              <WriteDescription />
            </Jumbotron>
          )}
          <ModalityDescription />
        </Card.Body>
      </Card>
    </>
  );
};

const ModalityVotingButton = ({ modalityVotes, value, children, postId }) => {
  const {
    user: { isPremium, uid },
  } = useContext(AppContext);
  const isCurrentVote = modalityVotes && modalityVotes[uid] === value;
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip>Premium Feature</Tooltip>}
    >
      <Button
        variant={isCurrentVote ? 'warning' : 'outline-warning'}
        onClick={() =>
          setModalityVote({
            postId,
            uid,
            vote: isCurrentVote ? null : value,
          })
        }
        disabled={isPremium !== true}
      >
        {children}
        <Badge variant="secondary" className="ml-2">
          {modalityVotes
            ? Object.values(modalityVotes).filter((vote) => vote === value)
                .length
            : 0}
        </Badge>
      </Button>
    </OverlayTrigger>
  );
};

export const ModalityVotingBooth = ({ modality, postId }) => {
  if (!MODALITIES[modality.name]) {
    return null;
  }
  const { title, description } = MODALITIES[modality.name];

  return (
    <ButtonGroup>
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={
          <Popover>
            <Popover.Title as={'h3'}>What is {title}?</Popover.Title>
            <Popover.Content>
              {description}
              {VoteDescription}
            </Popover.Content>
          </Popover>
        }
      >
        <Button variant="warning">{title}</Button>
      </OverlayTrigger>
      <ModalityVotingButton
        modalityVotes={modality.votes}
        value={true}
        postId={postId}
      >
        yes
      </ModalityVotingButton>
      <ModalityVotingButton
        modalityVotes={modality.votes}
        value={false}
        postId={postId}
      >
        not quite
      </ModalityVotingButton>
    </ButtonGroup>
  );
};

export default Modality;

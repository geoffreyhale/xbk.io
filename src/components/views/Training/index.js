import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { postsRef } from '../../../api';
import { AppContext } from '../../AppProvider';
import Spinner from '../../shared/Spinner';
import { UserPhoto } from '../../shared/User';
import { availableModalities } from '../../shared/Modalities';
import MODALITIES from '../../shared/Modalities/MODALITIES';
import PostsFeed from '../../shared/PostsFeed';
import { PremiumFeature } from '../../shared/Premium';
import NewTopLevelPostCard from '../Posts/NewTopLevelPostCard';

//TODO add feed of modality posts that user has not voted on

const UserModalityScoreCardInline = ({
  loadingPosts,
  uid,
  userModalityPostsCount,
  userModalityYesCount,
  userModalityNoCount,
}) => (
  <span
    className="user-modality float-right"
    style={{ display: 'inline-flex' }}
  >
    <span className="ml-4">
      <div style={{ textAlign: 'center' }}>
        {loadingPosts ? <Spinner size="sm" /> : userModalityPostsCount}
      </div>
    </span>
    <span className="ml-4">
      <div style={{ textAlign: 'center' }}>
        {loadingPosts ? (
          <Spinner size="sm" />
        ) : (
          `${userModalityYesCount}` // (${userModalityYesPercentage}%)`
        )}
      </div>
    </span>
    <span className="ml-4">
      <div style={{ textAlign: 'center' }}>
        {loadingPosts ? (
          <Spinner size="sm" />
        ) : (
          `${userModalityNoCount}` // (${userModalityNoPercentage}%)`
        )}
      </div>
    </span>
  </span>
);

const UserModalityScoreCard = ({
  loadingPosts,
  uid,
  userModalityPostsCount,
  userModalityYesCount,
  userModalityNoCount,
}) => (
  <ListGroup horizontal className="user-modality">
    <ListGroup.Item>
      <UserPhoto uid={uid} />
    </ListGroup.Item>
    <ListGroup.Item>
      <div>
        <strong>Posts</strong>
      </div>
      <div style={{ textAlign: 'center' }}>
        {loadingPosts ? <Spinner size="sm" /> : userModalityPostsCount}
      </div>
    </ListGroup.Item>
    <ListGroup.Item>
      <div>
        <strong>Yes</strong>
      </div>
      <div style={{ textAlign: 'center' }}>
        {loadingPosts ? (
          <Spinner size="sm" />
        ) : (
          `${userModalityYesCount}` // (${userModalityYesPercentage}%)`
        )}
      </div>
    </ListGroup.Item>
    <ListGroup.Item>
      <div>
        <strong>No</strong>
      </div>
      <div style={{ textAlign: 'center' }}>
        {loadingPosts ? (
          <Spinner size="sm" />
        ) : (
          `${userModalityNoCount}` // (${userModalityNoPercentage}%)`
        )}
      </div>
    </ListGroup.Item>
  </ListGroup>
);

const postsWithModalityArrayFromPostsArray = ({
  posts = [],
  modalityKey = null,
}) =>
  posts.filter(
    (post) =>
      post.modalities && Object.keys(post.modalities).includes(modalityKey)
  );

//TODO add tests
const userModalityPostsData = ({ posts, modalityKey, uid }) => {
  const userModalityPostsCount =
    posts && typeof posts === 'object' && Object.keys(posts).length;

  const { yesCount: userModalityYesCount, noCount: userModalityNoCount } =
    posts && typeof posts === 'object'
      ? Object.values(posts).reduce(
          (acc, post) => {
            return {
              yesCount:
                acc.yesCount +
                (post.modalities &&
                post.modalities[modalityKey] &&
                post.modalities[modalityKey].votes
                  ? Object.entries(post.modalities[modalityKey].votes).filter(
                      ([key, vote]) => key !== uid && vote === true
                    ).length
                  : 0),
              noCount:
                acc.noCount +
                (post.modalities &&
                post.modalities[modalityKey] &&
                post.modalities[modalityKey].votes
                  ? Object.entries(post.modalities[modalityKey].votes).filter(
                      ([key, vote]) => key !== uid && vote === false
                    ).length
                  : 0),
            };
          },
          { yesCount: 0, noCount: 0 }
        )
      : {};

  // const userModalityVoteCount = userModalityYesCount + userModalityNoCount;
  // const userModalityYesPercentage = Math.round(
  //   (userModalityYesCount / userModalityVoteCount) * 100
  // );
  // const userModalityNoPercentage = Math.round(
  //   (userModalityNoCount / userModalityVoteCount) * 100
  // );

  return { userModalityPostsCount, userModalityYesCount, userModalityNoCount };
};

const UserModality = ({ loadingPosts, uid, userStatsForModality, render }) => {
  const { userModalityPostsCount, userModalityYesCount, userModalityNoCount } =
    userStatsForModality || {};

  return render({
    loadingPosts,
    uid,
    userModalityPostsCount,
    userModalityYesCount,
    userModalityNoCount,
  });
};

const sortAlphanumerical = (a, b) =>
  a.title.localeCompare(b.title, undefined, { ignorePunctuation: true });
const sortPostsCount = (a, b) =>
  b.userModalityPostsCount - a.userModalityPostsCount;
const sortYesVotes = (a, b) => b.userModalityYesCount - a.userModalityYesCount;
const sortNoVotes = (a, b) => b.userModalityNoCount - a.userModalityNoCount;

const ModalityMenu = ({ loadingPosts, uid, userStatsPerModality }) => {
  const { modality: contextModalityKey, setModality } = useContext(AppContext);
  const [sortFunction, setSortFunction] = useState(() => sortAlphanumerical);
  const history = useHistory();

  const modalitiesForMenu = availableModalities;
  modalitiesForMenu.forEach((modality, i) => {
    modalitiesForMenu[i] = Object.assign(
      modalitiesForMenu[i],
      userStatsPerModality[modality.key]
    );
  });

  return (
    <>
      <div>
        <strong>sort:</strong>
        <Button
          onClick={() => setSortFunction(() => sortAlphanumerical)}
          variant="link"
        >
          title
        </Button>
        <Button
          onClick={() => setSortFunction(() => sortPostsCount)}
          variant="link"
        >
          posts
        </Button>
        <Button
          onClick={() => setSortFunction(() => sortYesVotes)}
          variant="link"
        >
          yes
        </Button>
        <Button
          onClick={() => setSortFunction(() => sortNoVotes)}
          variant="link"
        >
          not quite
        </Button>
      </div>
      <ListGroup>
        {availableModalities.sort(sortFunction).map((modality) => (
          <ListGroup.Item
            key={modality.key}
            action
            active={contextModalityKey === modality.key}
            onClick={() => {
              const modalityToSet =
                contextModalityKey === modality.key ? null : modality.key;
              // setModality(modalityToSet);
              history.push(`/training/${modalityToSet}`);
            }}
          >
            {modality.title}
            <UserModality
              key={modality.key}
              userStatsForModality={userStatsPerModality[modality.key]}
              uid={uid}
              loadingPosts={loadingPosts}
              render={(props) => <UserModalityScoreCardInline {...props} />}
            />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

const Training = () => {
  const { user, users, modality: contextModalityKey, setModality } = useContext(
    AppContext
  );
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [posts, setPosts] = useState([]);
  const history = useHistory();
  const { modalityId } = useParams();

  /**
   * - navigating to url /training/:modalityId should bring up Training with modality selected
   * - selecting a modality from the side menu should change url and bring up Training with new modality selected
   * - selecting from the new post modality dropdown should change the modality but not change base page
   */
  useEffect(() => {
    if (modalityId) {
      setModality(modalityId);
    } else {
      setModality(null);
    }
  });

  useEffect(() => {
    postsRef().on('value', (snapshot) => {
      const posts = snapshot.val();
      const allPosts = Object.entries(posts).map(([id, post]) => {
        post.id = id;
        post.userDisplayName =
          users[post.userId] && users[post.userId].displayName;
        return post;
      });
      setPosts(allPosts);
      setLoadingPosts(false);
    });
  }, []);

  const modalityToShow =
    contextModalityKey &&
    MODALITIES[contextModalityKey] &&
    MODALITIES[contextModalityKey].available
      ? MODALITIES[contextModalityKey]
      : null;

  const userPosts = posts.filter((post) => post.userId === user.uid);
  const userPostsWithAnyModality = posts.filter(
    (post) => post.userId === user.uid && post.modalities
  );
  const userPostsWithThisModality = postsWithModalityArrayFromPostsArray({
    posts: userPostsWithAnyModality,
    modalityKey: contextModalityKey,
  });
  const postsWithThisModality = postsWithModalityArrayFromPostsArray({
    posts,
    modalityKey: contextModalityKey,
  }).sort((a, b) => {
    //TODO exclude votes for self
    //TODO make this modality vote count a method of post object
    const aYesVotes =
      a.modalities &&
      a.modalities[contextModalityKey] &&
      a.modalities[contextModalityKey].votes &&
      Object.values(a.modalities[contextModalityKey].votes).filter(
        (vote) => vote === true
      ).length;
    const bYesVotes =
      b.modalities &&
      b.modalities[contextModalityKey] &&
      b.modalities[contextModalityKey].votes &&
      Object.values(b.modalities[contextModalityKey].votes).filter(
        (vote) => vote === true
      ).length;
    if (!aYesVotes) {
      return 1;
    }
    if (!bYesVotes) {
      return -1;
    }
    return aYesVotes < bYesVotes ? 1 : -1;
  });

  const userStatsPerModality = {};
  availableModalities.forEach((modality) => {
    const modalityKey = modality.key;
    if (!userPosts || typeof userPosts !== 'object') {
      return null;
    }

    const posts = postsWithModalityArrayFromPostsArray({
      posts: userPosts,
      modalityKey,
    });

    const {
      userModalityPostsCount,
      userModalityYesCount,
      userModalityNoCount,
    } = userModalityPostsData({ posts, modalityKey, uid: user.uid }) || {};

    userStatsPerModality[modalityKey] = {
      userModalityPostsCount,
      userModalityYesCount,
      userModalityNoCount,
    };
  });

  return (
    <Card>
      <Card.Header>Training</Card.Header>
      <Card.Body>
        <Card.Title>Modalities</Card.Title>
        <Row>
          <Col sm={4} className="col-left mb-3">
            <ModalityMenu
              loadingPosts={loadingPosts}
              userStatsPerModality={userStatsPerModality}
              uid={user.uid}
            />
          </Col>
          <Col sm={8} className="col-main">
            {modalityToShow && (
              <>
                <h2>{modalityToShow.title}</h2>
                <div className="my-3">
                  <UserModality
                    key={'main' + contextModalityKey}
                    userStatsForModality={
                      userStatsPerModality[contextModalityKey]
                    }
                    loadingPosts={loadingPosts}
                    uid={user.uid}
                    render={(props) => <UserModalityScoreCard {...props} />}
                  />
                </div>
                <Tabs defaultActiveKey="description" className="mb-3">
                  <Tab eventKey="description" title="Description">
                    <div className="mb-3">{modalityToShow.description}</div>
                    <div className="mb-3">
                      <Card>
                        <Card.Body>
                          {user.isPremium ? (
                            <NewTopLevelPostCard
                              onSuccess={({ room }) =>
                                history.push(`/r/${room}`)
                              }
                              navigateOnModalitySelect={true}
                            />
                          ) : (
                            <PremiumFeature />
                          )}
                        </Card.Body>
                      </Card>
                    </div>
                  </Tab>
                  <Tab
                    eventKey="my-posts"
                    title={
                      <span>
                        My Posts
                        {loadingPosts ? (
                          <Spinner size="sm" />
                        ) : (
                          <Badge variant="secondary" className="ml-2">
                            {userPostsWithThisModality.length}
                          </Badge>
                        )}
                      </span>
                    }
                  >
                    <PostsFeed
                      posts={userPostsWithThisModality}
                      hackHideRepliesCount={true}
                    />
                  </Tab>
                  <Tab
                    eventKey="all-posts"
                    title={
                      <span>
                        Best Examples
                        {loadingPosts ? (
                          <Spinner size="sm" />
                        ) : (
                          <Badge variant="secondary" className="ml-2">
                            {postsWithThisModality.length}
                          </Badge>
                        )}
                      </span>
                    }
                  >
                    {user.isPremium ? (
                      <PostsFeed
                        posts={postsWithThisModality}
                        hackHideRepliesCount={true}
                      />
                    ) : (
                      <PremiumFeature />
                    )}
                  </Tab>
                </Tabs>
              </>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
export default Training;

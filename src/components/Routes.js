import React, { useContext } from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { AppContext } from './AppProvider';
import Page from './Page';
import About from './views/About';
import Admin from './views/Admin';
import Community from './views/Community';
import Donate from './views/Donate';
import Events from './views/Events';
import NewEvent from './views/Events/NewEvent';
import EventPage from './views/Events/EventPage';
import Chess from './views/Games/Chess';
import IncrementalClickerGame from './views/Games/IncrementalClicker';
import TicTacToe from './views/Games/TicTacToe';
import LandingPage from './views/LandingPage';
import Queues from './views/Queues';
import Rooms from './views/Rooms';
import Room from './views/Rooms/Room';
import Sandbox from './views/Sandbox';
import Scorekeeper from './views/Scorekeeper';
import Settings from './views/Settings';
import Training from './views/Training';
import UserProfile from './views/UserProfile';
import InviteCodes from './views/InviteCodes';
import PremiumPage from './views/Premium';
import LifeOptimizer from './views/Apps/LifeOptimizer';

const Routes = ({ login }) => {
  const { user } = useContext(AppContext);
  const history = useHistory();
  const location = useLocation();

  // redirect old post links to general post link
  if (location.pathname.startsWith('/posts/')) {
    history.push('/r/general' + location.pathname);
  }

  return (
    <Switch>
      {user && user.admin && (
        <Route
          path="/admin"
          key="/admin"
          render={(props) => (
            <Page title="Admin | xBook">
              <Admin {...props} />
            </Page>
          )}
        />
      )}
      {!user && (
        <Route
          exact
          path="/"
          key={location.pathname + 'landing'}
          render={(props) => (
            <Page title="xBook">
              <LandingPage login={login} {...props} />
            </Page>
          )}
        />
      )}
      <Route
        path="/events/:eventId"
        key={location.pathname}
        render={(props) => (
          <Page title="Event | xBook">
            <EventPage {...props} />
          </Page>
        )}
      />
      {user && [
        <Route
          exact
          path="/"
          key={location.pathname}
          render={(props) => (
            <Page title="xBook">
              <Room {...props} />
            </Page>
          )}
        />,
        <Route
          exact
          path="/r"
          key={location.pathname}
          render={(props) => (
            <Page title="Rooms | xBook">
              <Rooms {...props} />
            </Page>
          )}
        />,
        <Route
          path="/rooms"
          key={location.pathname}
          render={(props) => (
            <Page title="Rooms | xBook">
              <Rooms {...props} />
            </Page>
          )}
        />,
        <Route
          exact
          path="/r/:roomId"
          key={location.pathname}
          render={(props) => (
            <Page>
              <Room {...props} />
            </Page>
          )}
        />,
        //TODO should not need room path for viewing a post
        <Route
          path="/r/:roomId/posts/:postId"
          key={location.pathname}
          render={(props) => (
            //TODO title = post author's display name (like fb) ?
            <Page title="xBook">
              <Room {...props} />
            </Page>
          )}
        />,
        <Route
          path="/u/:userId"
          key={location.pathname}
          render={(props) => (
            <Page>
              <UserProfile {...props} />
            </Page>
          )}
        />,
        <Route
          path="/training/:modalityId"
          key={location.pathname}
          render={(props) => (
            <Page title="Training | xBook">
              <Training {...props} />
            </Page>
          )}
        />,
        <Route
          path="/training"
          key="/training"
          render={(props) => (
            <Page title="Training | xBook">
              <Training {...props} />
            </Page>
          )}
        />,

        <Route
          path="/queues"
          key="/queues"
          render={(props) => (
            <Page title="Queues | xBook">
              <Queues {...props} />
            </Page>
          )}
        />,
        <Route
          exact
          path="/events"
          key={location.pathname}
          render={(props) => (
            <Page title="Events | xBook">
              <Events {...props} />
            </Page>
          )}
        />,
        ,
        <Route
          exact
          path="/events/new"
          key={location.pathname}
          render={(props) => (
            <Page title="New Event | xBook">
              <NewEvent {...props} />
            </Page>
          )}
        />,
        <Route
          path="/community"
          key="/community"
          render={(props) => (
            <Page title="Community | xBook">
              <Community {...props} />
            </Page>
          )}
        />,
        <Route
          path="/donate"
          key="/donate"
          render={(props) => (
            <Page title="Donate | xBook">
              <Donate {...props} />
            </Page>
          )}
        />,
        <Route
          path="/invitecodes"
          key="/invitecodes"
          render={(props) => (
            <Page title="Invite Codes | xBook">
              <InviteCodes {...props} />
            </Page>
          )}
        />,
        <Route
          path="/settings"
          key="/settings"
          render={(props) => (
            <Page title="Settings | xBook">
              <Settings {...props} />
            </Page>
          )}
        />,
        <Route
          path="/premium"
          key="/premium"
          render={(props) => (
            <Page title="Premium | xBook">
              <PremiumPage {...props} />
            </Page>
          )}
        />,
        <Route
          path="/incremental-clicker-game"
          key="/incremental-clicker-game"
          render={(props) => (
            <Page title="Incremental Clicker Game | xBook">
              <IncrementalClickerGame {...props} />
            </Page>
          )}
        />,
        <Route
          path="/tictactoe"
          key="/tictactoe"
          render={(props) => (
            <Page title="Pente | xBook">
              <TicTacToe {...props} />
            </Page>
          )}
        />,
        <Route
          path="/chess"
          key="/chess"
          render={(props) => (
            <Page title="Chess | xBook">
              <Chess {...props} />
            </Page>
          )}
        />,
        <Route
          path="/scorekeeper"
          key="/scorekeeper"
          render={(props) => (
            <Page title="Score Keeper | xBook">
              <Scorekeeper {...props} />
            </Page>
          )}
        />,
        <Route
          path="/lifeoptimizer"
          key="/lifeoptimizer"
          render={(props) => (
            <Page title="Life Optimizer | xBook">
              <LifeOptimizer {...props} />
            </Page>
          )}
        />,
      ]}
      [
      <Route
        path="/about"
        key="/about"
        render={(props) => (
          <Page title="About | xBook">
            <About {...props} />
          </Page>
        )}
      />
      ,
      <Route
        path="/sandbox"
        key="/sandbox"
        render={(props) => (
          <Page title="Sandbox | xBook">
            <Sandbox {...props} />
          </Page>
        )}
      />
      ,]
    </Switch>
  );
};

export default Routes;

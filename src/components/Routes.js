import React, { useContext } from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import Scorekeeper from './views/Scorekeeper';
import IncrementalClickerGame from './views/Games/IncrementalClicker';
import Chess from './views/Games/Chess';
import TicTacToe from './views/Games/TicTacToe';
import Community from './views/Community';
import Admin from './views/Admin';
import Sandbox from './views/Sandbox';
import About from './views/About';
import Rooms from './views/Rooms';
import { AppContext } from './AppProvider';
import UserProfile from './views/UserProfile';

const Routes = () => {
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
        <Route path="/admin" key="/admin">
          <Admin />
        </Route>
      )}
      {user && [
        <Route exact path="/" key={location.pathname}>
          <Rooms />
        </Route>,
        <Route exact path="/r/:roomId" key={location.pathname}>
          <Rooms />
        </Route>,
        <Route path="/r/:roomId/posts/:postId" key={location.pathname}>
          <Rooms />
        </Route>,
        <Route path="/u/:userId" key={location.pathname}>
          <UserProfile />
        </Route>,
        <Route path="/community" key="/community">
          <Community />
        </Route>,
        <Route path="/incremental-clicker-game" key="/incremental-clicker-game">
          <IncrementalClickerGame />
        </Route>,
        <Route path="/tictactoe" key="/tictactoe">
          <TicTacToe />
        </Route>,
        <Route path="/chess" key="/chess">
          <Chess />
        </Route>,
        <Route path="/scorekeeper" key="/scorekeeper">
          <Scorekeeper />
        </Route>,
      ]}
      [
      <Route path="/about" key="/about">
        <About />
      </Route>
      ,
      <Route path="/sandbox" key="/sandbox">
        <Sandbox />
      </Route>
      ,]
    </Switch>
  );
};

export default Routes;

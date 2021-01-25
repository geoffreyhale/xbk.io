import React, { useContext } from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import Scorekeeper from './Scorekeeper';
import IncrementalClickerGame from './Games/IncrementalClicker';
import Chess from './Games/Chess';
import TicTacToe from './Games/TicTacToe';
import Community from './Community';
import Groups from './Groups';
import Posts from './Posts';
import Admin from './Admin';
import Sandbox from './Sandbox';
import About from './About';
import Rooms from './Rooms';
import { AppContext } from './AppProvider';

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
      {user
        ? [
            <Route exact path="/" key={location.pathname}>
              <Rooms />
            </Route>,
            <Route exact path="/r/:roomId" key={location.pathname}>
              <Rooms />
            </Route>,
            <Route path="/r/:roomId/posts/:postId" key={location.pathname}>
              <Rooms />
            </Route>,
            <Route path="/about" key="/about">
              <About />
            </Route>,
            <Route path="/community" key="/community">
              <Community />
            </Route>,
            <Route
              path="/incremental-clicker-game"
              key="/incremental-clicker-game"
            >
              <IncrementalClickerGame />
            </Route>,
            <Route path="/groups" key="/groups">
              <Groups />
            </Route>,
            <Route path="/tictactoe" key="/tictactoe">
              <TicTacToe />
            </Route>,
            <Route path="/chess" key="/chess">
              <Chess />
            </Route>,
            <Route path="/admin" key="/admin">
              <Admin />
            </Route>,
          ]
        : null}
      [
      <Route path="/scorekeeper" key="/scorekeeper">
        <Scorekeeper />
      </Route>
      ,
      <Route path="/sandbox" key="/sandbox">
        <Sandbox />
      </Route>
      , ]
    </Switch>
  );
};

export default Routes;

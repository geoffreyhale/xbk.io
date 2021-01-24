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
import { AppContext } from './AppProvider';

const Routes = () => {
  const { user } = useContext(AppContext);
  const history = useHistory();
  const location = useLocation();

  if (location.pathname === '/') {
    history.push('/posts');
  }

  return (
    <Switch>
      {user
        ? [
            // <Route exact path="/" key="/">

            // </Route>,
            <Route exact path="/posts" key="/posts">
              <Posts />
            </Route>,
            <Route path="/posts/:postId" key="/posts/post">
              <Posts />
            </Route>,
            // // https://ui.dev/react-router-v4-pass-props-to-components/
            // <Route
            //   path="/posts/:postId"
            //   key={location.pathname}
            //   render={(props) => <PostPage {...props} />}
            // />,
            <Route path="/about" key="/about">
              <About />
            </Route>,
            <Route path="/Community" key="/Community">
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
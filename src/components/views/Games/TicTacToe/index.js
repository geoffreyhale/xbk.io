import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { AppContext } from '../../../AppProvider';
import firebase, { auth } from '../../../firebase.js';
import { getUsers } from '../../../../api/index';
import { UserPhoto } from '../../../shared/User';
import FriendlyTimestamp from '../../../shared/timestamp';

import './index.css';

/**
 * TODO
 * - optional beginner mode indicate 4-in-a-row and/or 3-in-a-row-unanswered
 * - sit down to play (enables deeper features)
 * - log should store data, let ui handle messages
 * - log should add capture to same entry
 */

const tictactoeRef = () => firebase.database().ref('games/tictactoe');
const boardRef = () => firebase.database().ref(`games/tictactoe/board`);
const cellRef = (i, j) =>
  firebase.database().ref(`games/tictactoe/board/${i}/${j}`);
const logRef = (key = null) =>
  firebase.database().ref(`games/tictactoe/log${key ? '/' + key : ''}`);

const addLog = ({ i, j, uid, msg }) => {
  const key = logRef().push().key;
  logRef(key).set({
    t: firebase.database.ServerValue.TIMESTAMP,
    msg,
    i,
    j,
    uid,
  });
};

const capture2Ref = () => firebase.database().ref(`games/tictactoe/capture2`);
const Capture2Toggle = ({ value }) => {
  return (
    <>
      <input
        id="capture2"
        type="checkbox"
        checked={!!value}
        onChange={() => capture2Ref().set(!value)}
      />
      <label htmlFor="capture2" className="ml-2">
        Capture 2
      </label>
    </>
  );
};

const Log = ({ log, showCount }) =>
  log &&
  typeof log === 'object' && (
    <table>
      {Object.values(log)
        .sort((a, b) => b.t - a.t)
        .slice(0, showCount)
        .map((entry) => (
          <tr>
            <td>{entry.t}</td>
            <td style={{ textAlign: 'right' }}>
              ({FriendlyTimestamp(entry.t, ' ago')}):
            </td>
            <td>{entry.msg}</td>
          </tr>
        ))}
      {Object.keys(log).length > showCount && (
        <tr>
          <td>...</td>
        </tr>
      )}
    </table>
  );

const BoardButtons = ({ board, expandBoard, reduceBoard }) => (
  <div style={{ display: 'inline-block' }}>
    <Button
      style={{ borderRadius: '2rem' }}
      onClick={expandBoard}
      disabled={board.length >= 19 && true}
    >
      +
    </Button>
    <Button
      style={{ borderRadius: '2rem' }}
      onClick={reduceBoard}
      variant="danger"
      disabled={board.length <= 3 && true}
    >
      -
    </Button>
  </div>
);

const count = (tictactoe) => {
  const count = {};
  tictactoe.forEach((row, i) => {
    tictactoe[i].forEach((cell, j) => {
      count[cell.uid] ? (count[cell.uid] += 1) : (count[cell.uid] = 1);
    });
  });
  return count;
};

const MostRecentCard = ({ mostRecent, uid }) => {
  if (!mostRecent) return null;
  const yourTurn = uid !== mostRecent.uid;
  return (
    <Card
      style={{
        display: 'inline-block',
        verticalAlign: 'top',
        background: yourTurn ? 'green' : 'red',
      }}
    >
      <Card.Body>
        {mostRecent && mostRecent.uid ? (
          <UserPhoto uid={mostRecent.uid} />
        ) : null}
        <span className="ml-3">
          {yourTurn ? 'Your turn!' : 'Wait your turn...'}
        </span>
      </Card.Body>
    </Card>
  );
};

const penteBoardUpdate = ({ i, j, uid }) => {
  let captureOccurred = false;
  boardRef().once('value', (snapshot) => {
    const board = snapshot.val();
    [
      [i - 1, j + 1, i - 2, j + 2, i - 3, j + 3],
      [i - 1, j - 1, i - 2, j - 2, i - 3, j - 3],
      [i - 1, j - 0, i - 2, j - 0, i - 3, j - 0],
      [i + 1, j - 1, i + 2, j - 2, i + 3, j - 3],
      [i + 1, j - 0, i + 2, j - 0, i + 3, j - 0],
      [i + 1, j + 1, i + 2, j + 2, i + 3, j + 3],
      [i - 0, j - 1, i - 0, j - 2, i - 0, j - 3],
      [i - 0, j + 1, i - 0, j + 2, i - 0, j + 3],
    ].forEach(([i1, j1, i2, j2, i3, j3]) => {
      if (
        board[i1] &&
        board[i1][j1] &&
        board[i1][j1].uid &&
        board[i1][j1].uid !== uid
      ) {
        const oneAwayUid = board[i1][j1].uid;
        if (board[i2] && board[i2][j2] && board[i2][j2].uid) {
          if (oneAwayUid === board[i2][j2].uid) {
            if (board[i3] && board[i3][j3] && board[i3][j3].uid === uid) {
              cellRef(i1, j1).set('');
              cellRef(i2, j2).set('');
              captureOccurred = true;
            }
          }
        }
      }
    });
  });
  return captureOccurred;
};

// TODO this can many ways be optimized
const getArrayOfArraysOfFiveInARowCells = (board) => {
  const winningCells = [];
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      [
        [i, j, i - 1, j - 1, i - 2, j - 2, i - 3, j - 3, i - 4, j - 4],
        [i, j, i - 0, j - 1, i - 0, j - 2, i - 0, j - 3, i - 0, j - 4],
        [i, j, i + 1, j - 1, i + 2, j - 2, i + 3, j - 3, i + 4, j - 4],
        [i, j, i - 1, j - 0, i - 2, j - 0, i - 3, j - 0, i - 4, j - 0],
        [i, j, i - 1, j - 1, i - 2, j - 2, i - 3, j - 3, i - 4, j - 4],
        [i, j, i - 1, j + 1, i - 2, j + 2, i - 3, j + 3, i - 4, j + 4],
        [i, j, i + 1, j + 1, i + 2, j + 2, i + 3, j + 3, i + 4, j + 4],
        [i, j, i + 1, j - 0, i + 2, j - 0, i + 3, j - 0, i + 4, j - 0],
      ].forEach(([i0, j0, i1, j1, i2, j2, i3, j3, i4, j4]) => {
        const cellIsOccupiedWithUid0 =
          board[i0] && board[i0][j0] && board[i0][j0].uid;
        const cellIsOccupiedWithUid1 =
          board[i1] && board[i1][j1] && board[i1][j1].uid;
        const cellIsOccupiedWithUid2 =
          board[i2] && board[i2][j2] && board[i2][j2].uid;
        const cellIsOccupiedWithUid3 =
          board[i3] && board[i3][j3] && board[i3][j3].uid;
        const cellIsOccupiedWithUid4 =
          board[i4] && board[i4][j4] && board[i4][j4].uid;
        if (
          cellIsOccupiedWithUid0 &&
          cellIsOccupiedWithUid1 &&
          cellIsOccupiedWithUid2 &&
          cellIsOccupiedWithUid3 &&
          cellIsOccupiedWithUid4 &&
          cellIsOccupiedWithUid0 === cellIsOccupiedWithUid1 &&
          cellIsOccupiedWithUid0 === cellIsOccupiedWithUid2 &&
          cellIsOccupiedWithUid0 === cellIsOccupiedWithUid3 &&
          cellIsOccupiedWithUid0 === cellIsOccupiedWithUid4
        ) {
          winningCells.push([
            { i: i0, j: j0 },
            { i: i1, j: j1 },
            { i: i2, j: j2 },
            { i: i3, j: j3 },
            { i: i4, j: j4 },
          ]);
        }
      });
    });
  });
  return winningCells;
};

export default class TicTacToe extends Component {
  constructor() {
    super();
    this.state = {
      board: [],
      users: {},
      mostRecent: {},
      log: {},
      capture2: null,
    };
    this.expandBoard = this.expandBoard.bind(this);
    this.reduceBoard = this.reduceBoard.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  static contextType = AppContext;
  user = () => this.context.user;

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        tictactoeRef().on('value', (snapshot) => {
          const tictactoe = snapshot.val();
          const { board } = tictactoe;
          const arrayOfArraysOfFiveInARowCells = getArrayOfArraysOfFiveInARowCells(
            board
          );

          board.forEach((row, i) =>
            row.forEach((cell, j) => {
              //TODO don't use empty strings anymore as placeholders for empty cells
              if (typeof board[i][j] === 'object') {
                board[i][j].isAWinningCell =
                  arrayOfArraysOfFiveInARowCells &&
                  !!arrayOfArraysOfFiveInARowCells.some(
                    (arrayOfFiveInARowCells) =>
                      arrayOfFiveInARowCells.some(
                        (winningCell) =>
                          winningCell.i === i && winningCell.j === j
                      )
                  );
              }
            })
          );

          this.setState({
            board,
          });
        });
        logRef().on('value', (snapshot) => {
          const log = snapshot.val();
          const mostRecent =
            log && Object.values(log)[Object.keys(log).length - 1];
          this.setState({
            log,
            mostRecent,
          });
        });
        capture2Ref().on('value', (snapshot) => {
          const capture2 = snapshot.val();
          this.setState({
            capture2,
          });
        });
        getUsers((users) =>
          this.setState({
            users,
          })
        );
      }
    });
  }

  handleClickCell(i, j) {
    cellRef(i, j).once('value', (snapshot) => {
      const existingCell = snapshot.val();
      const cellOccupiedByOther =
        existingCell &&
        existingCell.uid &&
        existingCell.uid !== this.user().uid;
      const cellOccupiedBySelf =
        existingCell && existingCell.uid === this.user().uid;

      if (cellOccupiedByOther) {
        return;
      }

      const cell = {
        uid: this.user().uid,
      };
      if (cellOccupiedBySelf) {
        cellRef(i, j).set('');
        addLog({
          msg: `${this.user().displayName} removed ${i},${j}`,
          i,
          j,
          uid: this.user().uid,
        });
      } else {
        cellRef(i, j).set(cell);
        addLog({
          msg: `${this.user().displayName} put ${i},${j}`,
          i,
          j,
          uid: this.user().uid,
        });

        if (this.state.capture2) {
          const captureOccured = penteBoardUpdate({
            i,
            j,
            uid: this.user().uid,
          });
          captureOccured &&
            addLog({
              msg: `${this.user().displayName} captured 2`,
              i,
              j,
              uid: this.user().uid,
            });
        }
      }
    });
  }
  expandBoard() {
    const board = this.state.board;
    if (board.length >= 19) {
      return;
    }
    // add cell to end of each row
    board.forEach((row, i) => {
      board[i].push('');
    });
    // add new row
    board.push(new Array(this.state.board[0].length).fill(''));
    boardRef().update(board);
  }
  reduceBoard() {
    const board = this.state.board;
    if (board.length <= 3) {
      return;
    }
    // remove last row
    board[board.length - 1].fill(null);
    // remove cell from end of each row
    board.forEach((row, i) => {
      board[i].pop();
    });
    boardRef().update(board);
  }
  resetGame() {
    const board = this.state.board;
    for (let i = 0; i < board.length; i++) {
      board[i].fill('');
    }
    boardRef().update(board);
    logRef().set(null);
  }
  render() {
    return (
      <>
        <Card>
          <Card.Body>
            <h2 style={{ marginBottom: 0 }}>
              Tic-tac-toe{' '}
              <small className="text-muted">(public chaos board)</small>
            </h2>
          </Card.Body>
        </Card>
        <Card className="mt-2">
          <Card.Body>
            <Card.Title>Dashbaord</Card.Title>
            <Card style={{ display: 'inline-block', verticalAlign: 'top' }}>
              <Card.Body>
                <Card.Title>Rules</Card.Title>
                <Capture2Toggle value={this.state.capture2} />
              </Card.Body>
            </Card>
            <Card style={{ display: 'inline-block', verticalAlign: 'top' }}>
              <Card.Body>
                <Card.Title>Board</Card.Title>
                {` Size: ${this.state.board.length} x ${this.state.board.length}`}
                <div className="ml-2">
                  <BoardButtons
                    board={this.state.board}
                    expandBoard={this.expandBoard}
                    reduceBoard={this.reduceBoard}
                  />
                </div>
              </Card.Body>
            </Card>
            <Card
              className="float-right"
              style={{ display: 'inline-block', verticalAlign: 'top' }}
            >
              <Card.Body>
                <Card.Title>Reset Button</Card.Title>
                <Button onClick={this.resetGame} variant="danger" size="sm">
                  Reset Game
                </Button>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
        <Card className="mt-2">
          <Card.Body>
            <div style={{ display: 'inline-block' }}>
              <table id="tictactoe">
                <tbody>
                  {this.state.board.map((row, i) => {
                    const emptyFixedRow = Array.from(row, (item) =>
                      typeof item === 'undefined' ? '' : item
                    );
                    return (
                      <tr key={i}>
                        {emptyFixedRow.map((cell, j) => {
                          const { mostRecent } = this.state;
                          const thisCellIsMostRecent =
                            mostRecent &&
                            mostRecent.i === i &&
                            mostRecent.j === j;
                          return (
                            <td
                              key={j}
                              onClick={() => this.handleClickCell(i, j)}
                              className={
                                (thisCellIsMostRecent ? 'most-recent' : null) +
                                ' ' +
                                (cell.isAWinningCell ? 'win' : null)
                              }
                            >
                              {cell.uid ? (
                                <UserPhoto
                                  uid={cell.uid}
                                  size={45}
                                  roundedCircle={true}
                                  noLink={true}
                                />
                              ) : null}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div
              className="ml-3"
              style={{ display: 'inline-block', verticalAlign: 'top' }}
            >
              <MostRecentCard
                mostRecent={this.state.mostRecent}
                uid={this.user().uid}
              />
              <Log
                log={this.state.log}
                showCount={(this.state.board.length * 35) / 19}
              />
            </div>
          </Card.Body>
        </Card>
        <Card className="mt-2">
          <Card.Body>
            <Card.Title>Count</Card.Title>
            <Table>
              <tbody>
                {Object.entries(count(this.state.board))
                  .sort((a, b) => b[1] - a[1])
                  .map((count, index) => {
                    const uid = count[0];
                    const amount = count[1];
                    return (
                      <tr>
                        <td>
                          {uid ? <UserPhoto uid={uid} size={48} /> : null}
                        </td>
                        <td>{amount}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </>
    );
  }
}

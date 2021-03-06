import { Link } from 'react-router-dom';
import { getRooms } from '../../../api';

export const room_overrides = Object.freeze({
  home: {
    description: (
      <small className="text-muted">
        <ul>
          <li>
            This is view of all of the posts you have access to all in one
            place.
          </li>
          <li>
            Writing a new post from here will post to{' '}
            <Link to={'/r/general'}>r/general</Link> room.
          </li>
        </ul>
      </small>
    ),
  },
  dev: {
    color: '#f8f9fa',
    description: (
      <small className="text-muted">
        <ul>
          <li>
            This is a public room for discussing bugs, feature requests,
            technical support, developer updates, new features, and other
            release notes.
          </li>
        </ul>
      </small>
    ),
  },
  general: {
    color: 'AliceBlue',
    description: (
      <small className="text-muted">
        <ul>
          <li>This is a public room for discussing anything.</li>
        </ul>
      </small>
    ),
  },
  healthyrelating: {
    color: 'MistyRose',
    description: (
      <small className="text-muted">
        <ul>
          <li>This is a premium room. &#11088;</li>
          <li>This room is for discussing and practicing healthy relating.</li>
          <li>
            This room is also for discussing xbk.io features to support healthy
            relating.
          </li>
        </ul>
      </small>
    ),
  },
  productivity: {
    description: (
      <small className="text-muted">
        <ul>
          <li>This is a premium room. &#11088;</li>
          <li>
            This room is for discussing productivity hacks, lessons learned, and
            celebrating success.
          </li>
        </ul>
      </small>
    ),
  },
});

export const premiumRooms = (rooms) =>
  rooms &&
  typeof rooms === 'object' &&
  Object.values(rooms)
    .filter((room) => room.requires && room.requires.includes('premium'))
    .map((room) => room.id);

const getROOMS = (callback) => {
  getRooms((apiRooms) => {
    const rooms = {};

    // add from database and override w local
    Object.entries(apiRooms).forEach(([roomKey, room]) => {
      rooms[roomKey] = room_overrides[roomKey]
        ? Object.assign(room, room_overrides[roomKey])
        : room;
    });
    // add local override rooms that don't exist in database
    Object.entries(room_overrides).forEach(([roomKey, room]) => {
      if (!rooms[roomKey]) {
        rooms[roomKey] = room;
      }
    });
    // iterate over combined list of rooms for final touchups, eg adding url
    Object.keys(rooms).forEach((id) => {
      rooms[id].url = rooms[id].url || `/r/${rooms[id].id}`;
    });

    callback(rooms);
  });
};
export default getROOMS;

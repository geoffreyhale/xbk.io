import firebase, { db } from '../components/firebase.js';
import { isPremium } from '../components/shared/User';

const postRef = (postId) => firebase.database().ref('posts/' + postId);
const postsRef = () => firebase.database().ref('posts');
const notificationUserPostRef = ({ userId, postId }) =>
  firebase.database().ref('notifications/' + userId + '/' + postId);
const notificationsRef = ({ userId }) =>
  firebase.database().ref('notifications/' + userId);
const upvoteUserRef = ({ postId, userId }) =>
  firebase.database().ref('posts/' + postId + '/upvote/' + userId);
const upvoteRef = ({ postId }) =>
  firebase.database().ref('posts/' + postId + '/upvote');

export const addTag = ({ postId, content, successCallback, uid }) => {
  const key = postRef(postId).child('tags').push().key;
  postRef(postId)
    .child('tags')
    .child(key)
    .update({
      type: content,
      userId: uid,
    })
    .then(successCallback());
};

// post w id postId received a reply
// add a notification for the user who authored the post
const addNotifications = ({ postId, myUserId }) => {
  postRef(postId)
    .once('value')
    .then((snapshot) => {
      const post = snapshot.val();
      const userId = post.userId;
      if (userId === myUserId) {
        // do not notify user of post from themselves
        return;
      }
      notificationUserPostRef({ userId, postId }).update({
        [myUserId]: firebase.database.ServerValue.TIMESTAMP,
      });
    });
};

// TODO get rid of old count notifiations and should always require userId here
export const removeNotification = ({ postId, myUserId, userId = null }) => {
  if (userId) {
    notificationsRef({ userId: myUserId }).child(postId).child(userId).remove();
  } else {
    notificationsRef({ userId: myUserId }).child(postId).remove();
  }
};

export const editPost = ({ id, content, successCallback }) => {
  postRef(id)
    .update({
      content,
    })
    .then(successCallback());
};

export const createPost = ({
  content,
  replyToId,
  successCallback,
  uid,
  room,
}) => {
  if (!room) {
    console.error('createPost must receive value for room');
    return;
  }
  const key = postsRef().push().key;
  postsRef()
    .child(key)
    .update({
      content,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      userId: uid,
      replyToId: replyToId,
      room: room,
    })
    .then(replyToId && addNotifications({ postId: replyToId, myUserId: uid }))
    .then(successCallback());
};

export const deletePost = ({ postId }) => {
  postsRef().child(postId).remove();
  // decrementNotifications({ postId: replyToId, myUserId }); // TODO
};

export const getPosts = (callback) => {
  postsRef().once('value', (snapshot) => {
    const posts = snapshot.val();
    callback(posts);
  });
};

export const getUser = (uid, callback) => {
  db.collection('users')
    .doc(uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const user = doc.data();
        user.uid = doc.id;
        firebase
          .database()
          .ref('users/' + user.uid)
          .once('value', (snapshot) => {
            const realtimeUser = snapshot.val();
            const mergedUser = Object.assign(user, realtimeUser);
            mergedUser.isPremium = isPremium({ premium: mergedUser.premium });
            callback(mergedUser);
          });
      } else {
        console.error('User not found! uid: ', uid);
      }
    });
};

export const getAccounting = (callback) => {
  const accounting = {};
  db.collection('accounting')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        accounting[doc.id] = doc.data();
        accounting[doc.id].id = doc.id;
      });
      callback(accounting);
    });
};

export const getUsers = (callback) => {
  const users = {};
  db.collection('users')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        users[doc.id] = doc.data();
        users[doc.id].uid = doc.id;
        users[doc.id].isPremium = isPremium({ premium: users[doc.id].premium });
      });
      callback(users);
    });
};

export const getUsersRealtimeDatabase = (callback) => {
  const usersRef = firebase.database().ref('users');
  usersRef.once('value', (snapshot) => {
    const users = snapshot.val();
    callback(users);
  });
};

export const updateUser = ({ uid, user }, then) => {
  db.collection('users').doc(uid).set(user, { merge: true });
  then();
};

export const toggleUpvote = ({ postId, userId }) => {
  upvoteUserRef({ postId, userId })
    .once('value')
    .then((snapshot) => {
      const upvoteExists = !!snapshot.val();
      if (upvoteExists) {
        upvoteUserRef({ postId, userId }).remove();
      } else {
        upvoteUserRef({ postId, userId }).set(
          firebase.database.ServerValue.TIMESTAMP
        );
      }
    });
};

export const hasMyUpvote = ({ postId, userId }, callback) => {
  upvoteUserRef({ postId, userId }).on('value', (snapshot) => {
    const upvoteExists = !!snapshot.val();
    callback(upvoteExists);
  });
};

export const upvoteCount = ({ postId }, callback) => {
  upvoteRef({ postId }).on('value', (snapshot) => {
    const upvotes = snapshot.val();
    callback(upvotes ? Object.keys(upvotes).length : 0);
  });
};
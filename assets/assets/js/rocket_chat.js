/*
Rocket Chat Real Time API Custom Client


even though this code works great I don't know what exactly each event we listen for is doing
you can go back to rocket chat real time api for further declarations

we were able to write this code after we test real normal use case of livechat in a web page
and we listen for WebSocket connection inside the browser Network tab(by filtering ws(WebSocket) connections)
*/

var room_last_timestamp;

let rocket_chat_server_url = $("meta[name='rocket_chat_url']").attr("content");

var message_body_elm = '.message-wrapper',
  chat_listing_elm = '#message_show_elm',
  message_limit_for_history = 10,
  chat_initiated,
  chat_scrolled = false;

function scrollDownChat(shouldScroll = true) {
  if (!shouldScroll) {
    return;
  }
  $(message_body_elm).animate({
    scrollTop: $(message_body_elm)[0].scrollHeight - $(message_body_elm)[0].clientHeight
  }, 1000);

}

$(message_body_elm).on('scroll', function () {
  var scrollTop = $(this).scrollTop();
  if (scrollTop <= 0) {
    chat_scrolled = true;
    loadRoomHistory(room_last_timestamp);
  }
});

const waitForOpenConnection = (socket) => {
  return new Promise((resolve, reject) => {
    const maxNumberOfAttempts = 10
    const intervalTime = 200 //ms

    let currentAttempt = 0
    const interval = setInterval(() => {
      if (currentAttempt > maxNumberOfAttempts - 1) {
        clearInterval(interval)
        reject(new Error('Maximum number of attempts exceeded'))
      } else if (socket.readyState === socket.OPEN) {
        clearInterval(interval)
        resolve()
      }
      currentAttempt++
    }, intervalTime)
  })
}

const sendMessage = async (socket, msg) => {
  if (socket.readyState !== socket.OPEN) {
    try {
      await waitForOpenConnection(socket)
      socket.send(msg)
    } catch (err) {
      console.error(err)
    }
  } else {
    socket.send(msg)
  }
}


let socket = new WebSocket('wss://' + rocket_chat_server_url + '/websocket');


//note messageCount is incremented with every message
//but it can works even if you didn't change it
let messagesCount = 1;

// listen to messages passed to this socket
socket.onmessage = function (e) {

  let response = JSON.parse(e.data);


  // you have to pong back if you need to keep the connection alive
  // each ping from server need a 'pong' back
  if (response.msg == 'ping') {
    console.log('pong!');
    socket.send(JSON.stringify({
      msg: 'pong'
    }));
    return;
  }

  // here you receive messages from server //notive the event name is: 'stream-room-messages'
  if (response.msg === 'changed' && response.collection === 'stream-room-messages') {
    showMessages(response.fields.args, false)
    scrollDownChat();
    return;
  }

  // receive all messages which will only succeed if you already have messages
  // in the room (or in case you send the first message immediately you can listen for history correctly)
  if (response.msg === 'result' && response.result) {
    if (response.result.messages) {
      let allMsgs = response.result.messages;
      showMessages(allMsgs, true, chat_scrolled ? 'prepend' : 'append')
    }
  }
}

//////////////////////////////////////////////
// steps to achieve the connection to the rocket chat real time api through WebSocket


//1 connect
let connectObject = {
  msg: 'connect',
  version: '1',
  support: ['1', 'pre2', 'pre1']
}

sendMessage(socket, JSON.stringify(connectObject));

let loginRequest = {
  "msg": "method",
  "method": "login",
  "id": String(generateHash(17)),
  "params": [
    {"resume": userToken}
  ]
};

sendMessage(socket, JSON.stringify(loginRequest));
//////////////////////////////////////////////

let makeMeOnline = {
  "msg": "method",
  "method": "UserPresence:setDefaultStatus",
  "id": userToken,
  "params": ["online"]
}

sendMessage(socket, JSON.stringify(makeMeOnline));


let roomSubscription = {
  "msg": "sub",
  "id": String(generateHash(17)),
  "name": "stream-room-messages",
  "params": [
    String(chatRoomId),
    false
  ]
}

sendMessage(socket, JSON.stringify(roomSubscription));

function loadRoomHistory(timestamp = null, limit = 50) {
  let loadHistory = {
    "msg": "method",
    "method": "loadHistory",
    "id": String(generateHash(17)),
    "params": [String(chatRoomId), timestamp ? {"$date": parseFloat(timestamp)} : timestamp, message_limit_for_history, {"$date": new Date().getTime()}]
  };

  sendMessage(socket, JSON.stringify(loadHistory));
}

loadRoomHistory();

//use it to send new messages
function sendNewMsg(msg, messagesCount) {

  let myMsg = {
    msg: 'method',
    method: 'sendMessage',
    params: [{
      _id: String(generateHash(17)),
      rid: chatRoomId,
      msg: String(msg)
    }],
    id: String(messagesCount++),
  }

  sendMessage(socket, JSON.stringify(myMsg));

}


function sendMessageToChat(elm) {

  sendNewMsg($(elm).val(), messagesCount);

  $(elm).val('')
  $(elm).trigger('keyup');
}

function showMessages(msg_array, empty_html = true, action = 'append') {

  console.log('length ', msg_array.length)
  if (msg_array.length) {
    msg_array.reverse();

    room_last_timestamp = msg_array[0].ts.$date;

    if (empty_html && !chat_scrolled) {
      $(chat_listing_elm).html('');
    }
  }

  if (msg_array.length < 10) {
    $('#view_more').css('display', 'none');
  }

  msg_array.map(function (elm) {

    let msg_data = {
      'msg': elm.msg,
      'timestamp': elm.ts.$date,
      'user': elm.u,
      'msg_id': elm._id
    };

    html = showMessagesHtml(msg_data.timestamp, msg_data.msg, msg_data.user._id);

    action != 'append' ? $(chat_listing_elm).prepend(html) : $(chat_listing_elm).append(html);

  });

  scrollDownChat(chat_initiated ? false : true);
  chat_initiated = true;

}

function generateHash(targetLength) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < targetLength; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}


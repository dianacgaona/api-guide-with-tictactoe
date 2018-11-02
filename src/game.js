// (function () {
import displayOutput from './displayOutput';
import getGameId from './getGameId';
import createPubNub from './createPubNub';

export default function game() {
  let gameId = document.querySelector('#gameId');
  let gameIdQuery = document.querySelector('#gameIdQuery');
  let tictactoe = document.querySelector('#tictactoe');
  let output = document.querySelector('#output');
  let whosTurn = document.getElementById('whosTurn');

  let gameid = '';
  let rand = (Math.random() * 9999).toFixed(0);

  gameid = getGameId() ? getGameId() : rand;

  gameId.textContent = gameid;

  let oppoenetUrl =
    'https://pubnub.github.io/api-guide-with-tictactoe/plain.html?id=' + gameid;
  gameIdQuery.innerHTML =
    '<a href="' + oppoenetUrl + '" target="_blank">' + oppoenetUrl + '</a>';

  let channel = 'tictactoe--' + gameid;
  console.log('Channel: ' + channel);

  // var pubnub = new PubNub({
  //   subscribeKey: 'demo',
  //   publishKey: 'demo',
  //   ssl: true,
  // });

  // instantiating PubNub generates a UUID for you and stores it in localStorage
  // and reuses that UUID from localStorage on subsequent PubNub instantiations

  let pubnub = createPubNub();
  console.log('@game', pubnub);
  let uuid = pubnub.getUUID();

  // function displayOutput(msg) {
  //   if (!msg) return;
  //   return '<li><strong>' + msg.player + '</strong>: ' + msg.position + '</li>';
  // }

  /*
   * Tic-tac-toe
   * Based on http://jsfiddle.net/5wKfF/378/
   * Two player feature with PubNub
   */

  let mySign = 'X';

  pubnub.addListener({
    // message events callback - handles all messages published to the subscribed channels
    message: function (event) {
      // Display the move
      if (document.querySelector('#moves')) {
        var movesOutput = document.querySelector('#moves');
        movesOutput.innerHTML =
          movesOutput.innerHTML + displayOutput(event.message);
      }

      // Display the move on the board
      var el = document.querySelector(
        '[data-position="' + event.message.position + '"]'
      );
      el.firstChild.nodeValue = event.message.player;
      console.log(el);

      checkGameStatus(event.message.player, el);

      // this is for Pub/Sub explained section.
      subscribed(event.message);
    },

    // presence events callback - handles all presence events for all channels subscribed withPresence
    presence: function (event) {
      console.log(event);

      if (event.uuid === uuid && event.action === 'join') {
        if (event.occupancy < 2) {
          whosTurn.textContent = 'Waiting for your opponent...';
        } else if (event.occupancy === 2) {
          mySign = 'O';
        } else if (event.occupancy > 2) {
          alert('This game already have two players!');
          tictactoe.className = 'disabled';
        }
      }

      if (event.occupancy === 2) {
        tictactoe.className = '';
        startNewGame();
      }

      document.getElementById('you').textContent = mySign;

      // For Presence Explained Section only
      if (document.querySelector('.presence')) {
        showPresenceExamples(event);
      }
    },

    // status events callback - handles network connectivity status events for all subscribed channels
    status: function (event) {
      if (event.category == 'PNConnectedCategory') {
        play();
      }
    },
  });

  // subscribe to the game channel and monitor presence events on that channel
  pubnub.subscribe({
    channels: [channel],
    withPresence: true,
  });

  function publishPosition(player, position) {
    pubnub.publish(
      {
        channel: channel,
        message: {
          player: player,
          position: position,
        },
      },
      function (status, response) {
        if (status.error) {
          // handle error
          console.error(status);
        } else {
          console.log('message Published w/ timetoken', response.timetoken);
        }
      }
    );
  }

  // function getGameId() {
  //   // If the uRL comes with referral tracking queries from the URL
  //   if (
  //     window.location.search
  //       .substring(1)
  //       .split('?')[0]
  //       .split('=')[0] !== 'id'
  //   ) {
  //     return null;
  //   } else {
  //     return window.location.search
  //       .substring(1)
  //       .split('?')[0]
  //       .split('=')[1];
  //   }
  // }

  let squares = [];
  let EMPTY = '\xA0';
  let score;
  let moves;
  let turn = 'X';
  let wins = [7, 56, 448, 73, 146, 292, 273, 84];

  function startNewGame() {
    turn = 'X';
    score = {
      X: 0,
      O: 0,
    };
    moves = 0;

    for (let i = 0; i < squares.length; i += 1) {
      squares[i].firstChild.nodeValue = EMPTY;
    }

    whosTurn.textContent =
      turn === mySign ? 'Your turn' : "Your opponent's turn";
  }

  function win(score) {
    for (let i = 0; i < wins.length; i += 1) {
      if ((wins[i] & score) === wins[i]) {
        return true;
      }
    }

    return false;
  }

  function checkGameStatus(player, el) {
    moves += 1;
    console.log('Moves: ' + moves);

    score[player] += el.indicator;
    console.log('Score for player, ' + player + ': ' + score[player]);

    if (win(score[turn])) {
      alert(turn + ' wins!');
    } else if (moves === 9) {
      alert('Boooo!');
    } else {
      turn = turn === 'X' ? 'O' : 'X';
      whosTurn.textContent =
        turn === mySign ? 'Your turn' : "Your opponent's turn";
    }
  }

  function set() {
    if (turn !== mySign) return;
    if (this.firstChild.nodeValue !== EMPTY) return;

    publishPosition(mySign, this.dataset.position);

    // this is for Pub/Sub explained section.
    toBePublished(mySign, this.dataset.position);
  }

  function play() {
    let indicator = 1;
    let row;
    let cell;
    let board = document.createElement('table');
    board.border = 1;

    for (let i = 1; i < 4; i += 1) {
      row = document.createElement('tr');
      board.appendChild(row);

      for (let j = 1; j < 4; j += 1) {
        cell = document.createElement('td');
        cell.dataset.position = i + '-' + j;
        cell.width = cell.height = 50;
        cell.align = cell.valign = 'center';
        cell.indicator = indicator;
        cell.onclick = set;
        cell.appendChild(document.createTextNode(''));
        row.appendChild(cell);
        squares.push(cell);
        indicator += indicator;
      }
    }

    tictactoe = document.getElementById('tictactoe');
    tictactoe.appendChild(board);
    startNewGame();
  }

  /*
   * Pub/Sub Explained section
   */

  function toBePublished(player, position) {
    if (!document.getElementById('pubPlayer')) return;

    document.getElementById('pubPlayer').textContent = '"' + player + '"';
    document.getElementById('pubPosition').textContent = '"' + position + '"';
  }

  function subscribed(msg) {
    if (!document.getElementById('subPlayer')) return;

    document.getElementById('subPlayer').textContent = '"' + msg.player + '"';
    document.getElementById('subPosition').textContent =
      '"' + msg.position + '"';
  }

  /*
   * History API Explained section
   */

  if (document.getElementById('history')) {
    let showResultButton = document.getElementById('showResultButton');
    let select = document.getElementById('count');
    let reverseCheck = document.getElementById('reverse');
    let timeCheck = document.getElementById('time');
    let timeSelect = document.getElementById('timeSpan');

    timeCheck.addEventListener('change', function (e) {
      if (timeCheck.checked) {
        timeSelect.hidden = false;
        reverseCheck.disabled = true;
      } else {
        timeSelect.hidden = true;
        reverseCheck.disabled = false;
      }
    });

    showResultButton.addEventListener(
      'click',
      function (e) {
        output.innerHTML = '';

        let count = select.options[select.selectedIndex].value;
        console.log('Getting ' + count + ' messages from history...');

        let isReversed = reverseCheck.checked;
        console.log('Reverse: ' + isReversed);

        let timespan = timeCheck.checked ? timeSelect.value : null;

        getHistory(count, isReversed, timespan);
      },

      false
    );
  }

  function getHistory(count, isReversed, timespan) {
    if (timespan) {
      let start = (new Date().getTime() - timespan * 60 * 1000) * 10000;
      let end = new Date().getTime() * 10000;

      console.log(start, end);

      pubnub.history(
        {
          channel: channel,
          count: count,
          start: start,
          end: end,
        },
        function (status, response) {
          response.messages.forEach(function (msg) {
            console.log(msg);
            output.innerHTML = output.innerHTML + displayOutput(msg);
          });
        }
      );
    } else {
      pubnub.history(
        {
          channel: channel,
          count: count,
          reverse: isReversed,
        },
        function (status, response) {
          response.messages.forEach(function (msg) {
            console.log(msg);
            output.innerHTML = output.innerHTML + displayOutput(msg);
          });
        }
      );
    }
  }

  /*
   * Presence API Explained section
   */

  function showPresenceExamples(msg) {
    showPresenceConsole(msg);

    document.querySelector('.presence').classList.remove('two');
    document.querySelector('.presence strong').textContent = msg.occupancy;
    document.querySelector('.presence span').textContent = 'player';

    if (msg.occupancy > 1) {
      document.querySelector('.presence span').textContent = 'players';
      document.querySelector('.presence').classList.add('two');
    }
  }

  function showPresenceConsole(msg) {
    let console = document.querySelector('#presenceConsole');
    let child = document.createElement('div');
    let text = document.createTextNode(JSON.stringify(msg));
    child.appendChild(text);
    console.appendChild(child);
  }

  if (document.getElementById('quitButton')) {
    let quitButton = document.getElementById('quitButton');

    quitButton.addEventListener('click', function (e) {
      pubnub.unsubscribe({
        channels: [channel],
        callback: function (msg) {
          console.log(msg);
          showPresenceConsole(msg);
        },
      });
    });
  }
}

// class Game {
//   constructor() {
//     this.active = false;
//   }
//
//   start() {
//     this.active = true;
//   }
// }
//
// module.exports = Game;

// })();

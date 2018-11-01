const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const Player = require('./player.js');
const Board = require('./board.js');
const AI = require('./ai.js');

class Game {
  constructor(players) {
    this.active = false;
    this.board = new Board();
    this.playerNow = 1;
    this.playerNext = 2;
    this.players = 0;
    this.init(players);

    // console.log(this, this.isHumanTurn());
  }

  init(players) {
    for (let i = players; i > 0; i--) {
      let player = this.addPlayer();
      this['p' + player] = new Player(player);
    }

    let aiPlayers = 2 - this.players;
    if (aiPlayers) {
      this.spawn(aiPlayers);
    }
  }

  addPlayer() {
    this.players++;
    return this.players;
  }

  spawn(aiPlayers) {
    //choose random opponent?
    for (let i = aiPlayers; i > 0; i--) {
      let player = this.addPlayer();
      this['p' + player] = new AI(player);
    }

    if (aiPlayers === 2) {
      this.checkTurn();
    }
  }

  isHumanTurn() {
    return this['p' + this.playerNow].brain;
  }

  start() {
    this.active = true;
    this.board.display();
  }

  play(move) {
    if (this.isSingleDigit(move) && this.board.isTileOpen(move - 1)) {
      this.placeMarker(move);
      this.checkState();
      this.checkTurn();
    } else {
      this.inValidMove();
    }
  }

  isSingleDigit(move) {
    return move > 0 && move <= 9;
  }

  placeMarker(move) {
    let tile = move - 1;
    this.board.tiles[tile] = this['p' + this.playerNow].marker;
    this.board.display();
  }

  checkState() {
    if (this.isWon()) {
      this.win();
    } else if (this.isTie()) {
      this.tie();
    } else {
      this.switchPlayers();
    }
  }

  checkTurn() {
    if (!this.isHumanTurn()) {
      let openTiles = this.board.openTiles();
      let ai = this['p' + this.playerNow];
      let move = ai.makeMove(openTiles);

      // console.log(`${ai.marker}  chose ${move} from ${openTiles}`);
      setTimeout(() => {
        this.play(move);
      }, 1200);
    }
  }

  inValidMove() {
    if (this.isActive()) {
      this.board.display();
      let openTiles = this.board.openTiles();
      console.log(`
Please select tiles:
${openTiles}.`);
    }
  }

  isWon() {
    let t = this.board.tiles;
    if (
      (t[0] === t[1] && t[1] === t[2]) ||
      (t[3] === t[4] && t[4] === t[5]) ||
      (t[6] === t[7] && t[7] === t[8]) ||
      (t[0] === t[3] && t[3] === t[6]) ||
      (t[1] === t[4] && t[4] === t[7]) ||
      (t[2] === t[5] && t[5] === t[8]) ||
      (t[0] === t[4] && t[4] === t[8]) ||
      (t[2] === t[4] && t[4] === t[6])
    ) {
      return true;
    } else {
      return false;
    }
  }

  win() {
    let winner = this['p' + this.playerNow].marker;
    console.log(
      `
Player ${this['p' + this.playerNow].player} Wins!
${winner} ${winner} ${winner}`
    );
    this.over();
  }

  isTie() {
    return this.board.tiles.every(el => typeof el !== 'number');
  }

  tie() {
    console.log(`
It's a Tie!
${this.p1.marker}  ${this.p2.marker}`);
    this.over();
  }

  switchPlayers() {
    this.playerNow = this.playerNow === 1 ? 2 : 1;
    this.playerNext = this.playerNext === 1 ? 2 : 1;
  }

  isActive() {
    return this.active;
  }

  over() {
    this.active = false;
  }
}

let game = null;
console.log('Choose the number of players:\n [ 0 ] [ 1 ] [ 2 ] ');
counter = 1;
rl.on('line', line => {
  if (counter && (line >= 0 && line <= 2)) {
    counter--;
    game = new Game(line);
    game.start();
  } else if (counter) {
    console.clear();
    console.log(`Choose the number of players:
 [ 0 ] [ 1 ] [ 2 ] `);
    console.log(`
Please select 0 or 1 or 2.`);
  } else {
    if (game.isActive() && game.isHumanTurn()) {
      let move = +line.trim();
      game.play(move);
    }
  }

  //NOTE TODO
  // else {
  //   game.board.display();
  //   console.log('Game over');
  // }
});

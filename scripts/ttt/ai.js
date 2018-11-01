class AI {
  constructor(player) {
    let markers = ['🖥', '🕹'];
    this.player = player;
    this.marker = markers[this.player - 1];
    this.brain = false;

    // this.turn = 0;
  }

  makeMove(openTiles) {
    return openTiles[Math.floor(Math.random() * openTiles.length)];
  }
}

module.exports = AI;

// setTimeout => chooseRandomTile
// Atari => 🕹
// Siri => 🖥
// ifTileWins=>chooseTile

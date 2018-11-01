class Player {
  constructor(player) {
    let markers = ['😘', '🤗'];
    this.player = player;
    this.marker = markers[player - 1];
    this.brain = true;
  }
}
module.exports = Player;

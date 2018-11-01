class Board {
  constructor() {
    this.tiles = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.gfx = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
  }

  isTileOpen(tile) {
    return typeof this.tiles[tile] === 'number';
  }

  openTiles() {
    return this.tiles.filter(tile => typeof tile === 'number');
  }

  display() {
    console.clear();
    let str = '';
    let gfx = this.gfx;
    this.tiles.forEach((el, i) => {
      if (i === 0 || i === 1 || i === 3 || i === 4 || i === 6 || i === 7) {
        str += (typeof el === 'number' ? gfx[i] : el) + '  | ';

        // str += (typeof el === 'number' ? gfx[i] : el) + '  ◽ ';
        // str += (typeof el === 'number' ? gfx[i] : el) + '  🔸 ';
      } else if (i === 2 || i === 5) {
        str += typeof el === 'number' ? gfx[i] : el;
        console.log(str);

        // console.log('◽◽◽◽◽◽◽');
        // console.log('🔸🔸🔸🔸🔸🔸🔸');
        // console.log('---------');
        console.log('------------');
        str = '';
      } else {
        str += typeof el === 'number' ? gfx[i] : el;
        console.log(str);
        str = '';
      }
    });
  }
}

module.exports = Board;

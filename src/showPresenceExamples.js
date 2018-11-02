import showPresenceConsole from './showPresenceConsole';

export default function showPresenceExamples(msg) {
  showPresenceConsole(msg);

  document.querySelector('.presence').classList.remove('two');
  document.querySelector('.presence strong').textContent = msg.occupancy;
  document.querySelector('.presence span').textContent = 'player';

  if (msg.occupancy > 1) {
    document.querySelector('.presence span').textContent = 'players';
    document.querySelector('.presence').classList.add('two');
  }
}

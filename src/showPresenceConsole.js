export default function showPresenceConsole(msg) {
  let console = document.querySelector('#presenceConsole');
  let child = document.createElement('div');
  let text = document.createTextNode(JSON.stringify(msg));
  child.appendChild(text);
  console.appendChild(child);
}

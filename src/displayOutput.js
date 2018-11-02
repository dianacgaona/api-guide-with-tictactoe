export default function displayOutput(msg) {
  if (!msg) return;
  return '<li><strong>' + msg.player + '</strong>: ' + msg.position + '</li>';
}

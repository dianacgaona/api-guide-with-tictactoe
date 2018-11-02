export default function createPubNub() {
  return new PubNub({
    subscribeKey: 'demo',
    publishKey: 'demo',
    ssl: true,
  });
}

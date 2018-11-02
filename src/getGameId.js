export default function getGameId() {
  // If the uRL comes with referral tracking queries from the URL
  if (
    window.location.search
      .substring(1)
      .split('?')[0]
      .split('=')[0] !== 'id'
  ) {
    return null;
  } else {
    return window.location.search
      .substring(1)
      .split('?')[0]
      .split('=')[1];
  }
}

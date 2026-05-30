chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'index.html' });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message && message.action === 'open_hub') {
    chrome.tabs.create({ url: 'index.html' });
  }
});

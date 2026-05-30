/**
 * LinkedIn Saved Items Scraper Content Script
 */

function log(msg) {
  console.log('[LinkedIn Saved Hub Scraper] ' + msg);
}

// Function to extract text cleanly or return empty string
function getText(element, selector) {
  if (!element) return '';
  const sub = element.querySelector(selector);
  return sub ? sub.innerText.trim() : '';
}

// Function to extract attributes cleanly
function getAttr(element, selector, attr) {
  if (!element) return '';
  const sub = element.querySelector(selector);
  return sub ? sub.getAttribute(attr) || '' : '';
}

// Main scraper function
function scrapeSavedPosts() {
  log('Starting scrape...');
  
  // Selectors for listing containers
  const listItems = document.querySelectorAll(
    'li.mn-my-items__list-item, .entity-result, .reusable-search__result-container, [data-urn]'
  );
  
  if (listItems.length === 0) {
    log('No saved items found on page yet.');
    return;
  }
  
  const scrapedPosts = [];
  
  listItems.forEach((item, index) => {
    // Avoid scraping non-result elements
    if (!item.querySelector('.entity-result__title-text, .entity-result__title')) {
      return;
    }
    
    // 1. Author Name
    let authorName = getText(item, '.entity-result__title-text a');
    if (!authorName) {
      authorName = getText(item, '.entity-result__title-text span[aria-hidden="true"]');
    }
    if (!authorName) {
      authorName = getText(item, '.entity-result__title-text');
    }
    // Clean up connections degree if appended (e.g. "Shubham Wadekar\n• 3rd+")
    authorName = authorName.split('\n')[0].trim();
    
    // 2. Author Headline/Title
    const authorTitle = getText(item, '.entity-result__primary-subtitle');
    
    // 3. Author Avatar
    let authorAvatar = getAttr(item, '.entity-result__image img, .presence-entity__image img', 'src');
    if (!authorAvatar || authorAvatar.startsWith('data:image')) {
      // Fallback placeholder
      authorAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop';
    }
    
    // 4. Time Ago / Connection Badge
    const timeAgo = getText(item, '.entity-result__secondary-subtitle');
    
    // 5. Post Content Text
    let content = getText(item, '.entity-result__summary');
    if (!content) {
      content = getText(item, '.entity-result__description');
    }
    
    // 6. Thumbnail Image (embedded image preview)
    let thumbnailUrl = getAttr(item, '.entity-result__content img, .entity-result__image-content img', 'src');
    if (!thumbnailUrl || thumbnailUrl.startsWith('data:image')) {
      // Look for any image in the card body
      const images = item.querySelectorAll('.entity-result__content img, img');
      for (let img of images) {
        const src = img.getAttribute('src');
        if (src && !src.includes('avatar') && !src.includes('profile') && !src.startsWith('data:image') && src.length > 20) {
          thumbnailUrl = src;
          break;
        }
      }
    }
    
    // 7. Post Link
    const postUrl = getAttr(item, '.entity-result__title-text a, a[href*="/feed/update/"]', 'href');
    
    // Generate unique ID
    let id = postUrl ? postUrl.split('/')[postUrl.split('/').length - 2] : '';
    if (!id || id.length < 5) {
      id = 'scraped_' + index + '_' + Date.now();
    }
    
    if (authorName && content) {
      scrapedPosts.push({
        id,
        authorName,
        authorTitle,
        authorAvatar,
        timeAgo: timeAgo || 'Recently',
        content,
        thumbnailUrl: thumbnailUrl || undefined,
        postUrl,
        date: new Date().toISOString()
      });
    }
  });
  
  if (scrapedPosts.length > 0) {
    chrome.storage.local.set({ scrapedPosts }, () => {
      log(`Successfully saved ${scrapedPosts.length} posts to storage!`);
      showToast(`Synced ${scrapedPosts.length} saved posts to Saved Hub!`);
    });
  }
}

// Function to inject a beautiful overlay toast notification
function showToast(message) {
  // Check if toast already exists
  let toast = document.getElementById('li-saved-hub-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'li-saved-hub-toast';
    toast.style.position = 'fixed';
    toast.style.top = '70px';
    toast.style.right = '20px';
    toast.style.backgroundColor = '#057642'; // LinkedIn Green
    toast.style.color = '#ffffff';
    toast.style.padding = '12px 18px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.zIndex = '99999';
    toast.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = '600';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    
    document.body.appendChild(toast);
  }
  
  toast.innerHTML = `
    <span>${message}</span>
    <button id="li-toast-btn" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer; font-weight: bold; hover:background: rgba(255,255,255,0.3)">
      Open Hub
    </button>
  `;
  
  // Show it
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 100);
  
  document.getElementById('li-toast-btn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'open_hub' });
    window.open(chrome.runtime.getURL('index.html'), '_blank');
  });
  
  // Hide after 6 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 6000);
}

// Function to inject floating action button
function injectFloatingButton() {
  if (document.getElementById('li-saved-hub-fab')) return;
  
  const fab = document.createElement('button');
  fab.id = 'li-saved-hub-fab';
  fab.innerText = 'Open Saved Hub';
  
  // Styling
  fab.style.position = 'fixed';
  fab.style.bottom = '24px';
  fab.style.right = '24px';
  fab.style.backgroundColor = '#0A66C2'; // LinkedIn Blue
  fab.style.color = '#ffffff';
  fab.style.border = 'none';
  fab.style.borderRadius = '24px';
  fab.style.padding = '12px 20px';
  fab.style.fontSize = '14px';
  fab.style.fontWeight = 'bold';
  fab.style.boxShadow = '0 4px 16px rgba(10, 102, 194, 0.35)';
  fab.style.zIndex = '9999';
  fab.style.cursor = 'pointer';
  fab.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  fab.style.transition = 'transform 0.2s ease, background-color 0.2s ease';
  
  fab.addEventListener('mouseenter', () => {
    fab.style.transform = 'scale(1.05)';
    fab.style.backgroundColor = '#004182';
  });
  
  fab.addEventListener('mouseleave', () => {
    fab.style.transform = 'scale(1)';
    fab.style.backgroundColor = '#0A66C2';
  });
  
  fab.addEventListener('click', () => {
    window.open(chrome.runtime.getURL('index.html'), '_blank');
  });
  
  document.body.appendChild(fab);
  log('Floating action button injected.');
}

// Initialize scraper and injections
function init() {
  log('Initializing Content Script...');
  
  // Wait for content to load, then run scraping and inject button
  setTimeout(() => {
    scrapeSavedPosts();
    injectFloatingButton();
  }, 2500);

  // Monitor DOM modifications (for scroll loads)
  let timeout = null;
  const observer = new MutationObserver(() => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      scrapeSavedPosts();
    }, 1500);
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Run init
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}

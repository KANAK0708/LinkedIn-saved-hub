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

// Check if we are on the saved posts page
function isSavedPostsPage() {
  return window.location.href.includes('/my-items/saved-posts');
}

// Main scraper function
function scrapeSavedPosts() {
  if (!isSavedPostsPage()) return;
  
  log('Starting scrape...');
  
  // Selectors for listing containers
  const listItems = document.querySelectorAll(
    'li.mn-my-items__list-item, .entity-result, .reusable-search__result-container, [data-urn], .feed-shared-update-v2'
  );
  
  if (listItems.length === 0) {
    log('No items found on page yet.');
    return;
  }
  
  const scrapedPosts = [];
  
  listItems.forEach((item, index) => {
    // Try to find author name
    let authorName = '';
    const nameSelectors = [
      '.entity-result__title-text a',
      '.entity-result__title-text span[aria-hidden="true"]',
      '.entity-result__title-text',
      '.entity-result__title',
      '.update-components-actor__name',
      '.feed-shared-actor__name',
      '[class*="actor__name"]',
      'a[href*="/in/"] span[aria-hidden="true"]',
      'a[href*="/in/"]'
    ];
    
    for (const selector of nameSelectors) {
      const text = getText(item, selector);
      if (text) {
        authorName = text.split('\n')[0].trim();
        break;
      }
    }

    if (!authorName) return; // Skip if we can't identify the author
    
    // Try to find content text
    let content = '';
    const contentSelectors = [
      '.entity-result__summary',
      '.entity-result__description',
      '.feed-shared-update-v2__description',
      '.update-components-text',
      '[class*="content-summary"]',
      '[class*="update-v2__description"]',
      '[class*="feed-shared-text-view"]',
      '.feed-shared-text'
    ];
    
    for (const selector of contentSelectors) {
      const text = getText(item, selector);
      if (text) {
        content = text.trim();
        break;
      }
    }

    if (!content) return; // Skip if no content text is found

    // Author Title
    let authorTitle = '';
    const titleSelectors = [
      '.entity-result__primary-subtitle',
      '.update-components-actor__description',
      '.feed-shared-actor__description',
      '[class*="actor__description"]'
    ];
    for (const selector of titleSelectors) {
      const text = getText(item, selector);
      if (text) {
        authorTitle = text.trim();
        break;
      }
    }
    
    // Author Avatar
    let authorAvatar = '';
    const avatarSelectors = [
      '.entity-result__image img',
      '.presence-entity__image img',
      '.update-components-actor__avatar img',
      '.feed-shared-actor__avatar img',
      'img[class*="actor__avatar"]',
      'img[class*="presence-entity"]'
    ];
    for (const selector of avatarSelectors) {
      const src = getAttr(item, selector, 'src');
      if (src && !src.startsWith('data:image')) {
        authorAvatar = src;
        break;
      }
    }
    if (!authorAvatar) {
      authorAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop';
    }
    
    // Time Ago
    let timeAgo = getText(item, '.entity-result__secondary-subtitle') || getText(item, '.feed-shared-actor__sub-text') || 'Recently';
    timeAgo = timeAgo.trim();
    
    // Thumbnail Image (media content)
    let thumbnailUrl = getAttr(item, '.entity-result__content img, .entity-result__image-content img', 'src');
    if (!thumbnailUrl || thumbnailUrl.startsWith('data:image')) {
      const images = item.querySelectorAll('img');
      for (let img of images) {
        const src = img.getAttribute('src');
        if (src && !src.includes('avatar') && !src.includes('profile') && !src.startsWith('data:image') && src.length > 20) {
          thumbnailUrl = src;
          break;
        }
      }
    }
    
    // Post URL
    let postUrl = '';
    const postUrlSelectors = [
      '.entity-result__title-text a',
      'a[href*="/feed/update/"]',
      'a.app-aware-link'
    ];
    for (const selector of postUrlSelectors) {
      const href = getAttr(item, selector, 'href');
      if (href && (href.includes('/feed/update/') || href.includes('/in/') || href.includes('/news/'))) {
        postUrl = href;
        break;
      }
    }
    
    // Generate unique ID
    let id = '';
    if (postUrl) {
      const parts = postUrl.split('/');
      id = parts[parts.length - 2] || parts[parts.length - 1] || '';
    }
    if (!id || id.length < 5) {
      id = 'scraped_' + index + '_' + Date.now();
    }
    
    scrapedPosts.push({
      id,
      author: {
        name: authorName,
        title: authorTitle,
        avatar: authorAvatar,
        followers: ''
      },
      content,
      thumbnailUrl: thumbnailUrl || undefined,
      postUrl,
      timeAgo,
      date: new Date().toISOString()
    });
  });
  
  if (scrapedPosts.length > 0) {
    chrome.storage.local.get('scrapedPosts', (result) => {
      const currentPosts = result.scrapedPosts || [];
      const postMap = new Map();
      currentPosts.forEach(p => postMap.set(p.id, p));
      
      let newAdded = false;
      scrapedPosts.forEach(p => {
        if (!postMap.has(p.id)) {
          postMap.set(p.id, p);
          newAdded = true;
        }
      });
      
      if (newAdded || currentPosts.length === 0) {
        const mergedPosts = Array.from(postMap.values());
        chrome.storage.local.set({ scrapedPosts: mergedPosts }, () => {
          log(`Successfully saved ${mergedPosts.length} posts to storage!`);
          showToast(`Synced ${mergedPosts.length} saved posts to Saved Hub!`);
        });
      }
    });
  }
}

// Function to inject a beautiful overlay toast notification
function showToast(message) {
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
  
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 100);
  
  document.getElementById('li-toast-btn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'open_hub' });
  });
  
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
  if (!isSavedPostsPage()) {
    const existingFab = document.getElementById('li-saved-hub-fab');
    if (existingFab) existingFab.remove();
    return;
  }

  if (document.getElementById('li-saved-hub-fab')) return;
  
  const fab = document.createElement('button');
  fab.id = 'li-saved-hub-fab';
  fab.innerText = 'Open Saved Hub';
  
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
    chrome.runtime.sendMessage({ action: 'open_hub' });
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

  // Monitor DOM modifications (for scroll loads and URL navigation)
  let timeout = null;
  const observer = new MutationObserver(() => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (isSavedPostsPage()) {
        injectFloatingButton();
        scrapeSavedPosts();
      } else {
        const fab = document.getElementById('li-saved-hub-fab');
        if (fab) fab.remove();
      }
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

/**
 * DSA GUIDE - Shared Application JavaScript
 * Handles Navigation, LocalStorage Progress Tracking, Search Filtering, & UI Interactivity.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initProgressTracker();
  initSearch();
  initCollapsibles();
  initAnswerToggles();
  trackLastVisitedPage();
});

/**
 * 1. Navigation & Mobile Sidebar Toggle
 */
function initNavigation() {
  const toggleBtn = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('app-sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('open');
    });

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
      });
    }
  }

  // Highlight active link based on current URL path
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.sidebar-nav-item a');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath && currentPath.endsWith(linkPath.replace('../', ''))) {
      link.parentElement.classList.add('active');
    }
  });
}

/**
 * 2. Progress Tracker & LocalStorage Manager
 */
const TOTAL_TOPICS = 5;

function getCompletedTopics() {
  try {
    const saved = localStorage.getItem('dsa_completed_topics');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

function initProgressTracker() {
  updateProgressUI();

  // Attach click handler for "Mark as Complete" buttons on topic pages
  const completeBtn = document.getElementById('mark-complete-btn');
  if (completeBtn) {
    const topicId = completeBtn.getAttribute('data-topic-id');
    const completedList = getCompletedTopics();

    if (completedList.includes(topicId)) {
      completeBtn.classList.add('active');
      completeBtn.innerHTML = '<span>✓ Completed</span>';
    }

    completeBtn.addEventListener('click', () => {
      let currentCompleted = getCompletedTopics();
      const isCompleted = currentCompleted.includes(topicId);

      if (isCompleted) {
        currentCompleted = currentCompleted.filter(id => id !== topicId);
        completeBtn.classList.remove('active');
        completeBtn.innerHTML = '<span>Mark as Complete</span>';
        showToast('Topic marked as incomplete', 'info');
      } else {
        currentCompleted.push(topicId);
        completeBtn.classList.add('active');
        completeBtn.innerHTML = '<span>✓ Completed</span>';
        showToast('🎉 Topic completed! Keep it up!', 'success');
      }

      localStorage.setItem('dsa_completed_topics', JSON.stringify(currentCompleted));
      updateProgressUI();
    });
  }
}

function updateProgressUI() {
  const completedList = getCompletedTopics();
  const count = completedList.length;
  const percentage = Math.round((count / TOTAL_TOPICS) * 100);

  // Update Progress Bar
  const progressBarFill = document.getElementById('progress-bar-fill');
  const progressText = document.getElementById('progress-text');

  if (progressBarFill) {
    progressBarFill.style.width = `${percentage}%`;
  }
  if (progressText) {
    progressText.textContent = `${count} of ${TOTAL_TOPICS} Completed (${percentage}%)`;
  }

  // Update Sidebar Checkmarks
  const navItems = document.querySelectorAll('.sidebar-nav-item[data-topic-id]');
  navItems.forEach(item => {
    const topicId = item.getAttribute('data-topic-id');
    if (completedList.includes(topicId)) {
      item.classList.add('completed');
    } else {
      item.classList.remove('completed');
    }
  });

  // Update Topic Cards Checkmarks / Badges on index.html if present
  const cards = document.querySelectorAll('.topic-card[data-topic-id]');
  cards.forEach(card => {
    const topicId = card.getAttribute('data-topic-id');
    const badge = card.querySelector('.completion-badge');
    const actionBtn = card.querySelector('.card-action-btn');

    if (completedList.includes(topicId)) {
      if (badge) {
        badge.innerHTML = '✓ Completed';
        badge.style.display = 'inline-block';
      }
      if (actionBtn) {
        actionBtn.textContent = 'Review Topic';
      }
    } else {
      if (badge) {
        badge.style.display = 'none';
      }
      if (actionBtn) {
        actionBtn.textContent = 'Start Topic';
      }
    }
  });
}

/**
 * 3. Last Visited Topic Tracker
 */
function trackLastVisitedPage() {
  const topicTitleElem = document.querySelector('.topic-header h1');
  const topicIdElem = document.getElementById('mark-complete-btn');

  if (topicTitleElem && topicIdElem) {
    const topicTitle = topicTitleElem.textContent.trim();
    const path = window.location.pathname;

    const lastVisited = {
      title: topicTitle,
      path: path,
      timestamp: Date.now()
    };

    localStorage.setItem('dsa_last_visited', JSON.stringify(lastVisited));
  }

  // Render "Continue Where You Left Off" section on index.html
  const continueContainer = document.getElementById('continue-section');
  if (continueContainer) {
    try {
      const saved = localStorage.getItem('dsa_last_visited');
      if (saved) {
        const lastVisited = JSON.parse(saved);
        continueContainer.innerHTML = `
          <div class="continue-card">
            <div class="continue-info">
              <h4>Continue Where You Left Off</h4>
              <h3>${lastVisited.title}</h3>
            </div>
            <a href="${lastVisited.path}" class="btn btn-primary">Resume Learning →</a>
          </div>
        `;
      }
    } catch (e) {
      console.warn('Failed to parse last visited topic:', e);
    }
  }
}

/**
 * 4. Header Live Search Filter
 */
function initSearch() {
  const searchInput = document.getElementById('sidebar-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const navItems = document.querySelectorAll('.sidebar-nav-item');

    navItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

/**
 * 5. Collapsible Panels (e.g. Pseudocode)
 */
function initCollapsibles() {
  const collapsibles = document.querySelectorAll('.collapsible-header');

  collapsibles.forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.collapsible-card');
      if (card) {
        card.classList.toggle('open');
      }
    });
  });
}

/**
 * 6. Practice Question Toggle Answer
 */
function initAnswerToggles() {
  const toggleBtns = document.querySelectorAll('.toggle-answer-btn');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const box = btn.closest('.question-box');
      if (box) {
        const answer = box.querySelector('.answer-content');
        if (answer) {
          const isShown = answer.classList.contains('show');
          answer.classList.toggle('show');
          btn.textContent = isShown ? 'Show Answer' : 'Hide Answer';
        }
      }
    });
  });
}

/**
 * 7. Toast Notification Utility
 */
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

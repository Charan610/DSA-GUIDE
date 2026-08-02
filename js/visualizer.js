/**
 * DSA GUIDE - Interactive Visualizer Engine
 * Reusable Canvas & DOM visualizer logic for DSA Topics:
 * - Binary Search (Step-through window visualizer)
 * - Bubble Sort (Animated bar chart with Play/Pause/Speed)
 * - Arrays (Contiguous memory blocks with Insert/Delete/Search shift animations)
 * - Linked List (Node chain with Data|Next pointers & dynamic operations)
 * - Stacks & Queues (Vertical LIFO Stack & Horizontal FIFO Queue)
 */

window.DSAVisualizers = {};

/* ==========================================================================
   1. BINARY SEARCH VISUALIZER
   ========================================================================== */
window.DSAVisualizers.initBinarySearch = function (containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const array = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
  let target = 23;
  let steps = [];
  let currentStep = 0;

  function generateSteps() {
    steps = [];
    let low = 0;
    let high = array.length - 1;
    let found = false;

    steps.push({
      low,
      high,
      mid: Math.floor((low + high) / 2),
      status: `Initial search space: low index 0, high index ${high}.`,
      found: false
    });

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const val = array[mid];

      if (val === target) {
        steps.push({
          low,
          high,
          mid,
          status: `🎯 Target ${target} found at index ${mid}!`,
          found: true
        });
        found = true;
        break;
      } else if (val < target) {
        steps.push({
          low: mid + 1,
          high,
          mid,
          status: `array[${mid}] (${val}) < ${target}. Target is in right half. Shift low to ${mid + 1}.`,
          found: false
        });
        low = mid + 1;
      } else {
        steps.push({
          low,
          high: mid - 1,
          mid,
          status: `array[${mid}] (${val}) > ${target}. Target is in left half. Shift high to ${mid - 1}.`,
          found: false
        });
        high = mid - 1;
      }
    }

    if (!found && steps.length > 0 && steps[steps.length - 1].low > steps[steps.length - 1].high) {
      steps.push({
        low: -1,
        high: -1,
        mid: -1,
        status: `❌ Target ${target} is not in the array. Search space exhausted.`,
        found: false
      });
    }
  }

  function render() {
    const step = steps[currentStep] || { low: 0, high: array.length - 1, mid: -1, status: 'Ready' };

    let html = `
      <div style="display: flex; gap: 0.5rem; justify-content: center; align-items: flex-end; width: 100%; padding: 1rem 0; flex-wrap: wrap;">
    `;

    array.forEach((val, idx) => {
      let bgColor = 'var(--bg-card)';
      let borderColor = 'var(--border-color)';
      let textColor = 'var(--text-main)';
      let transform = 'scale(1)';
      let opacity = '1';

      const inRange = idx >= step.low && idx <= step.high;
      if (!inRange && step.low !== -1) {
        opacity = '0.35';
      }

      if (idx === step.mid) {
        bgColor = 'rgba(77, 232, 240, 0.2)';
        borderColor = 'var(--accent-cyan)';
        textColor = 'var(--accent-cyan)';
        transform = 'translateY(-6px)';
      }

      if (step.found && idx === step.mid) {
        bgColor = 'rgba(63, 185, 80, 0.25)';
        borderColor = 'var(--success)';
        textColor = 'var(--success)';
        transform = 'translateY(-8px) scale(1.08)';
      }

      html += `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem;">
          <div style="font-size: 0.7rem; color: var(--text-dim); font-family: var(--font-mono);">
            ${idx === step.low ? 'low' : idx === step.high ? 'high' : ''}
          </div>
          <div style="
            width: 48px;
            height: 48px;
            background: ${bgColor};
            border: 2px solid ${borderColor};
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-mono);
            font-weight: 700;
            color: ${textColor};
            transform: ${transform};
            opacity: ${opacity};
            transition: all 0.25s ease;
            box-shadow: ${idx === step.mid ? '0 0 12px var(--accent-cyan-glow)' : 'none'};
          ">
            ${val}
          </div>
          <div style="font-size: 0.75rem; color: var(--text-dim); font-family: var(--font-mono);">[${idx}]</div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    const logElem = document.getElementById('bs-log');
    if (logElem) {
      logElem.textContent = `Step ${currentStep + 1}/${steps.length}: ${step.status}`;
    }
  }

  generateSteps();
  render();

  // Control Event Bindings
  const prevBtn = document.getElementById('bs-prev-btn');
  const nextBtn = document.getElementById('bs-next-btn');
  const resetBtn = document.getElementById('bs-reset-btn');
  const targetInput = document.getElementById('bs-target-input');
  const setTargetBtn = document.getElementById('bs-set-target-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        render();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        render();
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentStep = 0;
      render();
    });
  }

  if (setTargetBtn && targetInput) {
    setTargetBtn.addEventListener('click', () => {
      const val = parseInt(targetInput.value, 10);
      if (!isNaN(val)) {
        target = val;
        currentStep = 0;
        generateSteps();
        render();
      }
    });
  }
};


/* ==========================================================================
   2. BUBBLE SORT VISUALIZER
   ========================================================================== */
window.DSAVisualizers.initBubbleSort = function (containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let originalArray = [42, 18, 85, 29, 64, 12, 95, 37, 51, 73];
  let array = [...originalArray];
  let steps = [];
  let currentStep = 0;
  let isPlaying = false;
  let intervalId = null;
  let speed = 400;

  function generateSteps() {
    steps = [];
    let arr = [...originalArray];
    const n = arr.length;

    steps.push({
      arr: [...arr],
      comparing: [],
      sorted: [],
      status: 'Initial unsorted array.'
    });

    let sortedIndices = [];

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          arr: [...arr],
          comparing: [j, j + 1],
          sorted: [...sortedIndices],
          status: `Comparing elements at index ${j} (${arr[j]}) and ${j + 1} (${arr[j + 1]}).`
        });

        if (arr[j] > arr[j + 1]) {
          // Swap
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swapped = true;

          steps.push({
            arr: [...arr],
            comparing: [j, j + 1],
            sorted: [...sortedIndices],
            swapped: true,
            status: `Swapped! ${arr[j + 1]} > ${arr[j]}.`
          });
        }
      }
      sortedIndices.push(n - i - 1);
      steps.push({
        arr: [...arr],
        comparing: [],
        sorted: [...sortedIndices],
        status: `Element ${arr[n - i - 1]} at index ${n - i - 1} is now in its final sorted position.`
      });

      if (!swapped) break;
    }

    // Mark remaining
    for (let i = 0; i < n; i++) {
      if (!sortedIndices.includes(i)) sortedIndices.push(i);
    }
    steps.push({
      arr: [...arr],
      comparing: [],
      sorted: sortedIndices,
      status: '🎉 Array is fully sorted!'
    });
  }

  function render() {
    const step = steps[currentStep] || { arr: array, comparing: [], sorted: [], status: 'Ready' };

    let html = `<div style="display: flex; gap: 0.6rem; align-items: flex-end; height: 220px; width: 100%; justify-content: center; padding: 1rem 0;">`;

    step.arr.forEach((val, idx) => {
      const heightPx = Math.max(25, (val / 100) * 180);
      let bgColor = 'var(--bg-surface-elevated)';
      let borderColor = 'var(--border-color)';
      let textColor = 'var(--text-muted)';

      if (step.comparing.includes(idx)) {
        bgColor = step.swapped ? 'rgba(248, 81, 73, 0.3)' : 'rgba(77, 232, 240, 0.3)';
        borderColor = step.swapped ? 'var(--danger)' : 'var(--accent-cyan)';
        textColor = 'var(--accent-cyan)';
      } else if (step.sorted.includes(idx)) {
        bgColor = 'rgba(63, 185, 80, 0.2)';
        borderColor = 'var(--success)';
        textColor = 'var(--success)';
      }

      html += `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.4rem; flex: 1; max-width: 44px;">
          <div style="font-size: 0.75rem; font-family: var(--font-mono); color: ${textColor}; font-weight: 600;">${val}</div>
          <div style="
            width: 100%;
            height: ${heightPx}px;
            background: ${bgColor};
            border: 1.5px solid ${borderColor};
            border-radius: 6px 6px 2px 2px;
            transition: all 0.2s ease;
          "></div>
          <div style="font-size: 0.7rem; font-family: var(--font-mono); color: var(--text-dim);">[${idx}]</div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    const logElem = document.getElementById('sort-log');
    if (logElem) {
      logElem.textContent = `Step ${currentStep + 1}/${steps.length}: ${step.status}`;
    }
  }

  generateSteps();
  render();

  function play() {
    if (isPlaying) return;
    isPlaying = true;
    const playBtn = document.getElementById('sort-play-btn');
    if (playBtn) playBtn.textContent = 'Pause ⏸';

    intervalId = setInterval(() => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        render();
      } else {
        pause();
      }
    }, speed);
  }

  function pause() {
    isPlaying = false;
    if (intervalId) clearInterval(intervalId);
    const playBtn = document.getElementById('sort-play-btn');
    if (playBtn) playBtn.textContent = 'Play ▶';
  }

  const playBtn = document.getElementById('sort-play-btn');
  const prevBtn = document.getElementById('sort-prev-btn');
  const nextBtn = document.getElementById('sort-next-btn');
  const resetBtn = document.getElementById('sort-reset-btn');
  const speedSlider = document.getElementById('sort-speed-slider');

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (isPlaying) pause();
      else play();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      pause();
      if (currentStep < steps.length - 1) {
        currentStep++;
        render();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      pause();
      if (currentStep > 0) {
        currentStep--;
        render();
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      pause();
      currentStep = 0;
      render();
    });
  }

  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      speed = 1050 - parseInt(e.target.value, 10);
      if (isPlaying) {
        pause();
        play();
      }
    });
  }
};


/* ==========================================================================
   3. ARRAYS VISUALIZER
   ========================================================================== */
window.DSAVisualizers.initArrayDemo = function (containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let arr = [15, 28, 42, 67, 89];
  let highlightedIndex = -1;
  let animating = false;

  function render(message = 'Contiguous memory array.') {
    let html = `
      <div style="display: flex; gap: 0.6rem; justify-content: center; align-items: center; width: 100%; padding: 1rem 0; flex-wrap: wrap;">
    `;

    arr.forEach((val, idx) => {
      const isHighlight = idx === highlightedIndex;
      html += `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.3rem; transition: all 0.3s ease;">
          <div style="font-size: 0.7rem; font-family: var(--font-mono); color: var(--text-dim);">0x${(1000 + idx * 4).toString(16).toUpperCase()}</div>
          <div style="
            width: 56px;
            height: 56px;
            background: ${isHighlight ? 'rgba(77, 232, 240, 0.25)' : 'var(--bg-card)'};
            border: 2px solid ${isHighlight ? 'var(--accent-cyan)' : 'var(--border-color)'};
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-mono);
            font-weight: 700;
            color: ${isHighlight ? 'var(--accent-cyan)' : 'var(--text-main)'};
            box-shadow: ${isHighlight ? '0 0 14px var(--accent-cyan-glow)' : 'none'};
            transition: all 0.25s ease;
          ">
            ${val}
          </div>
          <div style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--accent-violet); font-weight: 600;">Index ${idx}</div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    const logElem = document.getElementById('array-log');
    if (logElem) logElem.textContent = message;
  }

  render();

  const insertBtn = document.getElementById('arr-insert-btn');
  const deleteBtn = document.getElementById('arr-delete-btn');
  const searchBtn = document.getElementById('arr-search-btn');
  const idxInput = document.getElementById('arr-idx-input');
  const valInput = document.getElementById('arr-val-input');

  if (insertBtn) {
    insertBtn.addEventListener('click', () => {
      if (animating) return;
      const idx = parseInt(idxInput?.value || '0', 10);
      const val = parseInt(valInput?.value || '99', 10);

      if (idx < 0 || idx > arr.length) {
        render(`⚠️ Index ${idx} out of bounds (0..${arr.length}).`);
        return;
      }

      animating = true;
      arr.splice(idx, 0, val);
      highlightedIndex = idx;
      render(`Inserted ${val} at index ${idx}. Elements shifted right O(n).`);

      setTimeout(() => {
        highlightedIndex = -1;
        render(`Array size: ${arr.length}.`);
        animating = false;
      }, 1200);
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      if (animating) return;
      const idx = parseInt(idxInput?.value || '0', 10);
      if (idx < 0 || idx >= arr.length) {
        render(`⚠️ Index ${idx} out of bounds (0..${arr.length - 1}).`);
        return;
      }

      animating = true;
      highlightedIndex = idx;
      const deletedVal = arr[idx];
      render(`Deleting element ${deletedVal} at index ${idx}...`);

      setTimeout(() => {
        arr.splice(idx, 1);
        highlightedIndex = -1;
        render(`Deleted element ${deletedVal}. Remaining elements shifted left O(n).`);
        animating = false;
      }, 800);
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      if (animating) return;
      const val = parseInt(valInput?.value || '42', 10);
      animating = true;
      let curr = 0;

      const interval = setInterval(() => {
        if (curr < arr.length) {
          highlightedIndex = curr;
          render(`Searching... Checking index ${curr} (${arr[curr]} == ${val}?)`);
          if (arr[curr] === val) {
            clearInterval(interval);
            render(`🎯 Found ${val} at index ${curr}!`);
            setTimeout(() => {
              highlightedIndex = -1;
              render();
              animating = false;
            }, 1500);
            return;
          }
          curr++;
        } else {
          clearInterval(interval);
          highlightedIndex = -1;
          render(`❌ Value ${val} not found in array.`);
          animating = false;
        }
      }, 600);
    });
  }
};


/* ==========================================================================
   4. LINKED LIST VISUALIZER
   ========================================================================== */
window.DSAVisualizers.initLinkedListDemo = function (containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let list = [12, 45, 78];
  let highlightedIndex = -1;

  function render(message = 'Singly Linked List chain.') {
    let html = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 0.4rem; width: 100%; overflow-x: auto; padding: 1.5rem 0;">
        <div style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-violet); font-size: 0.85rem; margin-right: 0.4rem;">HEAD →</div>
    `;

    list.forEach((val, idx) => {
      const isHighlight = idx === highlightedIndex;
      html += `
        <div style="
          display: flex;
          background: ${isHighlight ? 'rgba(77, 232, 240, 0.2)' : 'var(--bg-card)'};
          border: 2px solid ${isHighlight ? 'var(--accent-cyan)' : 'var(--border-color)'};
          border-radius: 10px;
          overflow: hidden;
          box-shadow: ${isHighlight ? '0 0 14px var(--accent-cyan-glow)' : 'none'};
          transition: all 0.25s ease;
        ">
          <div style="padding: 0.6rem 0.9rem; font-family: var(--font-mono); font-weight: 700; color: var(--text-main); border-right: 1px solid var(--border-color);">
            ${val}
          </div>
          <div style="padding: 0.6rem 0.6rem; font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-cyan); background: var(--bg-surface); display: flex; align-items: center;">
            •next
          </div>
        </div>
      `;

      if (idx < list.length - 1) {
        html += `<div style="color: var(--accent-cyan); font-weight: 700; font-family: var(--font-mono);">➔</div>`;
      }
    });

    html += `
        <div style="color: var(--accent-cyan); font-weight: 700; font-family: var(--font-mono);">➔</div>
        <div style="padding: 0.4rem 0.8rem; background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: 6px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-dim);">
          NULL
        </div>
      </div>
    `;

    container.innerHTML = html;

    const logElem = document.getElementById('ll-log');
    if (logElem) logElem.textContent = message;
  }

  render();

  const insertHeadBtn = document.getElementById('ll-insert-head-btn');
  const insertTailBtn = document.getElementById('ll-insert-tail-btn');
  const deleteHeadBtn = document.getElementById('ll-delete-head-btn');
  const searchBtn = document.getElementById('ll-search-btn');
  const valInput = document.getElementById('ll-val-input');

  if (insertHeadBtn) {
    insertHeadBtn.addEventListener('click', () => {
      const val = parseInt(valInput?.value || '99', 10);
      list.unshift(val);
      highlightedIndex = 0;
      render(`Inserted ${val} at Head. O(1) operation.`);
      setTimeout(() => { highlightedIndex = -1; render(); }, 1000);
    });
  }

  if (insertTailBtn) {
    insertTailBtn.addEventListener('click', () => {
      const val = parseInt(valInput?.value || '99', 10);
      list.push(val);
      highlightedIndex = list.length - 1;
      render(`Appended ${val} at Tail. O(n) without tail pointer, O(1) with tail pointer.`);
      setTimeout(() => { highlightedIndex = -1; render(); }, 1000);
    });
  }

  if (deleteHeadBtn) {
    deleteHeadBtn.addEventListener('click', () => {
      if (list.length === 0) {
        render('⚠️ List is empty!');
        return;
      }
      const removed = list.shift();
      render(`Removed Head element ${removed}. O(1) operation.`);
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const val = parseInt(valInput?.value || '45', 10);
      let curr = 0;
      const interval = setInterval(() => {
        if (curr < list.length) {
          highlightedIndex = curr;
          render(`Traversing pointer... Checking Node ${curr} (${list[curr]} == ${val}?)`);
          if (list[curr] === val) {
            clearInterval(interval);
            render(`🎯 Found Node ${curr} containing value ${val}!`);
            setTimeout(() => { highlightedIndex = -1; render(); }, 1500);
            return;
          }
          curr++;
        } else {
          clearInterval(interval);
          highlightedIndex = -1;
          render(`❌ Value ${val} not found in Linked List.`);
        }
      }, 600);
    });
  }
};


/* ==========================================================================
   5. STACKS & QUEUES VISUALIZER
   ========================================================================== */
window.DSAVisualizers.initStackQueueDemo = function (containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let mode = 'stack'; // 'stack' or 'queue'
  let items = [10, 20, 30];

  function render(message = '') {
    if (mode === 'stack') {
      renderStack(message || 'Stack (LIFO - Last In, First Out)');
    } else {
      renderQueue(message || 'Queue (FIFO - First In, First Out)');
    }
  }

  function renderStack(message) {
    let html = `
      <div style="display: flex; flex-direction: column-reverse; align-items: center; gap: 0.4rem; width: 180px; min-height: 220px; border: 3px solid var(--border-color); border-top: none; border-radius: 0 0 12px 12px; padding: 0.6rem; background: var(--bg-card);">
    `;

    items.forEach((val, idx) => {
      const isTop = idx === items.length - 1;
      html += `
        <div style="
          width: 100%;
          padding: 0.6rem 0;
          text-align: center;
          background: ${isTop ? 'rgba(77, 232, 240, 0.2)' : 'var(--bg-surface)'};
          border: 1.5px solid ${isTop ? 'var(--accent-cyan)' : 'var(--border-color)'};
          border-radius: 6px;
          font-family: var(--font-mono);
          font-weight: 700;
          color: ${isTop ? 'var(--accent-cyan)' : 'var(--text-main)'};
          transition: all 0.25s ease;
        ">
          ${val} ${isTop ? '<span style="font-size: 0.7rem; color: var(--accent-cyan);"> (TOP)</span>' : ''}
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    const logElem = document.getElementById('sq-log');
    if (logElem) logElem.textContent = message;
  }

  function renderQueue(message) {
    let html = `
      <div style="display: flex; align-items: center; gap: 0.4rem; width: 100%; max-width: 450px; min-height: 80px; border: 3px solid var(--border-color); border-left: none; border-right: none; padding: 0.6rem; background: var(--bg-card); justify-content: flex-start; overflow-x: auto;">
        <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-cyan); font-weight: 600;">FRONT ➔</div>
    `;

    items.forEach((val, idx) => {
      const isFront = idx === 0;
      const isRear = idx === items.length - 1;
      html += `
        <div style="
          min-width: 64px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${isFront ? 'rgba(77, 232, 240, 0.2)' : isRear ? 'rgba(157, 123, 255, 0.2)' : 'var(--bg-surface)'};
          border: 1.5px solid ${isFront ? 'var(--accent-cyan)' : isRear ? 'var(--accent-violet)' : 'var(--border-color)'};
          border-radius: 8px;
          font-family: var(--font-mono);
          font-weight: 700;
          color: ${isFront ? 'var(--accent-cyan)' : isRear ? 'var(--accent-violet)' : 'var(--text-main)'};
        ">
          ${val}
        </div>
      `;
    });

    html += `
        <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-violet); font-weight: 600;">➔ REAR</div>
      </div>
    `;
    container.innerHTML = html;

    const logElem = document.getElementById('sq-log');
    if (logElem) logElem.textContent = message;
  }

  render();

  const modeStackBtn = document.getElementById('sq-mode-stack');
  const modeQueueBtn = document.getElementById('sq-mode-queue');
  const action1Btn = document.getElementById('sq-action1-btn');
  const action2Btn = document.getElementById('sq-action2-btn');
  const valInput = document.getElementById('sq-val-input');

  if (modeStackBtn) {
    modeStackBtn.addEventListener('click', () => {
      mode = 'stack';
      modeStackBtn.classList.add('btn-primary');
      modeStackBtn.classList.remove('btn-secondary');
      if (modeQueueBtn) {
        modeQueueBtn.classList.add('btn-secondary');
        modeQueueBtn.classList.remove('btn-primary');
      }
      if (action1Btn) action1Btn.textContent = 'Push';
      if (action2Btn) action2Btn.textContent = 'Pop';
      render('Switched to Stack Mode (LIFO).');
    });
  }

  if (modeQueueBtn) {
    modeQueueBtn.addEventListener('click', () => {
      mode = 'queue';
      modeQueueBtn.classList.add('btn-primary');
      modeQueueBtn.classList.remove('btn-secondary');
      if (modeStackBtn) {
        modeStackBtn.classList.add('btn-secondary');
        modeStackBtn.classList.remove('btn-primary');
      }
      if (action1Btn) action1Btn.textContent = 'Enqueue';
      if (action2Btn) action2Btn.textContent = 'Dequeue';
      render('Switched to Queue Mode (FIFO).');
    });
  }

  if (action1Btn) {
    action1Btn.addEventListener('click', () => {
      const val = parseInt(valInput?.value || '50', 10);
      if (mode === 'stack') {
        items.push(val);
        render(`Pushed ${val} onto top of Stack. O(1).`);
      } else {
        items.push(val);
        render(`Enqueued ${val} at rear of Queue. O(1).`);
      }
    });
  }

  if (action2Btn) {
    action2Btn.addEventListener('click', () => {
      if (items.length === 0) {
        render('⚠️ Container is empty!');
        return;
      }
      if (mode === 'stack') {
        const popped = items.pop();
        render(`Popped ${popped} from top of Stack. O(1).`);
      } else {
        const dequeued = items.shift();
        render(`Dequeued ${dequeued} from front of Queue. O(1).`);
      }
    });
  }
};

<template>
  <div class="chips-bg"></div>
  <div class="chips-container">
    <!-- 1元筹码 -->
    <div
      class="chip-wrapper chip-wrapper-1"
      :class="{ 'chip-expanded': !isCollapsed, 'chip-collapsed': isCollapsed }"
      @click="selectChip(1)">
      <svg viewBox="0 0 78 78" class="chip chip-1">
        <g>
          <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
          <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
          <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
          <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
        </g>
        <text class="chip-value chip-value-normal" x="50%" y="50%">1</text>
      </svg>
    </div>

    <!-- 2元筹码 -->
    <div
      class="chip-wrapper chip-wrapper-2"
      :class="{ 'chip-expanded': !isCollapsed, 'chip-collapsed': isCollapsed }"
      @click="selectChip(2)">
      <svg viewBox="0 0 78 78" class="chip chip-2">
        <g>
          <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
          <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
          <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
          <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
        </g>
        <text class="chip-value chip-value-normal" x="50%" y="50%">2</text>
      </svg>
    </div>

    <!-- 5元筹码 -->
    <div
      class="chip-wrapper chip-wrapper-5"
      :class="{ 'chip-expanded': !isCollapsed, 'chip-collapsed': isCollapsed }"
      @click="selectChip(5)">
      <svg viewBox="0 0 78 78" class="chip chip-5">
        <g>
          <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
          <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
          <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
          <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
        </g>
        <text class="chip-value chip-value-normal" x="50%" y="50%">5</text>
      </svg>
    </div>

    <!-- 25元筹码 -->
    <div
      class="chip-wrapper chip-wrapper-25"
      :class="{ 'chip-expanded': !isCollapsed, 'chip-collapsed': isCollapsed }"
      @click="selectChip(25)">
      <svg viewBox="0 0 78 78" class="chip chip-25">
        <g>
          <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
          <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
          <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
          <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
        </g>
        <text class="chip-value chip-value-normal" x="50%" y="50%">25</text>
      </svg>
    </div>

    <!-- 100元筹码 -->
    <div
      class="chip-wrapper chip-wrapper-100"
      :class="{ 'chip-expanded': !isCollapsed, 'chip-collapsed': isCollapsed }"
      @click="selectChip(100)">
      <svg viewBox="0 0 78 78" class="chip chip-100">
        <g>
          <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
          <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
          <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
          <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
        </g>
        <text class="chip-value chip-value-small" x="50%" y="50%">100</text>
      </svg>
    </div>

    <!-- 500元筹码 -->
    <div
      class="chip-wrapper chip-wrapper-500"
      :class="{ 'chip-expanded': !isCollapsed, 'chip-collapsed': isCollapsed }"
      @click="selectChip(500)">
      <svg viewBox="0 0 78 78" class="chip chip-500">
        <g>
          <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
          <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
          <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
          <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
        </g>
        <text class="chip-value chip-value-small" x="50%" y="50%">500</text>
      </svg>
    </div>

    <!-- 1000元筹码 -->
    <div
      class="chip-wrapper chip-wrapper-1000"
      :class="{ 'chip-expanded': !isCollapsed, 'chip-collapsed': isCollapsed }"
      @click="selectChip(1000)">
      <svg viewBox="0 0 78 78" class="chip chip-1000">
        <g>
          <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
          <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
          <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
          <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
        </g>
        <text class="chip-value chip-value-small-more" x="50%" y="50%">1K</text>
      </svg>
    </div>

    <!-- 收银台 - 新样式 -->
    <div
      class="chip-wrapper chip-wrapper-cashier cashier-button"
      :class="{ 'chip-expanded': !isCollapsed, 'chip-collapsed': isCollapsed }"
      @click="handleCashier"
      data-role="cashier-button">
      <div class="cashier-button-up" data-role="chip-stack-cashier">
        <div class="button-inner">
          <svg viewBox="0 0 100 100" class="iconWrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon" height="75%" width="75%" x="12.5%" y="12.5%">
              <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm2.77 8.02-.36 1.51H9.16v.83h5.13l-.36 1.51H9.35c.25.88.72 1.51 1.43 1.94.56.31 1.18.47 1.86.47.93 0 1.65-.22 2.12-.66l.42-.39v2.25l-.15.06c-.73.31-1.5.47-2.27.47-2.51 0-4.16-.94-5.05-2.88a6.39 6.39 0 0 1-.39-1.19H5.99l.36-1.51h.79v-.83H6.05l.36-1.51h.9c.35-1.52 1.25-2.69 2.62-3.38.87-.46 1.86-.7 2.94-.7.98 0 1.88.22 2.6.65l.17.1-.52 1.76-.29-.22a3.26 3.26 0 0 0-2.02-.68c-.81 0-1.5.19-2.09.57-.31.19-.59.48-.89.94-.2.3-.35.61-.44.9h5.37l.01-.01Z" fill="white"></path>
            </svg>
          </svg>
        </div>
        <div class="title">
          <span class="text">CASHIER</span>
        </div>
      </div>
    </div>

    <!-- 选中的筹码圆环 - 始终显示在最上层 -->
    <div class="chip-wrapper chip-wrapper-select" :class="`select-${selectedChip}`" @click="toggleExpand">
      <svg viewBox="0 0 78 78" class="chip" :class="`chip-${selectedChip}`" style="width: 40px; height: 40px;">
        <g>
          <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
          <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
          <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
          <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
        </g>
        <text class="chip-value" :class="getChipValueClass(selectedChip)" x="50%" y="50%">{{ getChipText(selectedChip) }}</text>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBettingStore } from '@/stores/bettingStore'
import { useoverLayerStore } from '@/stores/overLayerStore'

// 获取 Store 实例
const bettingStore = useBettingStore()
const overLayerStore = useoverLayerStore()

// 本地状态
const selectedChip = ref(100) // 用于显示
const isCollapsed = ref(true) // 保留动画状态

// 选择筹码 - 修改后的方法
const selectChip = (value: number) => {
  // 1. 更新本地选中状态（用于显示）
  selectedChip.value = value

  // 2. 更新 bettingStore 的默认筹码
  bettingStore.selectChip(value)

  // 3. 先执行收起动画
  isCollapsed.value = true

  // 4. 动画完成后关闭层（CSS transition 约 0.6s）
  setTimeout(() => {
    overLayerStore.close()
  }, 600) // 等待动画完成
}

// 切换展开/收起状态 - 保持不变
const toggleExpand = () => {
  isCollapsed.value = !isCollapsed.value
}

// 处理收银台按钮 - 修改后的方法
const handleCashier = () => {
  // 1. 先执行收起动画
  isCollapsed.value = true

  // 2. 动画完成后切换层
  setTimeout(() => {
    overLayerStore.close()
    // 短暂延迟后打开收银台
    setTimeout(() => {
      overLayerStore.open('cashier')
    }, 50)
  }, 600) // 等待动画完成
}

// 辅助函数 - 保持不变
const getChipText = (value: number) => {
  if (value === 1000) return '1K'
  return value.toString()
}

const getChipValueClass = (value: number) => {
  if (value >= 100 && value < 1000) return 'chip-value-small'
  if (value >= 1000) return 'chip-value-small-more'
  return 'chip-value-normal'
}

// 组件挂载时的初始化 - 修改后
onMounted(() => {
  // 从 bettingStore 读取当前选中的筹码
  selectedChip.value = bettingStore.selectedChip

  // 延迟展开动画
  setTimeout(() => {
    isCollapsed.value = false
  }, 300)
})
</script>

<style scoped>
.chips-bg {
  height: 30%;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 1;
  /* 添加从上到下的渐变：顶部透明，底部不透明 */
  background: linear-gradient(
    to bottom,
    transparent 0%,              /* 顶部完全透明 */
    rgba(0, 0, 0, 0.2) 20%,     /* 20%位置轻微可见 */
    rgba(0, 0, 0, 0.5) 50%,     /* 中间半透明 */
    rgba(0, 0, 0, 0.8) 80%,     /* 80%位置接近不透明 */
    rgba(0, 0, 0, 1) 100%       /* 底部完全不透明 */
  );
}
/* 样式部分保持不变 */
.chips-container {
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  height: 170px;
  width: 170px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 19px;
}

.chip-wrapper {
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  cursor: pointer;
  background-color: #ffffff;
  border-radius: 50%;
  height: 36px;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 初始状态：所有筹码在中心位置（包括收银台） */
.chip-wrapper-1,
.chip-wrapper-2,
.chip-wrapper-5,
.chip-wrapper-25,
.chip-wrapper-100,
.chip-wrapper-500,
.chip-wrapper-1000 {
  /* 初始位置在中心 */
  transform: translateX(-30px) translateY(10px);
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 收银台按钮初始状态 */
.chip-wrapper-cashier {
  transform: translateX(-30px) translateY(10px);
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  width: 36px;
  height: 36px;
  background:none;
}

/* 展开状态：筹码飞到各自位置 */
.chip-wrapper-1.chip-expanded {
  transform: translateX(-95px) translateY(50px);
  opacity: 1;
}
.chip-wrapper-2.chip-expanded {
  transform: translateX(-90px) translateY(10px);
  opacity: 1;
}
.chip-wrapper-5.chip-expanded {
  transform: translateX(-70px) translateY(-25px);
  opacity: 1;
}
.chip-wrapper-25.chip-expanded {
  transform: translateX(-38px) translateY(-50px);
  opacity: 1;
}
.chip-wrapper-100.chip-expanded {
  transform: translateX(3px) translateY(-50px);
  opacity: 1;
}
.chip-wrapper-500.chip-expanded {
  transform: translateX(35px) translateY(-25px);
  opacity: 1;
}
.chip-wrapper-1000.chip-expanded {
  transform: translateX(55px) translateY(10px);
  opacity: 1;
}
.chip-wrapper-cashier.chip-expanded {
  transform: translateX(60px) translateY(65px);
  opacity: 1;
}

/* 收起状态：筹码回到中心并隐藏 */
.chip-collapsed {
  transform: translateX(-30px) translateY(10px) !important;
  opacity: 0 !important;
  pointer-events: none;
  z-index: 1;
}

/* 收银台按钮特殊样式 */
.chip-wrapper-cashier {
  width: 36px;
  height: 36px;
}

.cashier-button-up {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.button-inner {
  width: 36px;
  height: 36px;
  background: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.iconWrapper {
  height: 100%;
  width: 100%;
}

.icon {
  opacity: 80%;
}

.title {
  margin-top: 2px;
}

.text {
  font-size: 8px;
  color: #999;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* 选中的筹码圆环 - 始终显示在最上层 */
.chip-wrapper-select {
  border: 3px solid sandybrown;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  transform: translateX(-30px) translateY(10px) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 100 !important;
  cursor: pointer;
}

.chip {
  width: 36px;
  height: 36px;
  margin: 0 auto;
}

.chip-outer {
  opacity: 0.1;
}

.chip-value {
  fill: #ffffff;
  font-weight: bold;
  text-anchor: middle;
  dominant-baseline: central;
}

/* 字体大小 */
.chip-value-normal {
  font-size: 36px;
}

.chip-value-small {
  font-size: 26px;
}

.chip-value-small-more {
  font-size: 24px;
}

/* 筹码颜色 */
.chip-1 .chip-outer { fill: #808080; }
.chip-1 .chip-border { fill: #808080; }
.chip-1 .chip-center { fill: #808080; stroke: #808080; }

.chip-2 .chip-outer { fill: #FF69B4; }
.chip-2 .chip-border { fill: #FF69B4; }
.chip-2 .chip-center { fill: #FF69B4; stroke: #FF69B4; }

.chip-5 .chip-outer { fill: #DC143C; }
.chip-5 .chip-border { fill: #DC143C; }
.chip-5 .chip-center { fill: #DC143C; stroke: #DC143C; }

.chip-25 .chip-outer { fill: #228B22; }
.chip-25 .chip-border { fill: #228B22; }
.chip-25 .chip-center { fill: #228B22; stroke: #228B22; }

.chip-100 .chip-outer { fill: #1a1a1a; }
.chip-100 .chip-border { fill: #1a1a1a; }
.chip-100 .chip-center { fill: #1a1a1a; stroke: #1a1a1a; }

.chip-500 .chip-outer { fill: #8B008B; }
.chip-500 .chip-border { fill: #8B008B; }
.chip-500 .chip-center { fill: #8B008B; stroke: #8B008B; }

.chip-1000 .chip-outer { fill: #FFA500; }
.chip-1000 .chip-border { fill: #FFA500; }
.chip-1000 .chip-center { fill: #FFA500; stroke: #FFA500; }

.chip-center {
  stroke-width: 0.5;
}
</style>

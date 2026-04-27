/* 学习相关组件 */
(function() {
  var comps = {};
  var store = TCM.store;

  /* ===== FlashcardMode ===== */
  comps.FlashcardMode = {
    template: '\
      <div class="flashcard-view">\
        <div class="flashcard-mode-select">\
          <button v-for="m in modes" :key="m.key" class="mode-btn" \
            :class="{ active: currentMode === m.key }" @click="switchMode(m.key)">\
            {{ m.label }}\
          </button>\
        </div>\
        <div v-if="cards.length === 0" class="empty-state">\
          <div class="empty-icon">📭</div>\
          <div class="empty-title">暂无卡片</div>\
          <div class="empty-desc">请先选择学习模式</div>\
        </div>\
        <template v-else>\
          <div class="flashcard-progress">\
            {{ currentIndex + 1 }} / {{ cards.length }}\
            <div class="progress-bar"><div class="progress-fill" :style="{ width: progressPct + \'%\' }"></div></div>\
          </div>\
          <div class="flashcard-container" @click="flipCard">\
            <div class="flashcard" :class="{ flipped: isFlipped }">\
              <div class="flashcard-face front">\
                <span class="card-badge">{{ currentHerb.category }}</span>\
                <div class="card-name">{{ currentHerb.name }}</div>\
              </div>\
              <div class="flashcard-face back">\
                <div class="card-effects">\
                  <div v-for="e in currentHerb.effects" :key="e" class="effect-item">• {{ e }}</div>\
                </div>\
                <div v-if="currentHerb.memoryTip" class="card-tip">{{ currentHerb.memoryTip }}</div>\
              </div>\
            </div>\
          </div>\
          <div class="flashcard-hint">点击卡片翻转</div>\
          <div class="flashcard-controls">\
            <button class="ctrl-btn" @click="prevCard" :disabled="currentIndex === 0">◀</button>\
            <button class="ctrl-btn primary" @click="flipCard">🔄</button>\
            <button class="ctrl-btn" @click="nextCard" :disabled="currentIndex >= cards.length - 1">▶</button>\
          </div>\
          <div class="flashcard-actions">\
            <button class="action-btn fav-btn" :class="{ active: currentHerb.isFavorite }" \
              @click="toggleFav">\
              {{ currentHerb.isFavorite ? \'★\' : \'☆\' }} 错题本\
            </button>\
            <button class="action-btn" style="background:var(--color-primary-bg);color:var(--color-primary-dark);" @click="markLearned">\
              ✓ 已掌握\
            </button>\
          </div>\
        </template>\
      </div>',
    data: function() {
      return {
        modes: [
          { key: 'all', label: '全部药材' },
          { key: 'category', label: '按分类' },
          { key: 'difficulty', label: '按难度' },
          { key: 'favorites', label: '错题本' }
        ],
        currentMode: 'all',
        cards: [],
        currentIndex: 0,
        isFlipped: false,
        categoryIndex: 0
      };
    },
    computed: {
      currentHerb: function() {
        return this.cards[this.currentIndex] || { name: '', effects: [], category: '' };
      },
      progressPct: function() {
        return this.cards.length ? ((this.currentIndex + 1) / this.cards.length) * 100 : 0;
      }
    },
    watch: {
      currentIndex: function() { this.isFlipped = false; }
    },
    mounted: function() { this.switchMode('all'); },
    methods: {
      switchMode: function(mode) {
        this.currentMode = mode;
        this.isFlipped = false;
        this.currentIndex = 0;
        var all = store.state.herbs;
        if (mode === 'all') {
          this.cards = all.slice();
        } else if (mode === 'favorites') {
          this.cards = store.getFavoriteHerbs();
        } else if (mode === 'difficulty') {
          this.cards = all.slice().sort(function(a, b) {
            var order = { easy: 0, medium: 1, hard: 2 };
            return order[a.difficulty] - order[b.difficulty];
          });
        } else if (mode === 'category') {
          this.cards = all.slice().sort(function(a, b) {
            if (a.category < b.category) return -1;
            if (a.category > b.category) return 1;
            return 0;
          });
        }
      },
      prevCard: function() {
        if (this.currentIndex > 0) this.currentIndex--;
      },
      nextCard: function() {
        if (this.currentIndex < this.cards.length - 1) this.currentIndex++;
      },
      flipCard: function() { this.isFlipped = !this.isFlipped; },
      toggleFav: function() { store.toggleFavorite(this.currentHerb.id); },
      markLearned: function() {
        store.updateReviewDate(this.currentHerb.id);
        store.notify('已记录学习进度', 'success');
      }
    }
  };

  /* ===== ComparisonView ===== */
  comps.ComparisonView = {
    template: '\
      <div class="comparison-view">\
        <div v-for="g in groups" :key="g.id" class="comparison-group">\
          <div class="group-header" @click="toggleGroup(g.id)">\
            <span class="group-arrow" :class="{ open: openGroups[g.id] }">▶</span>\
            <div>\
              <div class="group-title">{{ g.name }}</div>\
              <div class="group-common">同：{{ g.common }}</div>\
            </div>\
          </div>\
          <div v-show="openGroups[g.id]" class="group-body">\
            <div class="common-points">📌 共同点：{{ g.common }}</div>\
            <table class="diff-table">\
              <tr v-for="d in g.diff" :key="d.herb">\
                <td class="diff-herb">{{ d.herb }}</td>\
                <td class="diff-detail">{{ d.points }}</td>\
              </tr>\
            </table>\
            <div v-if="g.mnemonic" class="group-mnemonic">💡 {{ g.mnemonic }}</div>\
          </div>\
        </div>\
      </div>',
    data: function() {
      return { openGroups: {} };
    },
    computed: {
      groups: function() { return TCM.memoryGroups; }
    },
    methods: {
      toggleGroup: function(id) {
        this.openGroups[id] = !this.openGroups[id];
      }
    }
  };

  /* ===== MnemonicView ===== */
  comps.MnemonicView = {
    template: '\
      <div class="mnemonic-view">\
        <div v-for="m in mnemonics" :key="m.herbId" class="mnemonic-card">\
          <div class="mnemonic-herb">\
            <router-link :to="\'/herb/\' + m.herbId">{{ m.herbName }}</router-link>\
          </div>\
          <div class="mnemonic-keywords">关键词：{{ m.keywords }}</div>\
          <div class="mnemonic-text">{{ m.full }}</div>\
        </div>\
      </div>',
    computed: {
      mnemonics: function() { return TCM.mnemonics; }
    }
  };

  /* ===== HerbPairView ===== */
  comps.HerbPairView = {
    template: '\
      <div class="pair-view">\
        <div v-for="p in pairs" :key="p.id" class="pair-card">\
          <div class="pair-name">{{ p.pairName }}</div>\
          <div class="pair-effect">💊 {{ p.effect }}</div>\
          <div class="pair-formula">📜 代表方剂：{{ p.formula }}</div>\
          <div style="font-size:13px;color:var(--color-text-secondary);margin-top:8px;">\
            {{ p.description }}\
          </div>\
        </div>\
      </div>',
    computed: {
      pairs: function() { return TCM.herbPairs; }
    }
  };

  TCM.components = TCM.components || {};
  Object.keys(comps).forEach(function(k) { TCM.components[k] = comps[k]; });
})();

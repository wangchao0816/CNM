/* 测验和错题本组件 */
(function() {
  var comps = {};
  var store = TCM.store;

  /* ===== QuizMode ===== */
  comps.QuizMode = {
    template: '\
      <div class="quiz-view">\
        <div v-if="!started" class="quiz-mode-select">\
          <h2>自我测验</h2>\
          <p>选择测验模式，检验学习成果</p>\
          <div class="quiz-mode-grid">\
            <div v-for="m in modeOptions" :key="m.key" class="quiz-mode-card" @click="startQuiz(m.key)">\
              <div class="mode-icon">{{ m.icon }}</div>\
              <div class="mode-label">{{ m.label }}</div>\
              <div class="mode-desc">{{ m.desc }}</div>\
            </div>\
          </div>\
        </div>\
        <div v-else-if="finished" class="quiz-result">\
          <div class="result-score">{{ score }}/{{ total }}</div>\
          <div class="result-detail">\
            <span class="r-correct">✓ 正确 {{ correctCount }}</span> · \
            <span class="r-wrong">✗ 错误 {{ total - correctCount }}</span>\
          </div>\
          <div class="result-actions">\
            <button class="r-btn primary" @click="retryWrong">重新测试错题</button>\
            <button class="r-btn secondary" @click="resetQuiz">返回首页</button>\
          </div>\
        </div>\
        <div v-else class="quiz-question">\
          <div class="q-progress">\
            第 {{ currentIdx + 1 }} / {{ total }} 题\
            <div class="q-bar"><div class="q-fill" :style="{ width: ((currentIdx + 1) / total) * 100 + \'%\' }"></div></div>\
          </div>\
          <div class="q-text">{{ currentQ.text }}</div>\
          <div class="q-options">\
            <button v-for="(opt, i) in currentQ.options" :key="i" class="q-option" \
              :class="{ selected: selectedAnswer === opt.herbId, \
                        correct: answered && opt.herbId === currentQ.correctId, \
                        wrong: answered && selectedAnswer === opt.herbId && opt.herbId !== currentQ.correctId }" \
              @click="selectAnswer(opt.herbId)" :disabled="answered">\
              {{ opt.label }}\
            </button>\
          </div>\
          <div v-if="answered" class="q-feedback" :class="lastCorrect ? \'correct\' : \'wrong\'">\
            {{ lastCorrect ? \'✓ 回答正确！\' : \'✗ 正确答案是：\' + currentQ.correctName }}\
          </div>\
        </div>\
      </div>',
    data: function() {
      return {
        modeOptions: [
          { key: 'quick', label: '快速测验', desc: '5 道题', icon: '⚡' },
          { key: 'standard', label: '标准测验', desc: '10 道题', icon: '📝' },
          { key: 'favorites', label: '错题专项', desc: '错题本中的药材', icon: '📕' },
          { key: 'all', label: '全部药材', desc: '所有药材随机出题', icon: '🌿' }
        ],
        started: false,
        finished: false,
        questions: [],
        currentIdx: 0,
        selectedAnswer: null,
        answered: false,
        lastCorrect: false,
        correctCount: 0,
        wrongIds: []
      };
    },
    computed: {
      total: function() { return this.questions.length; },
      currentQ: function() { return this.questions[this.currentIdx] || { text: '', options: [] }; },
      score: function() { return this.correctCount; }
    },
    methods: {
      startQuiz: function(mode) {
        this.started = true;
        this.finished = false;
        this.currentIdx = 0;
        this.correctCount = 0;
        this.wrongIds = [];
        this.selectedAnswer = null;
        this.answered = false;

        var pool = store.state.herbs;
        var count = 5;
        if (mode === 'quick') count = 5;
        else if (mode === 'standard') count = 10;
        else if (mode === 'all') count = 15;
        else if (mode === 'favorites') {
          pool = store.getFavoriteHerbs();
          count = Math.min(pool.length, 10);
        }

        this.questions = TCM.quizEngine.generateQuiz(pool, count);
      },
      selectAnswer: function(herbId) {
        if (this.answered) return;
        this.selectedAnswer = herbId;
        this.answered = true;
        var result = TCM.quizEngine.checkAnswer(this.currentQ, herbId);
        this.lastCorrect = result.correct;
        if (result.correct) {
          this.correctCount++;
        } else {
          this.wrongIds.push(result.correctId);
          store.recordMistake(result.correctId);
        }
        var self = this;
        setTimeout(function() { self.nextQuestion(); }, 1500);
      },
      nextQuestion: function() {
        if (this.currentIdx < this.questions.length - 1) {
          this.currentIdx++;
          this.selectedAnswer = null;
          this.answered = false;
        } else {
          this.finished = true;
        }
      },
      retryWrong: function() {
        if (this.wrongIds.length === 0) {
          store.notify('没有错题，太棒了！', 'success');
          this.resetQuiz();
          return;
        }
        var wrongHerbs = this.wrongIds.map(function(id) { return store.getHerbById(id); }).filter(Boolean);
        this.questions = TCM.quizEngine.generateQuiz(wrongHerbs, Math.min(wrongHerbs.length, 5));
        this.currentIdx = 0;
        this.correctCount = 0;
        this.wrongIds = [];
        this.selectedAnswer = null;
        this.answered = false;
        this.finished = false;
      },
      resetQuiz: function() {
        this.started = false;
        this.finished = false;
        this.questions = [];
      }
    }
  };

  /* ===== ErrorBook ===== */
  comps.ErrorBook = {
    template: '\
      <div class="error-book">\
        <div class="book-tabs">\
          <button v-for="t in tabs" :key="t.key" class="book-tab" \
            :class="{ active: currentTab === t.key }" @click="currentTab = t.key">\
            {{ t.label }}\
          </button>\
        </div>\
        <div v-if="filteredHerbs.length === 0" class="book-empty">\
          <div class="empty-icon">{{ currentTab === \'all\' ? \'📭\' : \'🎉\' }}</div>\
          <div class="empty-text">\
            <template v-if="currentTab === \'all\'">还没有收藏药材<br>在学习中点击 ☆ 收藏到错题本</template>\
            <template v-else>没有符合条件的药材</template>\
          </div>\
        </div>\
        <div v-else>\
          <herb-card v-for="h in filteredHerbs" :key="h.id" :herb="h"></herb-card>\
          <div class="book-actions">\
            <button class="book-btn primary" @click="reviewAll">📖 开始复习</button>\
            <button class="book-btn danger" @click="clearAll">🗑 清空错题本</button>\
          </div>\
        </div>\
      </div>',
    data: function() {
      return {
        tabs: [
          { key: 'all', label: '全部收藏' },
          { key: 'weak', label: '掌握薄弱（≥3次错误）' },
          { key: 'recent', label: '近期复习' }
        ],
        currentTab: 'all'
      };
    },
    computed: {
      filteredHerbs: function() {
        var herbs = store.getFavoriteHerbs();
        if (this.currentTab === 'weak') {
          return herbs.filter(function(h) { return h.mistakeCount >= 3; });
        }
        if (this.currentTab === 'recent') {
          return herbs.filter(function(h) { return h.lastReviewed; })
            .sort(function(a, b) { return (b.lastReviewed || '') > (a.lastReviewed || '') ? 1 : -1; });
        }
        return herbs.sort(function(a, b) { return b.mistakeCount - a.mistakeCount; });
      }
    },
    methods: {
      reviewAll: function() { this.$router.push('/flashcard'); },
      clearAll: function() {
        var self = this;
        var herbs = store.getFavoriteHerbs();
        herbs.forEach(function(h) {
          if (h.isFavorite) store.toggleFavorite(h.id);
        });
        store.notify('已清空错题本', 'info');
      }
    }
  };

  TCM.components = TCM.components || {};
  Object.keys(comps).forEach(function(k) { TCM.components[k] = comps[k]; });
})();

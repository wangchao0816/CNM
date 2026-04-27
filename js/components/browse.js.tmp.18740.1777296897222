/* 浏览相关组件 */
(function() {
  var comps = {};
  var store = TCM.store;

  /* ===== CategoryBrowse ===== */
  comps.CategoryBrowse = {
    template: '\
      <div class="browse-view">\
        <div class="search-bar">\
          <span class="search-icon">🔍</span>\
          <input v-model="query" placeholder="搜索药名或功效..." @input="onSearch">\
        </div>\
        <div v-if="searchResults.length > 0" class="search-results">\
          <herb-card v-for="h in searchResults" :key="h.id" :herb="h"></herb-card>\
        </div>\
        <div v-else>\
          <div v-for="(cat, cIdx) in categories" :key="cat.name" class="category-section">\
            <div class="category-header" @click="toggleCat(cat.name)">\
              <span class="cat-icon" :class="\'cat-icon-\' + (cIdx % 13)">{{ catIcon(cIdx) }}</span>\
              <span class="cat-name">{{ cat.name }}</span>\
              <span class="cat-count">{{ cat.count }}/{{ cat.total }} 味</span>\
              <span class="cat-arrow" :class="{ open: openCats[cat.name] }">▼</span>\
            </div>\
            <div v-show="openCats[cat.name]" class="sub-category" v-for="(herbs, sub) in cat.subs" :key="sub">\
              <div class="sub-cat-title">{{ sub }}</div>\
              <div class="herb-tag-list">\
                <span v-for="h in herbs" :key="h.id" class="herb-tag" @click="goHerb(h.id)">\
                  <span v-if="h.isFavorite" class="tag-fav">★</span>\
                  {{ h.name }}\
                </span>\
              </div>\
            </div>\
          </div>\
        </div>\
        <div style="margin:20px 16px;display:flex;gap:10px;">\
          <router-link to="/mnemonics" class="herb-tag" style="flex:1;justify-content:center;background:var(--color-accent-light);color:var(--color-accent);">💡 联想口诀</router-link>\
          <router-link to="/pairs" class="herb-tag" style="flex:1;justify-content:center;background:var(--color-primary-bg);color:var(--color-primary-dark);">🤝 药对配伍</router-link>\
        </div>\
      </div>',
    data: function() {
      return {
        query: '',
        searchResults: [],
        openCats: {}
      };
    },
    computed: {
      categories: function() {
        var tree = {};
        store.state.herbs.forEach(function(h) {
          if (!tree[h.category]) tree[h.category] = { name: h.category, subs: {}, total: 0, count: 0 };
          if (!tree[h.category].subs[h.subCategory]) tree[h.category].subs[h.subCategory] = [];
          tree[h.category].subs[h.subCategory].push(h);
          tree[h.category].total++;
          if (h.mistakeCount > 0 || h.isFavorite) tree[h.category].count++;
        });
        return Object.keys(tree).map(function(k) { return tree[k]; });
      }
    },
    mounted: function() {
      var self = this;
      store.state.herbs.forEach(function(h) { self.openCats[h.category] = false; });
    },
    methods: {
      catIcon: function(i) { return ['🌿','🔥','💊','🌊','🌾','💧','🔥','🌀','🍚','🩸','💉','🌬️','⚕️'][i % 13]; },
      toggleCat: function(name) { this.openCats[name] = !this.openCats[name]; },
      goHerb: function(id) { this.$router.push('/herb/' + id); },
      onSearch: function() {
        if (!this.query) { this.searchResults = []; return; }
        this.searchResults = store.searchHerbs(this.query);
      }
    }
  };

  /* ===== HerbCard ===== */
  comps.HerbCard = {
    props: ['herb'],
    template: '\
      <div class="herb-card" @click="goDetail">\
        <div class="card-header">\
          <span class="herb-name">{{ herb.name }}</span>\
          <span class="herb-badge">{{ herb.category }}</span>\
        </div>\
        <div class="herb-effects">\
          <span v-for="e in herb.effects" :key="e" class="effect-tag">{{ e }}</span>\
        </div>\
      </div>',
    methods: {
      goDetail: function() { this.$router.push('/herb/' + this.herb.id); }
    }
  };

  /* ===== HerbDetail ===== */
  comps.HerbDetail = {
    template: '\
      <div class="herb-detail">\
        <div class="detail-hero">\
          <h1>{{ herb.name }}</h1>\
          <div class="detail-sub">{{ herb.category }} · {{ herb.subCategory }}</div>\
        </div>\
        <div class="detail-body">\
          <div class="detail-section" v-if="herb.effects && herb.effects.length">\
            <h3>功效</h3>\
            <div class="effect-list">\
              <span v-for="e in herb.effects" :key="e" class="effect-item">{{ e }}</span>\
            </div>\
          </div>\
          <div class="detail-section" v-if="herb.memoryTip">\
            <h3>记忆口诀</h3>\
            <div class="memory-tip-box" v-html="highlightKeywords(herb.memoryTip)"></div>\
          </div>\
          <div class="detail-section" v-if="herb.similarHerbs && herb.similarHerbs.length">\
            <h3>相似药材</h3>\
            <div>\
              <span v-for="sid in herb.similarHerbs" :key="sid" class="similar-link" @click="goHerb(sid)">\
                {{ getHerbName(sid) }}\
              </span>\
            </div>\
          </div>\
        </div>\
        <div class="detail-actions">\
          <button class="btn btn-fav" :class="{ active: herb.isFavorite }" @click="toggleFav">\
            {{ herb.isFavorite ? \'★ 已收藏\' : \'☆ 收藏\' }}\
          </button>\
          <button class="btn btn-study" @click="startStudy">📖 开始学习</button>\
        </div>\
      </div>',
    computed: {
      herb: function() {
        return store.getHerbById(this.$route.params.id) || { name: '未找到', effects: [] };
      }
    },
    methods: {
      toggleFav: function() { store.toggleFavorite(this.herb.id); },
      goHerb: function(id) { this.$router.push('/herb/' + id); },
      getHerbName: function(id) { var h = store.getHerbById(id); return h ? h.name : ''; },
      startStudy: function() { this.$router.push('/flashcard'); },
      highlightKeywords: function(text) {
        if (!text) return '';
        return text.replace(/——/g, '<br>');
      }
    }
  };

  TCM.components = TCM.components || {};
  Object.keys(comps).forEach(function(k) { TCM.components[k] = comps[k]; });
})();

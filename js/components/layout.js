/* 布局组件 */
(function() {
  var comps = {};

  /* ===== AppHeader ===== */
  comps.AppHeader = {
    template: '\
      <header class="app-header">\
        <button class="header-back" v-if="showBack" @click="goBack">‹</button>\
        <div class="header-title">{{ title }}</div>\
      </header>',
    computed: {
      title: function() { return this.$route.meta.title || '中药记忆大师'; },
      showBack: function() {
        var name = this.$route.name;
        return name === 'herb-detail' || name === 'mnemonics' || name === 'pairs';
      }
    },
    methods: {
      goBack: function() { this.$router.back(); }
    }
  };

  /* ===== AppTabBar ===== */
  comps.AppTabBar = {
    template: '\
      <nav class="app-tab-bar" v-if="showTabs">\
        <router-link v-for="t in tabs" :key="t.path" :to="t.path" \
          class="tab-item" :class="{ active: isActive(t.path) }">\
          <span class="tab-icon">{{ t.icon }}</span>\
          <span class="tab-label">{{ t.label }}</span>\
        </router-link>\
      </nav>',
    data: function() {
      return {
        tabs: [
          { path: '/browse', label: '分类浏览', icon: '🌿' },
          { path: '/flashcard', label: '记忆卡片', icon: '🃏' },
          { path: '/comparison', label: '对比记忆', icon: '📊' },
          { path: '/quiz', label: '自我测验', icon: '✍️' },
          { path: '/notebook', label: '错题本', icon: '📕' }
        ]
      };
    },
    computed: {
      showTabs: function() {
        var name = this.$route.name;
        return name !== 'herb-detail' && name !== 'mnemonics' && name !== 'pairs';
      }
    },
    methods: {
      isActive: function(path) {
        return this.$route.path === path;
      }
    }
  };

  /* ===== Notification ===== */
  comps.Notification = {
    template: '\
      <div class="notification-container" v-if="notif">\
        <div class="notification" :class="[notif.type, { \'fade-out\': notif.fade }]">\
          {{ notif.msg }}\
        </div>\
      </div>',
    computed: {
      notif: function() { return TCM.store.state.notification; }
    }
  };

  TCM.components = TCM.components || {};
  Object.keys(comps).forEach(function(k) { TCM.components[k] = comps[k]; });
})();

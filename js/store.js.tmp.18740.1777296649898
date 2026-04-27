/* 中心响应式状态管理 */
(function() {
  var state = Vue.reactive({
    herbs: [],
    searchQuery: '',
    selectedCategory: null,
    notification: null,
    notifTimeout: null
  });

  var store = {
    state: state,

    /* 初始化：合并用户数据 */
    init: function() {
      var merged = TCM.storage.merge(TCM.herbs);
      state.herbs = merged;
    },

    /* ===== 查询方法 ===== */
    getHerbById: function(id) {
      return state.herbs.find(function(h) { return h.id === Number(id); });
    },

    getHerbsByCategory: function(cat) {
      return state.herbs.filter(function(h) { return h.category === cat; });
    },

    getFavoriteHerbs: function() {
      return state.herbs.filter(function(h) { return h.isFavorite; });
    },

    getMistakeHerbs: function(minCount) {
      if (minCount === undefined) minCount = 1;
      return state.herbs.filter(function(h) { return h.mistakeCount >= minCount; });
    },

    searchHerbs: function(query) {
      if (!query) return [];
      var q = query.toLowerCase();
      return state.herbs.filter(function(h) {
        return h.name.indexOf(q) !== -1 ||
               h.effects.some(function(e) { return e.indexOf(q) !== -1; }) ||
               h.category.indexOf(q) !== -1;
      });
    },

    /* ===== 操作方法 ===== */
    toggleFavorite: function(herbId) {
      var herb = this.getHerbById(herbId);
      if (!herb) return;
      var newVal = TCM.storage.toggleFavorite(herbId);
      herb.isFavorite = newVal;
      this.notify(newVal ? '已收藏到错题本' : '已取消收藏', 'info');
      return newVal;
    },

    recordMistake: function(herbId) {
      var herb = this.getHerbById(herbId);
      if (!herb) return;
      herb.mistakeCount = TCM.storage.recordMistake(herbId);
      herb.lastReviewed = new Date().toISOString();
    },

    updateReviewDate: function(herbId) {
      var herb = this.getHerbById(herbId);
      if (!herb) return;
      herb.lastReviewed = new Date().toISOString();
      TCM.storage.updateReviewDate(herbId);
    },

    /* ===== 通知 ===== */
    notify: function(msg, type) {
      if (state.notifTimeout) clearTimeout(state.notifTimeout);
      state.notification = { msg: msg, type: type || 'info', fade: false };
      state.notifTimeout = setTimeout(function() {
        if (state.notification) state.notification.fade = true;
        setTimeout(function() {
          state.notification = null;
        }, 300);
      }, 2000);
    }
  };

  TCM.store = store;
})();

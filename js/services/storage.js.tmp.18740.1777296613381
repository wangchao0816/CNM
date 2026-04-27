/* localStorage 数据持久化服务 */
(function() {
  var STORAGE_KEY = 'tcm-herb-memory-data';

  var service = {
    /* 加载用户数据 */
    load: function() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    },

    /* 保存用户数据 */
    save: function(data) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) { /* ignore */ }
    },

    /* 将用户数据合并到药材数组 */
    merge: function(herbs) {
      var userData = this.load();
      return herbs.map(function(h) {
        var u = userData[h.id] || {};
        return Object.assign({}, h, {
          isFavorite: u.isFavorite || false,
          mistakeCount: u.mistakeCount || 0,
          lastReviewed: u.lastReviewed || null
        });
      });
    },

    /* 切换收藏状态并保存 */
    toggleFavorite: function(herbId) {
      var data = this.load();
      if (!data[herbId]) data[herbId] = { isFavorite: false, mistakeCount: 0, lastReviewed: null };
      data[herbId].isFavorite = !data[herbId].isFavorite;
      data[herbId].lastReviewed = new Date().toISOString();
      this.save(data);
      return data[herbId].isFavorite;
    },

    /* 记录错误 */
    recordMistake: function(herbId) {
      var data = this.load();
      if (!data[herbId]) data[herbId] = { isFavorite: false, mistakeCount: 0, lastReviewed: null };
      data[herbId].mistakeCount = (data[herbId].mistakeCount || 0) + 1;
      data[herbId].lastReviewed = new Date().toISOString();
      this.save(data);
      return data[herbId].mistakeCount;
    },

    /* 更新复习时间 */
    updateReviewDate: function(herbId) {
      var data = this.load();
      if (!data[herbId]) data[herbId] = { isFavorite: false, mistakeCount: 0, lastReviewed: null };
      data[herbId].lastReviewed = new Date().toISOString();
      this.save(data);
    },

    /* 获取单个药材的用户数据 */
    get: function(herbId) {
      var data = this.load();
      return data[herbId] || { isFavorite: false, mistakeCount: 0, lastReviewed: null };
    }
  };

  TCM.storage = service;
})();

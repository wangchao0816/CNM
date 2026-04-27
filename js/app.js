/* 应用入口 */
(function() {
  var app = Vue.createApp({});

  /* 注册全局组件 */
  app.component('app-header', TCM.components.AppHeader);
  app.component('app-tab-bar', TCM.components.AppTabBar);
  app.component('notification', TCM.components.Notification);
  app.component('category-browse', TCM.components.CategoryBrowse);
  app.component('herb-card', TCM.components.HerbCard);
  app.component('herb-detail', TCM.components.HerbDetail);
  app.component('flashcard-mode', TCM.components.FlashcardMode);
  app.component('comparison-view', TCM.components.ComparisonView);
  app.component('mnemonic-view', TCM.components.MnemonicView);
  app.component('herb-pair-view', TCM.components.HerbPairView);
  app.component('quiz-mode', TCM.components.QuizMode);
  app.component('error-book', TCM.components.ErrorBook);

  /* 设置路由 */
  var router = TCM.router;
  var routes = [
    { path: '/', redirect: '/browse' },
    { path: '/browse', name: 'browse', component: TCM.components.CategoryBrowse,
      meta: { title: '分类浏览', tab: 0 } },
    { path: '/flashcard', name: 'flashcard', component: TCM.components.FlashcardMode,
      meta: { title: '记忆卡片', tab: 1 } },
    { path: '/comparison', name: 'comparison', component: TCM.components.ComparisonView,
      meta: { title: '对比记忆', tab: 2 } },
    { path: '/quiz', name: 'quiz', component: TCM.components.QuizMode,
      meta: { title: '自我测验', tab: 3 } },
    { path: '/notebook', name: 'notebook', component: TCM.components.ErrorBook,
      meta: { title: '错题本', tab: 4 } },
    { path: '/mnemonics', name: 'mnemonics', component: TCM.components.MnemonicView,
      meta: { title: '联想口诀' } },
    { path: '/pairs', name: 'pairs', component: TCM.components.HerbPairView,
      meta: { title: '药对配伍' } },
    { path: '/herb/:id', name: 'herb-detail', component: TCM.components.HerbDetail,
      meta: { title: '药材详情' } }
  ];
  routes.forEach(function(r) { router.addRoute(r); });

  app.use(router);
  TCM.store.init();

  app.mount('#app');
})();

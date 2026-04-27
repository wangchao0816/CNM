/* 测验引擎 */
(function() {
  var engine = {
    /* 从指定范围生成题目列表 */
    generateQuiz: function(herbs, count) {
      if (herbs.length < 4) return [];
      var questions = [];
      var used = {};
      var candidates = herbs.slice();
      var maxAttempts = count * 3;
      var attempts = 0;

      while (questions.length < count && candidates.length >= 4 && attempts < maxAttempts) {
        attempts++;
        var idx = Math.floor(Math.random() * candidates.length);
        var correct = candidates[idx];
        if (used[correct.id]) continue;

        var distractors = this._selectDistractors(correct, candidates, 3);
        if (distractors.length < 3) continue;

        used[correct.id] = true;
        var type = Math.random() < 0.6 ? 'effectToHerb' : 'herbToCategory';

        var question;
        if (type === 'effectToHerb') {
          var effectStr = correct.effects.slice(0, 3).join('、');
          question = {
            type: 'effectToHerb',
            text: '以下哪味药具有「' + effectStr + '」的功效？',
            correctId: correct.id,
            correctName: correct.name,
            options: this._shuffle([correct].concat(distractors)).map(function(h) {
              return { herbId: h.id, label: h.name };
            })
          };
        } else {
          /* 选3个不同类别的干扰项，确保4个选项类别不重复 */
          var differentCats = candidates.filter(function(h) {
            return h.id !== correct.id && h.category !== correct.category;
          });
          /* 按类别去重 */
          var seenCat = {};
          var uniqueCats = [];
          this._shuffle(differentCats).forEach(function(h) {
            if (!seenCat[h.category] && uniqueCats.length < 3) {
              seenCat[h.category] = true;
              uniqueCats.push(h);
            }
          });
          if (uniqueCats.length < 3) continue;
          question = {
            type: 'herbToCategory',
            text: '「' + correct.name + '」属于哪类药？',
            correctId: correct.id,
            correctName: correct.name,
            correctCategory: correct.category,
            options: this._shuffle([correct].concat(uniqueCats)).map(function(h) {
              return { herbId: h.id, label: h.category };
            })
          };
        }
        questions.push(question);
      }
      return questions;
    },

    /* 选择干扰项（优先同类别） */
    _selectDistractors: function(correct, candidates, count) {
      var sameCat = candidates.filter(function(h) { return h.id !== correct.id && h.category === correct.category; });
      var others = candidates.filter(function(h) { return h.id !== correct.id && h.category !== correct.category; });
      var result = [];
      var shuffled = this._shuffle(sameCat);
      while (result.length < count && shuffled.length) {
        result.push(shuffled.pop());
      }
      shuffled = this._shuffle(others);
      while (result.length < count && shuffled.length) {
        result.push(shuffled.pop());
      }
      return result;
    },

    /* 检查答案 */
    checkAnswer: function(question, herbId) {
      return {
        correct: question.correctId === herbId,
        correctId: question.correctId,
        correctName: question.correctName,
        correctCategory: question.correctCategory
      };
    },

    /* Fisher-Yates 洗牌 */
    _shuffle: function(arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
      }
      return a;
    }
  };

  TCM.quizEngine = engine;
})();

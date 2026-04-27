/* 药对/配伍数据 */
(function() {
  var p = [
    { id: 1, herbIds: [1, 2], pairName: "麻黄+桂枝",
      effect: "发汗解表增强",
      formula: "麻黄汤",
      description: "麻黄为散寒发汗之峻品，桂枝为解肌发表之佐使，二者相须为用，发汗解表之力更强。" },
    { id: 2, herbIds: [15, 16], pairName: "大黄+芒硝",
      effect: "攻下热结",
      formula: "大承气汤",
      description: "大黄苦寒攻积导滞，芒硝咸寒润燥软坚，二者相须为用，泻下热结之力显著。" },
    { id: 3, herbIds: [33, 34], pairName: "当归+川芎",
      effect: "补血活血",
      formula: "四物汤",
      description: "当归补血活血，川芎活血行气，二者搭配使补血而不滞血，活血而不伤正。" },
    { id: 4, herbIds: [45, 46], pairName: "龟甲+鳖甲",
      effect: "滋阴潜阳",
      formula: "二甲复脉汤",
      description: "龟甲滋阴潜阳、益肾强骨，鳖甲滋阴退蒸、软坚散结，二者合用滋阴潜阳之力更佳。" },
    { id: 5, herbIds: [9], pairName: "金银花+连翘",
      effect: "清热解毒",
      formula: "银翘散",
      description: "金银花清热解毒、疏散风热，连翘清热解毒、消肿散结，二者为清热解毒常用药对。" },
    { id: 6, herbIds: [24, 25], pairName: "附子+肉桂",
      effect: "回阳救逆、补火助阳",
      formula: "肾气丸",
      description: "附子回阳救逆，肉桂引火归元，二者配伍温补肾阳之力显著。" }
  ];
  TCM.herbPairs = p;
})();

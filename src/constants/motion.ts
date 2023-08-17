// フェイドアップアニメーションのオプション
export const fadeUpComponent = {
  start: {
    translateY: 40,
    opacity: 0,
  },
  end: {
    translateY: 0,
    opacity: 1,
  },
  transition: {
    transitionDuration: 0.4,
    transitionTimingFunction: 'ease-in-out',
  },
};

// フェードダウンアニメーションのオプション
export const fadeDownAnimation = {
  start: {
    translateY: -40,
    opacity: 0,
  },
  end: {
    translateY: 0,
    opacity: 1,
  },
  transition: {
    transitionDuration: 0.4,
    transitionTimingFunction: 'ease-in-out',
  },
};

// 左から右へのアニメーションのオプション
export const slideInLeftAnimation = {
  start: {
    translateX: -40,
    opacity: 0,
  },
  end: {
    translateX: 0,
    opacity: 1,
  },
  transition: {
    transitionDelay: 0.1,
    transitionDuration: 0.4,
    transitionTimingFunction: 'ease-in-out',
  },
};

// 右から左へのアニメーションのオプション
export const slideInRightAnimation = {
  start: {
    translateX: 40,
    opacity: 0,
  },
  end: {
    translateX: 0,
    opacity: 1,
  },
  transition: {
    transitionDelay: 0.1,
    transitionDuration: 0.4,
    transitionTimingFunction: 'ease-in-out',
  },
};

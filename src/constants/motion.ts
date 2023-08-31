// fade up animation
export const fadeUpComponent = {
  start: {
    translateY: 20,
    opacity: 0,
  },
  end: {
    translateY: 0,
    opacity: 1,
  },
  transition: {
    transitionDelay: 0.2,
    transitionDuration: 0.4,
    transitionTimingFunction: 'ease-in-out',
  },
};

// fade down animation
export const fadeDownAnimation = {
  start: {
    translateY: -20,
    opacity: 0,
  },
  end: {
    translateY: 0,
    opacity: 1,
  },
  transition: {
    transitionDelay: 0.2,
    transitionDuration: 0.4,
    transitionTimingFunction: 'ease-in-out',
  },
};

// left to right animation
export const slideInLeftAnimation = {
  start: {
    translateX: -20,
    opacity: 0,
  },
  end: {
    translateX: 0,
    opacity: 1,
  },
  transition: {
    transitionDelay: 0.4,
    transitionDuration: 0.4,
    transitionTimingFunction: 'ease-in-out',
  },
};

// right to left animation
export const slideInRightAnimation = {
  start: {
    translateX: 20,
    opacity: 0,
  },
  end: {
    translateX: 0,
    opacity: 1,
  },
  transition: {
    transitionDelay: 0.2,
    transitionDuration: 0.4,
    transitionTimingFunction: 'ease-in-out',
  },
};

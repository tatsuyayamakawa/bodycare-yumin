export interface NavData {
  title: string;
  url: string;
}

export interface NavStyles {
  container: {
    base: string;
  };
  desktop: {
    base: string;
    list: {
      base: string;
    };
    item: {
      base: string;
    };
  };
  mobile: {
    base: string;
    button: {
      base: string;
    };
    overlay: {
      base: string;
      background: string;
    };
    nav: {
      base: string;
    };
    list: {
      base: string;
    };
    item: {
      base: string;
    };
  };
}

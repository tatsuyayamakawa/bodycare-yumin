export interface CtaTitle {
  highlight: {
    days: string;
    hour: string;
  };
  text: string[];
  subtitle: string;
}

export interface CtaButton {
  text: string;
  url: string | undefined;
}

export interface CtaData {
  title: CtaTitle;
  button: CtaButton;
}

export interface CtaStyles {
  container: {
    base: string;
  };
  text: {
    base: string;
  };
  button: {
    base: string;
  };
  scroll: {
    base: string;
  };
}

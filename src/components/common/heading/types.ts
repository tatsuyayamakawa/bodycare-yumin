export interface HeadingProps {
  heading: string;
  subheading: string;
  description?: string;
  center?: boolean;
}

export interface HeadingStyles {
  container: {
    base: string;
    center: string;
  };
  heading: {
    base: string;
  };
  subheading: {
    base: string;
  };
}

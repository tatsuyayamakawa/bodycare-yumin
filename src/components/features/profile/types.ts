export interface ProfileData {
  title: string;
  name: string;
  education: string;
  description: string[];
}

export interface MediaLink {
  url: string | undefined;
  title: string;
  text: string;
}

export interface MediaData {
  heading: string;
  subheading: string;
  title: string;
  description: string[];
  link: MediaLink;
}

export interface ProfileStyles {
  container: {
    base: string;
  };
  intro: {
    base: string;
  };
  media: {
    base: string;
  };
}

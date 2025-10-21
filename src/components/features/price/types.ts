export interface MenuData {
  title: string;
  time: string;
  price: string;
  content: string;
}

export interface MenuList {
  heading: string;
  subheading: string;
  prices: MenuData[];
}

export interface PriceStyles {
  container: {
    base: string;
  };
  cardContainer: {
    base: string;
  };
  videoContainer: {
    base: string;
  };
}

export interface QuestionData {
  question: string;
  answer: string;
}

export interface FaqData {
  heading: string;
  subheading: string;
  lists: QuestionData[];
}

export interface FaqStyles {
  container: {
    base: string;
  };
  accordion: {
    base: string;
  };
}

export interface FaqItemProps {
  item: QuestionData;
  index: number;
}

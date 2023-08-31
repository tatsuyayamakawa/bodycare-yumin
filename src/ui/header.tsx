import { Nav } from './nav';
import { ProgressBar } from './progress-bar';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50">
      <Nav />
      <ProgressBar />
    </header>
  );
};

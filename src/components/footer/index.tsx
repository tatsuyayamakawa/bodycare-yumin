import { memo } from "react";

import { Copyright } from "./components/copyright";

const Footer = memo(function Footer() {
  return (
    <footer className="sticky top-full flex h-25 items-center justify-center">
      <Copyright />
    </footer>
  );
});

export default Footer;

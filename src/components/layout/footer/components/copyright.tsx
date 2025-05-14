import { appInfo } from "@/constants/data";

export default function Copyright() {
  const { name } = appInfo;
  const thisYear = new Date().getFullYear();
  const copyrightText = `© 2012 - ${thisYear} ${name}`;

  return (
    <div className="text-center">
      <small className="text-muted-foreground text-sm/normal">
        {copyrightText}
      </small>
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SlugSectionProps {
  slug: string;
  onSlugChange: (slug: string) => void;
  slugError?: string;
}

export function SlugSection({ slug, onSlugChange, slugError }: SlugSectionProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 md:p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900 md:text-base">
        パーマリンク
      </h3>
      <div>
        <Label htmlFor="slug" className="text-xs font-medium md:text-sm">
          スラッグ
        </Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          placeholder="slug"
          className="mt-1 text-sm"
        />
        {slugError && (
          <p className="mt-1 text-xs text-red-600 md:text-sm">
            {slugError}
          </p>
        )}
      </div>
    </div>
  );
}
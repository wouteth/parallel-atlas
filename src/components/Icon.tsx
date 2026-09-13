import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Bookmark02Icon,
  ArrowUpRight01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Add01Icon,
  Remove01Icon,
  Cancel01Icon,
  Menu01Icon,
  UserCircleIcon,
  FilterHorizontalIcon,
  FavouriteIcon,
  BookOpen01Icon,
} from "@hugeicons/core-free-icons";

const icons = {
  search: Search01Icon,
  bookmark: Bookmark02Icon,
  arrow: ArrowUpRight01Icon,
  left: ArrowLeft01Icon,
  right: ArrowRight01Icon,
  plus: Add01Icon,
  minus: Remove01Icon,
  close: Cancel01Icon,
  menu: Menu01Icon,
  user: UserCircleIcon,
  filter: FilterHorizontalIcon,
  heart: FavouriteIcon,
  book: BookOpen01Icon,
};
export function Icon({
  name,
  size = 18,
}: {
  name: keyof typeof icons;
  size?: number;
}) {
  return (
    <HugeiconsIcon
      icon={icons[name]}
      size={size}
      strokeWidth={1.6}
      aria-hidden="true"
    />
  );
}

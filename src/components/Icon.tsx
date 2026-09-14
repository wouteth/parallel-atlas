import {
  MagnifyingGlassIcon,
  ArrowTopRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  MinusIcon,
  Cross2Icon,
  HamburgerMenuIcon,
  MixerHorizontalIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";

const icons = {
  search: MagnifyingGlassIcon,
  arrow: ArrowTopRightIcon,
  left: ChevronLeftIcon,
  right: ChevronRightIcon,
  plus: PlusIcon,
  minus: MinusIcon,
  close: Cross2Icon,
  menu: HamburgerMenuIcon,
  filter: MixerHorizontalIcon,
  book: ReaderIcon,
};
export function Icon({
  name,
  size = 18,
}: {
  name: keyof typeof icons;
  size?: number;
}) {
  const Component = icons[name];
  return <Component width={size} height={size} aria-hidden />;
}

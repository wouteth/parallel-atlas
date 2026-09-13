import type { AtlasEvent } from "../data/types";

export function Picture({
  kind,
  className = "",
  alt = "",
}: {
  kind: AtlasEvent["image"];
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={`/images/${kind}.jpg`}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = "/images/landscape.svg";
      }}
    />
  );
}

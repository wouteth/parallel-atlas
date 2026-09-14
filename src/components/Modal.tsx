import { Dialog, VisuallyHidden } from "@radix-ui/themes";
import { Button } from "./ui/Controls";
import { useRef } from "react";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const previousFocus = useRef(document.activeElement as HTMLElement | null);
  const closeButton = useRef<HTMLButtonElement>(null);
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Content
        className="pt-dialog"
        maxWidth={wide ? "1050px" : "640px"}
        aria-describedby={undefined}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          closeButton.current?.focus({ preventScroll: true });
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          previousFocus.current?.focus({ preventScroll: true });
        }}
      >
        <VisuallyHidden>
          <Dialog.Title>{title}</Dialog.Title>
        </VisuallyHidden>
        <div className="modal-body">
          <Dialog.Close>
            <Button
              ref={closeButton}
              className="icon-button modal-close"
              aria-label="Close dialog"
            >
              <Icon name="close" />
            </Button>
          </Dialog.Close>
          {children}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

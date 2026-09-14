import {
  Button as RadixButton,
  IconButton,
  TextField,
  Select,
  Card,
  Tooltip,
} from "@radix-ui/themes";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import type { ComponentProps, ReactNode } from "react";

export function Button({
  className = "",
  variant,
  title,
  ...props
}: ComponentProps<typeof RadixButton>) {
  const Component = className.includes("icon-button")
    ? IconButton
    : RadixButton;
  const control = (
    <Component
      size="2"
      color={className.includes("primary") ? "grass" : "gray"}
      variant={variant ?? (className.includes("primary") ? "solid" : "surface")}
      className={`ui-button ${className}`}
      {...props}
    />
  );
  return title ? <Tooltip content={title}>{control}</Tooltip> : control;
}

export function SearchField({
  children,
  ...props
}: ComponentProps<typeof TextField.Root>) {
  return (
    <TextField.Root size="3" variant="surface" className="pt-search" {...props}>
      <TextField.Slot>
        <MagnifyingGlassIcon width="18" height="18" />
      </TextField.Slot>
      {children && <TextField.Slot side="right">{children}</TextField.Slot>}
    </TextField.Root>
  );
}

const emptyOption = "__pt_all_sources__";
export function SelectField({
  children,
  value,
  defaultValue = "",
  onValueChange,
  name,
  disabled,
  "aria-label": label,
}: {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  "aria-label": string;
}) {
  const [localValue, setLocalValue] = useState(defaultValue);
  const selected = value ?? localValue;
  return (
    <Select.Root
      name={name}
      value={selected || emptyOption}
      disabled={disabled}
      onValueChange={(next) => {
        const result = next === emptyOption ? "" : next;
        setLocalValue(result);
        onValueChange?.(result);
      }}
    >
      <Select.Trigger
        aria-label={label}
        data-value={selected}
        className="pt-select"
        variant="surface"
      />
      <Select.Content position="popper" className="pt-select-content">
        {children}
      </Select.Content>
    </Select.Root>
  );
}
export function SelectItem({
  value,
  ...props
}: ComponentProps<typeof Select.Item>) {
  return (
    <Select.Item value={value || emptyOption} data-value={value} {...props} />
  );
}
export function SelectGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Select.Group>
      <Select.Label>{label}</Select.Label>
      {children}
    </Select.Group>
  );
}

export function LinkButton({ className = "", ...props }: ComponentProps<"a">) {
  return (
    <RadixButton
      asChild
      variant="surface"
      color="gray"
      className="ui-link-button"
    >
      <a className={className} {...props} />
    </RadixButton>
  );
}

export function Disclosure({
  title,
  children,
  className = "",
}: {
  title: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Collapsible.Root asChild>
      <Card className={`pt-disclosure ${className}`}>
        <Collapsible.Trigger className="pt-disclosure-trigger">
          <span>{title}</span>
          <ChevronDownIcon aria-hidden width="18" height="18" />
        </Collapsible.Trigger>
        <Collapsible.Content className="pt-disclosure-content">
          {children}
        </Collapsible.Content>
      </Card>
    </Collapsible.Root>
  );
}

export function Input(props: ComponentProps<typeof TextField.Root>) {
  return <TextField.Root size="2" variant="surface" {...props} />;
}

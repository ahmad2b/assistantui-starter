import { BranchPickerPrimitive } from "@assistant-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { TooltipIconButton } from "../tooltip-icon-button";

type BranchPickerPrimitiveRootProps = React.ComponentProps<
  typeof BranchPickerPrimitive.Root
>;

export const MyBranchPicker = ({
  className,
  ...rest
}: BranchPickerPrimitiveRootProps) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "inline-flex items-center text-xs text-muted-foreground",
        className
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Previous">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next">
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};

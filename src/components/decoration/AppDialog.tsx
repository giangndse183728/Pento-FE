"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ColorTheme } from "@/constants/color";

interface AppDialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  hideTitle?: boolean;
  maxWidth?: number | string;
  padding?: number | string;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  showCloseButton?: boolean;
}

export function AppDialog({
  children,
  open,
  onOpenChange,
  title,
  hideTitle = false,
  maxWidth = 400,
  padding = 20,
  borderRadius = 16,
  borderColor = ColorTheme.powderBlue,
  borderWidth = 6,
  showCloseButton = true,
}: AppDialogProps) {
  const maxWidthValue = typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
  const paddingValue = typeof padding === "number" ? `${padding}px` : padding;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={showCloseButton}
        className="p-0 gap-0 top-[10%] translate-y-0"
        style={{
          backgroundColor: ColorTheme.iceberg,
          borderRadius: `${borderRadius}px`,
          border: `${borderWidth}px solid ${borderColor}`,
          maxWidth: maxWidthValue,
          padding: paddingValue,
          boxShadow: `0 10px 40px rgba(0, 0, 0, 0.2)`,
        }}
      >
        <DialogTitle className="text-center text-xl font-semibold mb-2 font-primary">
          {title}
        </DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
}


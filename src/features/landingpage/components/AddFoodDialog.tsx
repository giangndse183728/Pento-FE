"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { AppDialog } from "@/components/decoration/AppDialog";
import { ColorTheme } from "@/constants/color";
import { ROUTES } from "@/constants/routes";

interface AddFoodDialogProps {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFoodScanTap?: () => void;
  onReceiptScanTap?: () => void;
  onSearchTap?: () => void;
  onBarcodeScanTap?: () => void;
}

interface AddFoodOptionProps {
  icon: string;
  title: string;
  onTap: () => void;
}

function AddFoodOption({ icon, title, onTap }: AddFoodOptionProps) {
  return (
    <button
      onClick={onTap}
      className="flex flex-col items-center justify-center p-6 rounded-xl transition-all hover:scale-105 active:scale-95 aspect-square"
      style={{
        backgroundColor: ColorTheme.iceberg,
        border: `1px solid ${ColorTheme.powderBlue}99`,
      }}
    >
      <Image
        src={icon}
        alt={title}
        width={48}
        height={48}
        className="mb-2"
        unoptimized
      />
      <span
        className="text-xs font-semibold text-center"
        style={{ color: ColorTheme.darkBlue }}
      >
        {title}
      </span>
    </button>
  );
}

export default function AddFoodDialog({
  title,
  open,
  onOpenChange,
  onFoodScanTap,
  onReceiptScanTap,
  onSearchTap,
  onBarcodeScanTap,
}: AddFoodDialogProps) {
  const router = useRouter();

  const handleFoodScan = () => {
    onOpenChange(false);
    onFoodScanTap?.();
  };

  const handleReceiptScan = () => {
    onOpenChange(false);
    onReceiptScanTap?.();
  };

  const handleSearch = () => {
    onOpenChange(false);
    onSearchTap?.();
  };

  const handleBarcodeScan = () => {
    onOpenChange(false);
    onBarcodeScanTap?.();
  };

  const handleSubscribeClick = () => {
    onOpenChange(false);
    router.push(ROUTES.SUBSCRIPTIONS_VIEW);
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      hideTitle={true}
      maxWidth={400}
      padding={20}
      borderRadius={16}
      borderColor={ColorTheme.powderBlue}
      borderWidth={6}
    >
      <div className="flex flex-col items-center">

        <div className="flex flex-col items-center gap-2 mb-6 w-full">
          <p
            className="text-xs text-center leading-relaxed"
            style={{ color: ColorTheme.darkBlue }}
          >
            Food Scan and Receipt Scan require subscription.{" "}
            <button
              onClick={handleSubscribeClick}
              className="underline font-medium hover:opacity-80 transition-opacity"
              style={{ color: ColorTheme.blueGray }}
            >
              Click here to subscribe →
            </button>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full" style={{ gap: '16px' }}>
          <AddFoodOption
            icon="/assets/icon/camera.png"
            title="Food Scan"
            onTap={handleFoodScan}
          />
          <AddFoodOption
            icon="/assets/icon/invoice.png"
            title="Receipt Scan"
            onTap={handleReceiptScan}
          />
          <AddFoodOption
            icon="/assets/icon/search.png"
            title="Search"
            onTap={handleSearch}
          />
          <AddFoodOption
            icon="/assets/icon/barcode.png"
            title="Barcode Scan"
            onTap={handleBarcodeScan}
          />
        </div>
      </div>
    </AppDialog>
  );
}


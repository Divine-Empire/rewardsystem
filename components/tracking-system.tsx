"use client";

import { useState, useEffect, type ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Download,
  RefreshCw,
  QrCode,
  Eye,
  Loader2,
  Ticket,
  TrendingUp,
  Gift,
  Wallet,
  Users,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

import { storageUtils } from "@/lib/storage-utils";

interface Coupon {
  id: string;
  created: string;
  code: string;
  status: "used" | "unused" | "deleted";
  reward: number;
  phone?: string;
  upiId?: string;
  claimedBy?: string;
  claimedAt?: string;
  itemName?: string;
  itemCode?: string;
  rowIndex: number;
}

interface Consumer {
  name: string;
  phone: string;
  upiId: string;
  couponCode: string;
  date: string;
  rowIndex: number;
}

interface BarcodeDisplayProps {
  code: string;
  formLink: string;
  reward: number;
  itemName?: string;
  itemCode?: string;
}

// Format date to DD-MM-YYYY
const formatDate = (dateStr: string): string => {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        return `${match[3]}-${match[2]}-${match[1]}`;
      }
      return dateStr;
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return dateStr;
  }
};

const BarcodeDisplay = ({
  code,
  formLink,
  reward,
  itemName,
  itemCode,
}: BarcodeDisplayProps) => {
  return (
    <div className="relative overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-lg group rounded-2xl hover:shadow-2xl hover:-translate-y-1">
      {/* Decorative gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-sky-600 to-sky-500" />

      {/* Header with brand */}
      <div className="px-4 py-3 text-center bg-gradient-to-br from-sky-600 to-sky-700">
        <h1 className="text-lg font-bold tracking-wide text-white drop-shadow-sm">
          Botivate Your Digital Rewards
        </h1>
        <p className="text-sky-100 text-[10px] font-medium tracking-widest uppercase mt-0.5">
          Scan. Earn. Botivate.
        </p>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center p-5">
        {/* QR Code container with decorative border */}
        <div className="relative p-1 mb-4 shadow-lg rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 shadow-sky-500/20">
          <div className="p-3 bg-white rounded-lg">
            <QRCodeSVG
              value={formLink}
              size={140}
              level="H"
              includeMargin={false}
              fgColor="#1f2937"
              bgColor="#ffffff"
            />
          </div>
          {/* Corner decorations */}
          <div className="absolute w-3 h-3 border-t-2 border-l-2 border-sky-300 rounded-tl -top-1 -left-1" />
          <div className="absolute w-3 h-3 border-t-2 border-r-2 border-sky-300 rounded-tr -top-1 -right-1" />
          <div className="absolute w-3 h-3 border-b-2 border-l-2 border-sky-300 rounded-bl -bottom-1 -left-1" />
          <div className="absolute w-3 h-3 border-b-2 border-r-2 border-sky-300 rounded-br -bottom-1 -right-1" />
        </div>

        {/* Scan instruction */}
        <div className="mb-3 text-center">
          <h2 className="mb-1 text-sm font-bold text-gray-800">
            📱 Scan QR Code to Get Reward
          </h2>
          <p className="inline-block px-3 py-1 text-xs font-medium text-sky-600 rounded-full bg-sky-50">
            Botivate — Turning Scans into Smiles
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px my-2 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Item Details */}
        {(itemName || itemCode) && (
          <div className="w-full mb-3 text-center">
            {itemName && (
              <p className="text-sm font-bold text-slate-800 mb-0.5 max-w-full px-2 truncate">
                {itemName}
              </p>
            )}
            {itemCode && (
              <p className="text-xs text-sky-600 font-mono font-medium">
                {itemCode}
              </p>
            )}
          </div>
        )}

        {/* Coupon code */}
        <div className="w-full mb-3 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1">
            Coupon Code
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 font-mono text-sm font-bold text-white bg-gray-900 rounded-lg shadow-md">
            <span className="text-sky-400">●</span>
            {code}
            <span className="text-sky-400">●</span>
          </div>
        </div>

        {/* Form link */}
        <div className="w-full p-2 mb-4 border border-gray-100 rounded-lg bg-gray-50">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1 text-center">
            Redeem URL
          </p>
          <p className="text-[10px] text-gray-500 break-all text-center font-mono leading-relaxed">
            {formLink}
          </p>
        </div>

        {/* Reward badge */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 blur-md opacity-40 animate-pulse" />
          <div className="relative bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold text-base px-6 py-2.5 rounded-full shadow-lg flex items-center gap-2">
            <span className="text-lg">🎁</span>
            <span>₹{reward} Reward</span>
          </div>
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="h-2 bg-gradient-to-r from-sky-100 via-sky-200 to-sky-100" />
    </div>
  );
};

export default function PremiumTrackingSystem() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"all" | "used" | "unused">(
    "all",
  );
  const [showBarcodes, setShowBarcodes] = useState<boolean>(false);
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      // Initialize dummy data if no coupons exist (for testing/demo)
      const existingData = storageUtils.getCoupons();
      if (existingData.length === 0) {
        storageUtils.initializeDummyData();
      }

      const data = storageUtils.getCoupons();
      const couponData = data
        .map((c: any, index: number) => ({
          id: `coupon_${index + 1}`,
          created: c.created || "",
          code: c.code || "",
          status: (c.status || "unused").toLowerCase(),
          reward: Number(c.reward) || 0,
          claimedBy: c.claimedBy || null,
          claimedAt: c.claimedAt || null,
          phone: c.userDetails?.phone || null,
          upiId: c.userDetails?.upiId || "",
          itemName: c.itemName || "",
          itemCode: c.itemCode || "",
          rowIndex: index + 2,
        }))
        .filter((coupon: Coupon) => coupon.code && coupon.status !== "deleted");

      setCoupons(couponData);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConsumers = async () => {
    // Consumers data is now integrated into coupons via userDetails
    setConsumers([]);
  };

  // Initial data fetch
  useEffect(() => {
    fetchCoupons();
    fetchConsumers();
  }, []);

  // Live update: Listen for storage changes (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "coupons") {
        fetchCoupons();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Live update: Poll for changes every 5 seconds (same-tab updates)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentData = storageUtils.getCoupons();
      if (currentData.length !== coupons.length) {
        fetchCoupons();
      } else {
        // Check if any coupon status changed
        const hasChanges = currentData.some((c: any, i: number) => {
          const existing = coupons.find((ec) => ec.code === c.code);
          return existing && existing.status !== c.status;
        });
        if (hasChanges) {
          fetchCoupons();
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [coupons]);

  const refreshData = async (): Promise<void> => {
    setIsLoading(true);
    await fetchCoupons();
    await fetchConsumers();
  };

  const getFormLink = (couponCode: string, reward?: number): string => {
    const params = new URLSearchParams({
      code: couponCode,
    });
    if (reward !== undefined) {
      params.append("reward", reward.toString());
    }
    return `${window.location.origin}/redeem?${params.toString()}`;
  };

  // Function to load Hindi font for PDF
  const loadHindiFont = async (doc: jsPDF): Promise<boolean> => {
    try {
      // Fetch the TTF font from public folder
      const fontUrl = "/fonts/NotoSansDevanagari-Regular.ttf";

      const response = await fetch(fontUrl);
      if (!response.ok) {
        console.warn("Failed to fetch Hindi font from public folder");
        return false;
      }

      const fontBuffer = await response.arrayBuffer();

      // Convert ArrayBuffer to base64
      const bytes = new Uint8Array(fontBuffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const fontBase64 = btoa(binary);

      // Add font to jsPDF
      doc.addFileToVFS("NotoSansDevanagari-Regular.ttf", fontBase64);
      doc.addFont(
        "NotoSansDevanagari-Regular.ttf",
        "NotoSansDevanagari",
        "normal",
      );
      return true;
    } catch (error) {
      console.warn("Failed to load Hindi font, using fallback:", error);
      return false;
    }
  };

  /* eslint-disable @typescript-eslint/no-unused-vars */
  // @ts-ignore
  const downloadBarcodes = async (): Promise<void> => {
    const barcodesToDownload =
      selectedCoupons.length > 0
        ? coupons.filter((c) => selectedCoupons.includes(c.code))
        : coupons.filter((c) => c.status === "unused");

    if (barcodesToDownload.length === 0) {
      alert("No coupons selected to download.");
      return;
    }

    try {
      setIsDownloading(true);
      // Yield to main thread to allow UI to update
      await new Promise((resolve) => setTimeout(resolve, 100));

      // A4 size: 210mm x 297mm
      const doc = new jsPDF();

      // Load Hindi font and track if successful
      const hindiFontLoaded = await loadHindiFont(doc);

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 8;
      const cols = 3;
      const rows = 3; // 3 rows per page for full page coverage
      const colWidth = (pageWidth - margin * 2) / cols;
      const rowHeight = (pageHeight - margin * 2) / rows; // ~93.67mm per row for full page

      let x = margin;
      let y = margin;
      let colIndex = 0;

      for (const coupon of barcodesToDownload) {
        // Check if we need a new page
        if (y + rowHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
          x = margin;
          colIndex = 0;
        }

        const formLink = getFormLink(coupon.code, coupon.reward);

        // Generate QR Code Data URL
        const qrDataUrl = await QRCode.toDataURL(formLink, {
          width: 300,
          margin: 1,
          color: {
            dark: "#1f2937",
            light: "#ffffff",
          },
        });

        // Calculate center of the column
        const colCenterX = x + colWidth / 2;
        const cardX = x + 1.5;
        const cardWidth = colWidth - 3;

        // Draw outer border/card with rounded corners effect
        doc.setDrawColor(229, 231, 235); // Light gray border
        doc.setLineWidth(0.3);
        doc.rect(cardX, y, cardWidth, rowHeight - 2, "S");

        // Draw sky blue header bar
        doc.setFillColor(2, 132, 199); // Sky-600 background
        doc.rect(cardX, y, cardWidth, 10, "F");

        // Header: "Botivate"
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255); // White text
        doc.text("Botivate Your Digital Rewards", colCenterX, y + 5, {
          align: "center",
        });

        // Subtitle: "Scan. Earn. Botivate."
        doc.setFontSize(5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(186, 230, 253); // Sky-200
        doc.text("SCAN. EARN. BOTIVATE.", colCenterX, y + 8.5, {
          align: "center",
        });

        // Add QR Image with red border effect
        const qrSize = 28;
        const qrX = colCenterX - qrSize / 2;
        const qrY = y + 13;

        // Draw sky blue border around QR
        doc.setDrawColor(2, 132, 199);
        doc.setLineWidth(0.8);
        doc.rect(qrX - 1.5, qrY - 1.5, qrSize + 3, qrSize + 3, "S");

        // Add QR Image
        doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

        // "Scan QR Code to Get Reward" text
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(31, 41, 55); // Dark gray
        doc.text("Scan QR Code to Get Reward", colCenterX, y + 46, {
          align: "center",
        });

        // Item Details Logic
        let currentY = y + 50;
        if (coupon.itemName || coupon.itemCode) {
          if (coupon.itemName) {
            doc.setFontSize(7); // Slightly larger
            doc.setFont("helvetica", "bold");
            doc.setTextColor(17, 24, 39); // Gray 900

            // Truncate if too long (simple char limit for demo)
            let name = coupon.itemName;
            if (name.length > 25) name = name.substring(0, 25) + "...";

            doc.text(name, colCenterX, y + 50, { align: "center" });
          }
          if (coupon.itemCode) {
            doc.setFontSize(5);
            doc.setFont("courier", "bold");
            doc.setTextColor(2, 132, 199); // Sky 600
            doc.text(coupon.itemCode, colCenterX, y + 53, { align: "center" });
          }
        } else {
          // Fallback tagline if no item info
          doc.setFontSize(6);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(2, 132, 199); // Sky-600
          doc.text("Turning Scans into Smiles", colCenterX, y + 50, {
            align: "center",
          });
        }

        // Divider line
        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.2);
        doc.line(cardX + 5, y + 55, cardX + cardWidth - 5, y + 55);

        // Coupon Code label
        doc.setFont("helvetica", "normal");
        doc.setFontSize(4);
        doc.setTextColor(156, 163, 175); // Gray
        doc.text("COUPON CODE", colCenterX, y + 59, { align: "center" });

        // Coupon Code value with dark background
        const codeText = coupon.code;
        const codeWidth = doc.getTextWidth(codeText) + 8;
        doc.setFillColor(17, 24, 39); // Dark background
        doc.roundedRect(
          colCenterX - codeWidth / 2,
          y + 60.5,
          codeWidth,
          5,
          1,
          1,
          "F",
        );
        doc.setFontSize(6);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255); // White text
        doc.text(codeText, colCenterX, y + 64, { align: "center" });

        // Redeem URL label
        doc.setFontSize(4);
        doc.setTextColor(156, 163, 175); // Gray
        doc.text("REDEEM URL", colCenterX, y + 70, { align: "center" });

        // Redeem URL value (truncated if too long)
        doc.setFontSize(4);
        doc.setTextColor(107, 114, 128); // Medium gray
        const maxUrlWidth = cardWidth - 6;
        let displayUrl = formLink;
        while (
          doc.getTextWidth(displayUrl) > maxUrlWidth &&
          displayUrl.length > 10
        ) {
          displayUrl = displayUrl.slice(0, -1);
        }
        if (displayUrl !== formLink) displayUrl += "...";
        doc.text(displayUrl, colCenterX, y + 74, { align: "center" });

        // Reward badge with gradient effect (simulated with red background)
        const badgeWidth = 28;
        const badgeHeight = 7;
        const badgeX = colCenterX - badgeWidth / 2;
        const badgeY = y + 78;

        // Draw reward badge
        doc.setFillColor(2, 132, 199); // Sky-600
        doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 3.5, 3.5, "F");

        // Reward text
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255); // White
        doc.text(`Rs. ${coupon.reward} Reward`, colCenterX, badgeY + 5, {
          align: "center",
        });

        // Bottom decorative bar
        doc.setFillColor(186, 230, 253); // Sky-200
        doc.rect(cardX, y + rowHeight - 4, cardWidth, 2, "F");

        // Move to next position
        colIndex++;
        if (colIndex >= cols) {
          colIndex = 0;
          x = margin;
          y += rowHeight;
        } else {
          x += colWidth;
        }
      }

      doc.save("Botivate_Reward_Coupons.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const toggleCouponSelection = (couponCode: string): void => {
    setSelectedCoupons((prev) =>
      prev.includes(couponCode)
        ? prev.filter((code) => code !== couponCode)
        : [...prev, couponCode],
    );
  };

  const selectAllUnused = (): void => {
    const unusedCodes = coupons
      .filter((c) => c.status === "unused")
      .map((c) => c.code);
    setSelectedCoupons(unusedCodes);
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coupon.claimedBy &&
        coupon.claimedBy.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      filterStatus === "all" || coupon.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort by date (newest first)
  const sortedCoupons = [...filteredCoupons].sort((a, b) => {
    const timeA = a.created ? new Date(a.created).getTime() : 0;
    const timeB = b.created ? new Date(b.created).getTime() : 0;
    return timeB - timeA;
  });

  const totalCoupons = coupons.length;
  const usedCouponsValues = coupons.filter((c) => c.status === "used").length;
  const unusedCouponsValues = coupons.filter(
    (c) => c.status === "unused",
  ).length;
  const totalRewards = coupons
    .filter((c) => c.status === "used")
    .reduce((sum, coupon) => sum + coupon.reward, 0);

  const exportData = (): void => {
    const csvContent = [
      [
        "Coupon Code",
        "Status",
        "Claimed By",
        "Phone",
        "UPI ID",
        "Claimed At",
        "Reward Amount",
        "Form Link",
      ],
      ...coupons.map((coupon) => [
        coupon.code,
        coupon.status,
        coupon.reward,
        coupon.claimedBy ||
          consumers.find(
            (c) => c.couponCode.toLowerCase() === coupon.code.toLowerCase(),
          )?.name ||
          "",
        coupon.phone ||
          consumers.find(
            (c) => c.couponCode.toLowerCase() === coupon.code.toLowerCase(),
          )?.phone ||
          "",
        coupon.upiId ||
          consumers.find(
            (c) => c.couponCode.toLowerCase() === coupon.code.toLowerCase(),
          )?.upiId ||
          "",
        coupon.claimedAt ||
          consumers.find(
            (c) => c.couponCode.toLowerCase() === coupon.code.toLowerCase(),
          )?.date ||
          "",
        coupon.status === "used" ? `₹${coupon.reward}` : "₹0",
        getFormLink(coupon.code, coupon.reward),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "coupon-tracking-data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading && coupons.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 shadow-lg rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 shadow-sky-500/30">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <p className="font-medium text-slate-600">Loading tracking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4 overflow-hidden">
      {/* Stats Cards */}
      <div className="grid flex-shrink-0 grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="p-4 transition-shadow bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-wider uppercase text-slate-400">
                Total
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                {totalCoupons}
              </p>
            </div>
            <div className="flex items-center justify-center shadow-lg w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 shadow-sky-500/30">
              <Ticket className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="p-4 transition-shadow bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-wider uppercase text-slate-400">
                Redeemed
              </p>
              <p className="text-2xl font-bold text-sky-600 mt-0.5">
                {usedCouponsValues}
              </p>
            </div>
            <div className="flex items-center justify-center shadow-lg w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 shadow-sky-500/30">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="p-4 transition-shadow bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-wider uppercase text-slate-400">
                Available
              </p>
              <p className="text-2xl font-bold text-sky-600 mt-0.5">
                {unusedCouponsValues}
              </p>
            </div>
            <div className="flex items-center justify-center shadow-lg w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 shadow-sky-500/30">
              <Gift className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="p-4 transition-shadow bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-wider uppercase text-slate-400">
                Distributed
              </p>
              <p className="text-2xl font-bold text-sky-600 mt-0.5">
                ₹{totalRewards}
              </p>
            </div>
            <div className="flex items-center justify-center shadow-lg w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 shadow-sky-500/30">
              <Wallet className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Tracking Card - Fills remaining space */}
      <div className="flex flex-col flex-1 overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
        {/* Header */}
        <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center shadow-md w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 shadow-sky-500/20">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Tracking System
                </h2>
                <p className="text-xs text-slate-400">
                  Overview of all coupons and redemptions
                </p>
              </div>
            </div>

            <div className="flex flex-wrap w-full gap-2 lg:w-auto">
              {/* Search */}
              <div className="relative flex-grow lg:flex-grow-0 lg:w-64">
                <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 rounded-xl border-slate-200 focus:border-sky-500 focus:ring-sky-500"
                />
              </div>

              <div className="flex p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    filterStatus === "all"
                      ? "bg-white text-sky-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus("used")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    filterStatus === "used"
                      ? "bg-white text-sky-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Used
                </button>
                <button
                  onClick={() => setFilterStatus("unused")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    filterStatus === "unused"
                      ? "bg-white text-sky-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Unused
                </button>
              </div>

              <Button
                onClick={() => {
                  if (!showBarcodes) {
                    setFilterStatus("unused");
                  } else {
                    setFilterStatus("all");
                  }
                  setShowBarcodes(!showBarcodes);
                }}
                variant="outline"
                size="sm"
                className="h-9 border-slate-200 text-slate-600 hover:text-sky-600 hover:bg-sky-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showBarcodes ? "Hide" : "Show"} QR
              </Button>

              <Button
                onClick={downloadBarcodes}
                size="sm"
                className="text-white bg-sky-600 h-9 hover:bg-sky-700"
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {isDownloading ? "Generating..." : "Download"}
              </Button>

              <Button
                onClick={refreshData}
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-slate-400 hover:text-sky-600"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto bg-slate-50/50">
          {/* QR Codes Grid - Only shows when showBarcodes is true */}
          {showBarcodes ? (
            <div className="duration-300 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">
                  Unused Coupon QR Codes
                </h3>
                <span className="text-sm text-slate-500">
                  Showing {coupons.filter((c) => c.status === "unused").length}{" "}
                  codes
                </span>
              </div>
              {coupons.filter((c) => c.status === "unused").length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {coupons
                    .filter((c) => c.status === "unused")
                    .map((coupon) => (
                      <BarcodeDisplay
                        key={coupon.code}
                        code={coupon.code}
                        formLink={getFormLink(coupon.code, coupon.reward)}
                        reward={coupon.reward}
                        itemName={coupon.itemName}
                        itemCode={coupon.itemCode}
                      />
                    ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-white border border-gray-100 rounded-2xl">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-slate-50">
                    <QrCode className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="mb-1 font-medium text-slate-900">
                    No Unused Coupons
                  </h3>
                  <p className="text-sm text-slate-500">
                    Create some coupons in the dashboard to see them here.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Table and Mobile Cards - Only shows when showBarcodes is false */
            <>
              {/* Desktop Table Container */}
              <div className="flex-col hidden h-full overflow-hidden bg-white border border-gray-100 shadow-sm lg:flex rounded-xl">
                {/* Table Header - Fixed */}
                <div className="flex-shrink-0 px-5 py-3 bg-gradient-to-r from-sky-600 to-sky-700">
                  <div className="grid grid-cols-9 gap-4 text-xs font-medium tracking-wider text-white uppercase">
                    <div>Code</div>
                    <div>Item Name</div>
                    <div>Item Code</div>
                    <div>Status</div>
                    <div>Reward</div>
                    <div>Claimed By</div>
                    <div>Phone</div>
                    <div>UPI ID</div>
                    <div>Claimed At</div>
                  </div>
                </div>

                {/* Table Body - Scrollable */}
                <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                  {sortedCoupons.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-50">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-slate-500">
                        No coupons found matching your filters.
                      </p>
                    </div>
                  ) : (
                    sortedCoupons.map((coupon, index) => {
                      const consumer = consumers.find(
                        (c) =>
                          c.couponCode.toLowerCase() ===
                          coupon.code.toLowerCase(),
                      );
                      return (
                        <div
                          key={coupon.code}
                          className={`grid grid-cols-9 gap-4 px-5 py-3.5 items-center hover:bg-sky-50/10 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                          }`}
                        >
                          <div className="font-mono text-sm font-semibold tracking-wide text-slate-800">
                            {coupon.code}
                          </div>
                          <div
                            className="text-sm text-slate-700 font-medium truncate"
                            title={coupon.itemName}
                          >
                            {coupon.itemName || "—"}
                          </div>
                          <div className="text-sm text-slate-500 font-mono">
                            {coupon.itemCode || "—"}
                          </div>
                          <div>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                coupon.status === "used"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-sky-100 text-sky-700"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  coupon.status === "used"
                                    ? "bg-green-500"
                                    : "bg-sky-500"
                                }`}
                              />
                              {coupon.status === "used"
                                ? "Redeemed"
                                : "Available"}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-slate-700">
                            ₹{coupon.reward}
                          </div>
                          <div
                            className="text-sm truncate text-slate-500"
                            title={coupon.claimedBy || consumer?.name || ""}
                          >
                            {coupon.claimedBy || consumer?.name || "—"}
                          </div>
                          <div
                            className="text-sm truncate text-slate-500"
                            title={coupon.phone || consumer?.phone}
                          >
                            {coupon.phone || consumer?.phone || "—"}
                          </div>
                          <div
                            className="text-sm truncate text-slate-500"
                            title={coupon.upiId || consumer?.upiId}
                          >
                            {coupon.upiId || consumer?.upiId || "—"}
                          </div>
                          <div className="text-sm text-slate-500">
                            {formatDate(
                              coupon.claimedAt ||
                                consumer?.date ||
                                coupon.created,
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Table Footer - Fixed */}
                <div className="flex-shrink-0 px-5 py-3 border-t border-gray-100 bg-slate-50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Showing{" "}
                      <span className="font-semibold text-slate-700">
                        {sortedCoupons.length}
                      </span>{" "}
                      coupons
                    </span>
                    <span className="text-xs text-right text-slate-400">
                      Scroll for more
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="flex-1 space-y-3 overflow-y-auto lg:hidden">
                {sortedCoupons.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-50">
                      <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-slate-500">No coupons found.</p>
                  </div>
                ) : (
                  sortedCoupons.map((coupon) => {
                    const consumer = consumers.find(
                      (c) =>
                        c.couponCode.toLowerCase() ===
                        coupon.code.toLowerCase(),
                    );
                    return (
                      <Card
                        key={coupon.code}
                        className={`border shadow-sm transition-all ${
                          coupon.status === "used"
                            ? "border-gray-100 bg-gray-50/50"
                            : "border-sky-100 bg-white shadow-sky-100/20"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={selectedCoupons.includes(coupon.code)}
                                onChange={() =>
                                  toggleCouponSelection(coupon.code)
                                }
                                className="w-5 h-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                              />
                              <div>
                                <div className="font-mono text-base font-bold tracking-wide text-slate-800">
                                  {coupon.code}
                                </div>
                                <span
                                  className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    coupon.status === "used"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-sky-100 text-sky-700"
                                  }`}
                                >
                                  {coupon.status === "used"
                                    ? "Redeemed"
                                    : "Available"}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span
                                className={`text-lg font-bold ${
                                  coupon.status === "used"
                                    ? "text-slate-500"
                                    : "text-sky-600"
                                }`}
                              >
                                ₹{coupon.reward}
                              </span>
                            </div>
                          </div>

                          {/* Data Grid with robust fallbacks */}
                          <div className="grid grid-cols-2 gap-4 pt-3 text-sm border-t border-gray-100/80">
                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                                Claimed By
                              </span>
                              <span className="block font-medium truncate text-slate-700">
                                {coupon.claimedBy || consumer?.name || "—"}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                                Date
                              </span>
                              <span className="block font-medium truncate text-slate-700">
                                {formatDate(
                                  coupon.claimedAt ||
                                    consumer?.date ||
                                    coupon.created,
                                )}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                                Phone
                              </span>
                              <span className="block font-mono text-xs font-medium truncate text-slate-700">
                                {coupon.phone || consumer?.phone || "—"}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                                UPI ID
                              </span>
                              <span className="block font-medium truncate text-slate-700">
                                {coupon.upiId || consumer?.upiId || "—"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

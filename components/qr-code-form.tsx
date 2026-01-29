"use client";

import { useState, useEffect, type ChangeEvent } from "react";
import { storageUtils } from "@/lib/storage-utils";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Gift,
  User,
  Phone,
  Wallet,
  Ticket,
  Sparkles,
  AlertCircle,
  MapPin,
  Store,
} from "lucide-react";

interface FormData {
  couponCode: string;
  name: string;
  phone: string;
  upiId: string;
  city: string;
  dealerName: string;
}

interface Message {
  type: "success" | "error" | "";
  content: string;
}

export default function QRCodeForm() {
  const [formData, setFormData] = useState<FormData>({
    couponCode: "",
    name: "",
    phone: "",
    upiId: "",
    city: "",
    dealerName: "",
  });
  const [message, setMessage] = useState<Message>({ type: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedReward, setSubmittedReward] = useState<number | null>(null);
  const [isCodeFromUrl, setIsCodeFromUrl] = useState<boolean>(false);
  const [rewardFromUrl, setRewardFromUrl] = useState<number | null>(null);

  // Use Next.js search params hook
  const searchParams = useSearchParams();

  useEffect(() => {
    // Read code and reward from URL parameters
    const codeFromUrl = searchParams.get("code");
    const rewardFromUrlParam = searchParams.get("reward");

    if (codeFromUrl) {
      setFormData((prev) => ({ ...prev, couponCode: codeFromUrl }));
      setIsCodeFromUrl(true);
    }

    if (rewardFromUrlParam) {
      const rewardValue = Number(rewardFromUrlParam);
      if (!isNaN(rewardValue) && rewardValue > 0) {
        setRewardFromUrl(rewardValue);
      }
    }
  }, [searchParams]);

  // Check if this coupon has already been submitted on this device
  const checkIfAlreadySubmitted = (couponCode: string): boolean => {
    try {
      const submissions = localStorage.getItem("coupon_submissions");
      if (submissions) {
        const submittedCodes = JSON.parse(submissions);
        return submittedCodes.includes(couponCode);
      }
    } catch (e) {
      console.error("Error checking submissions:", e);
    }
    return false;
  };

  // Save submission to local storage
  const saveSubmission = (submission: {
    couponCode: string;
    name: string;
    phone: string;
    upiId: string;
    city: string;
    dealerName: string;
    reward: number;
    submittedAt: string;
  }) => {
    try {
      // Save to submissions list
      const existingSubmissions = localStorage.getItem("reward_submissions");
      const submissions = existingSubmissions
        ? JSON.parse(existingSubmissions)
        : [];
      submissions.push(submission);
      localStorage.setItem("reward_submissions", JSON.stringify(submissions));

      // Also save to submitted codes for quick lookup
      const existingCodes = localStorage.getItem("coupon_submissions");
      const submittedCodes = existingCodes ? JSON.parse(existingCodes) : [];
      submittedCodes.push(submission.couponCode);
      localStorage.setItem(
        "coupon_submissions",
        JSON.stringify(submittedCodes),
      );

      return true;
    } catch (e) {
      console.error("Error saving submission:", e);
      return false;
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.couponCode.trim()) {
      setMessage({ type: "error", content: "Please enter a coupon code" });
      return false;
    }
    if (!formData.name.trim()) {
      setMessage({ type: "error", content: "Please enter your full name" });
      return false;
    }
    if (!formData.phone.trim()) {
      setMessage({ type: "error", content: "Please enter your phone number" });
      return false;
    }
    if (!formData.upiId.trim()) {
      setMessage({ type: "error", content: "Please enter your UPI ID" });
      return false;
    }
    if (!formData.city.trim()) {
      setMessage({ type: "error", content: "Please enter your city" });
      return false;
    }
    if (!formData.dealerName.trim()) {
      setMessage({ type: "error", content: "Please enter the dealer name" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    setMessage({ type: "", content: "" });

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    // Check if reward is available from URL
    if (!rewardFromUrl) {
      setMessage({
        type: "error",
        content: "Invalid QR code. Please scan the QR code again.",
      });
      setIsSubmitting(false);
      return;
    }

    // Check if already submitted on this device
    if (checkIfAlreadySubmitted(formData.couponCode)) {
      setMessage({
        type: "error",
        content: "This coupon has already been submitted from this device.",
      });
      setIsSubmitting(false);
      return;
    }

    // Try to update localStorage if on admin device (will silently fail if coupon doesn't exist)
    try {
      storageUtils.redeemCoupon(formData.couponCode, {
        name: formData.name,
        phone: formData.phone,
        email: "",
        upiId: formData.upiId,
        city: formData.city,
        dealerName: formData.dealerName,
      });
    } catch (e) {
      // Silently ignore - this is expected on user devices that don't have the coupon data
    }

    // Save submission locally
    const saved = saveSubmission({
      couponCode: formData.couponCode,
      name: formData.name,
      phone: formData.phone,
      upiId: formData.upiId,
      city: formData.city,
      dealerName: formData.dealerName,
      reward: rewardFromUrl,
      submittedAt: new Date().toISOString(),
    });

    if (saved) {
      // Show success screen with the reward from URL
      setSubmittedReward(rewardFromUrl);
    } else {
      setMessage({
        type: "error",
        content: "Error saving submission. Please try again.",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-3 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-orange-50">
      {/* Decorative Background - Simplified */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full w-72 h-72 -top-36 -left-36 bg-gradient-to-br from-sky-200/20 to-orange-200/20 blur-3xl" />
        <div className="absolute rounded-full w-72 h-72 -bottom-36 -right-36 bg-gradient-to-br from-sky-200/20 to-pink-200/20 blur-3xl" />
      </div>

      {/* Main Card */}
      <Card className="relative w-full max-w-[380px] border border-white/50 shadow-2xl bg-white/90 backdrop-blur-xl overflow-hidden rounded-2xl">
        {/* Top Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-orange-500 to-sky-500" />

        {submittedReward !== null ? (
          <div className="duration-500 animate-in fade-in zoom-in-95">
            <CardHeader className="pt-8 pb-2 text-center">
              <div className="relative mx-auto mb-4">
                <div className="relative flex items-center justify-center w-16 h-16 mx-auto rounded-full shadow-xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-500/30">
                  <Gift className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="mb-1 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Congratulations! 🎉
              </h1>
              <p className="text-xs text-slate-500">
                You have successfully claimed your reward
              </p>
            </CardHeader>

            <CardContent className="px-5 pb-6 space-y-4 text-center">
              <div className="relative p-5 overflow-hidden border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                <p className="mb-1 text-[10px] font-bold tracking-[0.2em] text-green-500 uppercase">
                  💰 Reward Unlocked
                </p>
                <div className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  ₹{submittedReward}
                </div>
              </div>

              <div className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl">
                <p className="mb-1 text-[10px] text-slate-400">
                  Amount will be credited to:
                </p>
                <div className="flex items-center justify-center gap-2 px-3 py-1.5 font-mono text-xs font-bold bg-white border border-slate-200 text-slate-700 rounded-lg">
                  <Wallet className="w-3 h-3 text-green-500" />
                  {formData.upiId}
                </div>
              </div>
            </CardContent>
          </div>
        ) : (
          <>
            {/* Header Brand Section */}
            <div className="px-4 py-2.5 text-center border-b bg-gradient-to-r from-sky-600 via-sky-500 to-orange-500">
              <h2 className="text-base font-bold tracking-wide text-white">
                🎁 Botivate Your Digital Rewards
              </h2>
              <p className="text-[9px] text-sky-100 tracking-widest uppercase">
                Scan. Earn. Botivate.
              </p>
            </div>

            {/* Progress Steps - Compact */}
            <div className="px-4 py-2.5 bg-white border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="flex items-center justify-center w-6 h-6 text-[10px] font-bold text-white rounded-full bg-gradient-to-br from-sky-500 to-sky-600">
                    ✓
                  </div>
                  <span className="text-[8px] font-semibold text-sky-600 uppercase">
                    Scan
                  </span>
                </div>

                <div
                  className={`flex-1 h-0.5 mx-1.5 rounded-full ${
                    formData.couponCode
                      ? "bg-gradient-to-r from-sky-500 to-sky-400"
                      : "bg-gray-200"
                  }`}
                />

                <div className="flex flex-col items-center gap-0.5">
                  <div
                    className={`flex items-center justify-center w-6 h-6 text-[10px] font-bold rounded-full ${
                      formData.couponCode
                        ? "bg-gradient-to-br from-sky-500 to-sky-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    2
                  </div>
                  <span
                    className={`text-[8px] font-semibold uppercase ${
                      formData.couponCode ? "text-sky-600" : "text-gray-400"
                    }`}
                  >
                    Details
                  </span>
                </div>

                <div className="flex-1 h-0.5 mx-1.5 bg-gray-200 rounded-full" />

                <div className="flex flex-col items-center gap-0.5">
                  <div className="flex items-center justify-center w-6 h-6 text-[10px] font-bold text-gray-400 bg-gray-100 rounded-full">
                    3
                  </div>
                  <span className="text-[8px] font-semibold text-gray-400 uppercase">
                    Reward
                  </span>
                </div>
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              {/* Coupon Code Section */}
              <div className="p-3 border-2 border-sky-200 border-dashed rounded-xl bg-sky-50/50">
                <label className="block mb-1.5 text-[10px] font-bold tracking-wider text-sky-600 uppercase">
                  🎫 Promo Code
                </label>
                <div className="relative">
                  <Ticket className="absolute w-4 h-4 text-sky-400 -translate-y-1/2 left-3 top-1/2" />
                  <Input
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={handleInputChange}
                    placeholder="ENTER CODE"
                    className={`pl-10 h-10 border-2 border-sky-200 bg-white focus:bg-white focus:border-sky-500 focus:ring-sky-500 font-mono text-center tracking-[0.2em] text-sm font-bold placeholder:font-normal placeholder:tracking-normal rounded-lg ${
                      isCodeFromUrl ? "bg-sky-50 cursor-not-allowed" : ""
                    }`}
                    autoComplete="off"
                    readOnly={isCodeFromUrl}
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold tracking-wider uppercase text-slate-500">
                  📋 Your Details
                </label>

                <div className="relative group">
                  <User className="absolute w-4 h-4 transition-colors -translate-y-1/2 left-3 top-1/2 text-slate-300 group-focus-within:text-sky-500" />
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="h-10 pl-10 text-sm transition-all border rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white focus:border-sky-500 focus:ring-sky-500 placeholder:text-slate-300"
                  />
                </div>

                <div className="relative group">
                  <Phone className="absolute w-4 h-4 transition-colors -translate-y-1/2 left-3 top-1/2 text-slate-300 group-focus-within:text-sky-500" />
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    className="h-10 pl-10 text-sm transition-all border rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white focus:border-sky-500 focus:ring-sky-500 placeholder:text-slate-300"
                  />
                </div>

                <div className="relative group">
                  <Wallet className="absolute w-4 h-4 transition-colors -translate-y-1/2 left-3 top-1/2 text-slate-300 group-focus-within:text-sky-500" />
                  <Input
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleInputChange}
                    placeholder="UPI ID (e.g. user@ybl)"
                    className="h-10 pl-10 text-sm transition-all border rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white focus:border-sky-500 focus:ring-sky-500 placeholder:text-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="relative group">
                    <MapPin className="absolute w-4 h-4 transition-colors -translate-y-1/2 left-3 top-1/2 text-slate-300 group-focus-within:text-sky-500" />
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="h-10 pl-10 text-sm transition-all border rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white focus:border-sky-500 focus:ring-sky-500 placeholder:text-slate-300"
                    />
                  </div>

                  <div className="relative group">
                    <Store className="absolute w-4 h-4 transition-colors -translate-y-1/2 left-3 top-1/2 text-slate-300 group-focus-within:text-sky-500" />
                    <Input
                      name="dealerName"
                      value={formData.dealerName}
                      onChange={handleInputChange}
                      placeholder="Dealer"
                      className="h-10 pl-10 text-sm transition-all border rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white focus:border-sky-500 focus:ring-sky-500 placeholder:text-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleSubmit}
                className="w-full h-11 text-sm font-bold text-white shadow-lg bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-orange-500 rounded-xl shadow-sky-500/25 active:scale-[0.98] transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    🚀 Claim My Reward
                    <Sparkles className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              {/* Error/Success Feedback */}
              {message.content && (
                <div
                  className={`text-center text-xs font-semibold p-3 rounded-xl border ${
                    message.type === "success"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-sky-50 text-sky-600 border-sky-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {message.type === "error" && (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    {message.content}
                  </div>
                </div>
              )}
            </CardContent>
          </>
        )}
      </Card>

      {/* Footer */}
      <div className="mt-3 text-center">
        <a
          href="https://www.botivate.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-slate-400 hover:text-sky-500 transition-colors"
        >
          ⚡ Powered By <span className="font-bold">Botivate</span>
        </a>
      </div>
    </div>
  );
}

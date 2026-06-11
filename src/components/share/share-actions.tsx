"use client";

import { Check, Copy, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";

type ShareActionsProps = {
  title: string;
  text?: string;
};

export function ShareActions({ title, text }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);

  function getShareUrl() {
    return typeof window === "undefined" ? "" : window.location.href;
  }

  async function copyLink() {
    const currentUrl = getShareUrl();

    if (!currentUrl) {
      return;
    }

    await navigator.clipboard?.writeText(currentUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function share() {
    const currentUrl = getShareUrl();
    const shareText = text || "Cek produk pilihan dari INA BEAUTY.";

    if (navigator.share) {
      await navigator.share({
        title,
        text: shareText,
        url: currentUrl
      });
      return;
    }

    await copyLink();
  }

  function shareToWhatsApp() {
    const currentUrl = getShareUrl();
    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
      `${text || title}${currentUrl ? `\n${currentUrl}` : ""}`
    )}`;

    window.open(whatsappShareUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="border-t border-blush-100 pt-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black text-ink">Bagikan produk</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Kirim link produk ke teman atau simpan untuk nanti.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={share}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-4 text-sm font-bold text-white transition hover:bg-zinc-700"
          >
            <Share2 className="h-4 w-4" />
            Bagikan
          </button>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-blush-100 bg-white text-ink transition hover:bg-blush-50"
            aria-label={copied ? "Link tersalin" : "Salin link"}
            title={copied ? "Link tersalin" : "Salin link"}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={shareToWhatsApp}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white transition hover:bg-emerald-600"
            aria-label="Bagikan via WhatsApp"
            title="Bagikan via WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
      {copied ? (
        <p className="mt-3 rounded-2xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
          Link produk sudah disalin.
        </p>
      ) : null}
    </div>
  );
}

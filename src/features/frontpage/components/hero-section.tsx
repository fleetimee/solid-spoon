"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Corrected path based on project structure
import { ArrowUpRight, CirclePlay } from "lucide-react";
import Image from "next/image";

// Helper function to get YouTube embed URL
function getYouTubeEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    let videoId = urlObj.searchParams.get("v");
    // Handle short URLs like youtu.be/VIDEO_ID
    if (!videoId && urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.substring(1);
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch (e) {
    console.error("Invalid YouTube URL:", url, e);
    return null;
  }
}

interface HeroProps {
  heroYoutubeLink: string | null;
}

export function Hero({ heroYoutubeLink }: HeroProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center overflow-hidden border-b border-accent">
      <div className="max-w-screen-xl w-full flex flex-col lg:flex-row mx-auto items-center justify-between gap-y-14 gap-x-10 px-6 py-12 lg:py-0">
        <div className="max-w-xl">
          <Badge className="rounded-full py-1 border-none">
            Just released v1.0.0
          </Badge>
          <h1 className="mt-6 max-w-[20ch] text-3xl xs:text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold !leading-[1.2] tracking-tight">
            Find Your Perfect Space, Effortlessly
          </h1>
          <p className="mt-6 max-w-[60ch] xs:text-lg">
            Tired of searching for the right meeting room or event space? Our
            platform makes booking simple. Browse available rooms, check
            amenities, and reserve your spot in minutes. Get started today!
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
            <Link href="#rooms">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full text-base"
              >
                Find a Room <ArrowUpRight className="!h-5 !w-5" />
              </Button>
            </Link>
            {/* How It Works Button with Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto rounded-full text-base shadow-none"
                  disabled={!heroYoutubeLink} // Disable if no link
                >
                  <CirclePlay className="!h-5 !w-5" /> How It Works
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[650px] md:max-w-[800px] lg:max-w-[900px]">
                <DialogHeader>
                  <DialogTitle>How It Works</DialogTitle>
                </DialogHeader>
                <div className="aspect-video">
                  {" "}
                  {/* Maintain 16:9 aspect ratio */}
                  {getYouTubeEmbedUrl(heroYoutubeLink) ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={getYouTubeEmbedUrl(heroYoutubeLink)!} // Use non-null assertion as we checked
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="rounded-md"
                    ></iframe>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      Video not available.
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="relative lg:max-w-lg xl:max-w-xl w-full aspect-square">
          <Image
            src="/hero-image.png"
            fill
            alt=""
            className="object-cover object-[center_30%] rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface RoomImageGalleryProps {
  images: string[];
}

export function RoomImageGallery({ images }: RoomImageGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const openImageModal = (index: number) => {
    setModalImageIndex(index);
    setShowModal(true);
  };

  const navigateModalImage = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setModalImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setModalImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      navigateModalImage("next");
    } else if (e.key === "ArrowLeft") {
      navigateModalImage("prev");
    } else if (e.key === "Escape") {
      setShowModal(false);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[400px] bg-muted flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground">Tidak ada gambar tersedia</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Main Carousel */}
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div
                className="relative w-full h-[400px] rounded-lg overflow-hidden cursor-pointer"
                onClick={() => openImageModal(index)}
                role="button"
                tabIndex={0}
                aria-label={`Lihat gambar ukuran penuh ${index + 1} dari ${images.length}`}
                onKeyDown={(e) => e.key === "Enter" && openImageModal(index)}
              >
                <Image
                  src={image}
                  alt={`Room image ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-black/30 hover:bg-black/50 border-none text-white" />
        <CarouselNext className="right-2 bg-black/30 hover:bg-black/50 border-none text-white" />

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {current + 1} / {images.length}
        </div>
      </Carousel>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 transition-all",
                current === index
                  ? "ring-2 ring-primary"
                  : "opacity-70 hover:opacity-100"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`Room thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Full-size Image Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent
          className="!max-w-[95vw] !w-[95vw] !max-h-[95vh] !h-[95vh] p-0 bg-black/95 border-none data-[state=open]:duration-300"
          onKeyDown={handleKeyDown}
          aria-describedby={undefined}
          style={{
            maxWidth: "95vw",
            width: "95vw",
            maxHeight: "95vh",
            height: "95vh",
          }}
        >
          {/* Hidden title for accessibility - positioned absolutely to not affect layout */}
          <DialogTitle className="absolute top-0 left-0 opacity-0 pointer-events-none">
            <VisuallyHidden>
              Room image {modalImageIndex + 1} of {images.length}
            </VisuallyHidden>
          </DialogTitle>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-black/50 text-white z-30 hover:bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
            aria-label="Close image viewer"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Main Image Container - Full dialog center */}
          <div className="w-full h-full flex items-center justify-center p-6">
            <div className="relative w-full h-full max-w-full max-h-full">
              <Image
                src={images[modalImageIndex]}
                alt={`Room image ${modalImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="95vw"
                priority
              />
            </div>
          </div>

          {/* Navigation - Previous */}
          {images.length > 1 && (
            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="ml-4 bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm"
                onClick={() => navigateModalImage("prev")}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            </div>
          )}

          {/* Navigation - Next */}
          {images.length > 1 && (
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-4 bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm"
                onClick={() => navigateModalImage("next")}
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <div className="bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                {modalImageIndex + 1} / {images.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

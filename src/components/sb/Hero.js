import { storyblokEditable } from "@storyblok/react";
import Link from "next/link";

export default function Hero({ blok }) {
  console.log("HERO blok:", blok);
  console.log("backgroundColor:", blok.backgroundColor);

  const validColor = typeof blok.backgroundColor === "string" && blok.backgroundColor.trim() !== ""
    ? blok.backgroundColor.trim()
    : "#f5f5f5";  // fallback färg

  return (
    <div
      {...storyblokEditable(blok)}
      style={{
        backgroundColor: validColor,
        ...(blok.background_image?.filename
          ? {
              backgroundImage: `url(${blok.background_image.filename})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
        ),
      }}
      className="p-6"
    >
      <div className="container mx-auto px-4 max-w-screen-xl">
        {blok.title && (
          <h1 className="text-center text-[3rem] font-bold pt-12 mb-4 text-[#333] font-sans">
            {blok.title}
          </h1>
        )}
        {blok.text && (
          <h4 className="text-center text-sm text-gray-600 mt-2 w-7/10 mx-auto">
            {blok.text}
          </h4>
        )}
        {blok.button?.cached_url && (
          <Link
            href={`/${blok.button.cached_url}`}
            target={blok.button.target || "_self"}
            className="block text-center border border-black text-black bg-transparent px-12 py-2 rounded-none hover:bg-black hover:text-white transition mt-4 mb-6 mx-auto w-40 font-bold whitespace-nowrap"
          >
            {blok.button.name || "Shop All"}
          </Link>
        )}
        {blok.image?.filename && (
          <img
            src={blok.image.filename}
            alt={blok.image.alt || "Hero image"}
            className="mx-auto w-full h-auto py-12"
          />
        )}
      </div>
    </div>
  );
}

"use client";

import { storyblokEditable } from "@storyblok/react/rsc";
import { cn } from "@/utils/cn";
import NextLink from "next/link";
import React, { useState, useEffect } from "react";

const menuData = [
  {
    label: "Products",
    href: "/shop",
    children: [
      {
        label: "Men",
        href: "/shop/men",
        children: [
          {
            label: "The Set Winterjaket",
            href: "/products/men/the-set-winterjaket",
          },
        ],
      },
      {
        label: "Women",
        href: "/shop/women",
        children: [
          {
            label: "JJXX Lexington Handbag",
            href: "/products/women/jjxx_lexington_handbag",
          },
        ],
      },
    ],
  },
  {
    label: "About us",
    href: "/about-me",
  },
];

function MenuItems({ items }) {
  return (
    <ul className="flex space-x-4 md:space-x-6 relative z-50">
      {items.map((item) => (
        <li key={item.label} className="relative group">
          <NextLink
            href={item.href}
            className="inline-block px-3 py-2 hover:underline text-sm font-semibold"
          >
            {item.label}
          </NextLink>

          {item.children && (
            <ul className="absolute left-0 top-full mt-0 hidden group-hover:block bg-white border border-gray-200 shadow-lg rounded min-w-[160px] z-50">
              {item.children.map((child) => (
                <li key={child.label} className="relative group">
                  <NextLink
                    href={child.href}
                    className="block px-4 py-2 hover:bg-[#fbd6e1] text-sm whitespace-nowrap"
                  >
                    {child.label}
                  </NextLink>

                  {child.children && (
                    <ul className="absolute left-full top-0 mt-0 ml-0 hidden group-hover:block bg-white border border-gray-200 shadow-lg rounded min-w-[160px] z-50">
                      {child.children.map((gc) => (
                        <li key={gc.label}>
                          <NextLink
                            href={gc.href}
                            className="block px-4 py-2 hover:bg-[#fbd6e1] text-sm whitespace-nowrap"
                          >
                            {gc.label}
                          </NextLink>
                        </li>
                      ))}
                    </ul>
                  )}

                </li>
              ))}
            </ul>
          )}

        </li>
      ))}
    </ul>
  );
}

const STORYBLOK_TOKEN = process.env.NEXT_PUBLIC_STORYBLOK_DELIVERY_API_ACCESS_TOKEN;

export default function Header({ blok, darkNavbar }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const res = await fetch(
        `https://api.storyblok.com/v2/cdn/stories?starts_with=products/&token=${STORYBLOK_TOKEN}`
      );
      const data = await res.json();
      setAllProducts(data.stories || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length > 1) {
      setResults(
        allProducts.filter((story) =>
          story.content.productName?.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setResults([]);
    }
  };

  return (
    <header
      {...storyblokEditable(blok)}
      className={cn(
        "sticky top-0 z-50 border-b border-gray-200 bg-[#fbd6e1]",
        { "bg-black text-white": darkNavbar }
      )}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center px-4 py-2 gap-2">
        {blok.logo && blok.logo.filename && (
          <NextLink href="/home" passHref>
            <img
              src={blok.logo.filename}
              alt="Logo"
              width={70}
              height={70}
              className="object-contain mr-4 hover:scale-110 cursor-pointer transition-transform duration-300"
            />
          </NextLink>
        )}

        <nav className="flex-1">
          <MenuItems items={menuData} />
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder={blok.search_placeholder || "Search..."}
              className="px-3 py-2 rounded border-2 border-[#d98ba3] bg-[#fefefeb0] focus:outline-none"
              value={search}
              onChange={handleSearch}
            />
            {search.length > 1 && (
              <ul className="absolute right-0 mt-1 max-h-60 w-60 overflow-auto rounded border border-gray-300 bg-white shadow-lg z-50">
                {loading && <li className="px-4 py-2 text-gray-400">Loading...</li>}
                {!loading && results.length === 0 && (
                  <li className="px-4 py-2 text-gray-400">No results</li>
                )}
                {results.map((story) => (
                  <li key={story.uuid} className="p-2 hover:bg-gray-100 cursor-pointer">
                    <NextLink
                      href={`/${story.full_slug}`}
                      className="block w-full"
                      onClick={() => {
                        setSearch("");
                        setResults([]);
                      }}
                    >
                      {story.content.productName || story.name}
                    </NextLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="w-10 h-10 bg-[#d98ba3] rounded flex items-center justify-center hover:bg-[#eab5c2]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
              <path d="M2 3h3l3.6 12.59a2 2 0 0 0 2 1.41h7.7a2 2 0 0 0 2-1.6L22 7H6" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}

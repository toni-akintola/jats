import React from "react";
import Image from "next/image";
const listings = [
  {
    id: 1,
    location: "Moss Beach, California",
    subtitle: "Beach and ocean views",
    dates: "5 nights · Feb 26 – Mar 3",
    price: 4303,
    rating: 4.92,
    isFavorite: false,
    imageUrl: "/moss-beach.png",
  },
  {
    id: 2,
    location: "Moss Beach, California",
    subtitle: "Beach and ocean views",
    dates: "5 nights · Feb 18 – 23",
    price: 23965,
    rating: 4.91,
    isFavorite: true,
    imageUrl: "/moss-beach.png",
  },
  {
    id: 3,
    location: "Daly City, California",
    subtitle: "Beach and bay views",
    dates: "5 nights · Mar 6 – 11",
    price: 3153,
    rating: 4.82,
    isFavorite: true,
    imageUrl: "/moss-beach.png",
  },
  {
    id: 4,
    location: "Half Moon Bay, California",
    subtitle: "Beach and ocean views",
    dates: "5 nights · Feb 24 – Mar 1",
    price: 2491,
    rating: 4.82,
    isFavorite: true,
    imageUrl: "/moss-beach.png",
  },
];
const Listings = () => {
  return (
    <div className="max-w-[2520px] mx-auto px-4 sm:px-6 bg-white rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {listings.map((listing) => (
          <div key={listing.id} className="group">
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src={listing.imageUrl || "/placeholder.svg"}
                alt={listing.location}
                className="object-cover w-full h-full group-hover:scale-105 transition"
                width={500}
                height={500}
              />
              <button className="absolute top-3 right-3 p-2">
                <svg
                  viewBox="0 0 32 32"
                  className="h-6 w-6 fill-white stroke-black stroke-2"
                  style={{ overflow: "visible" }}
                >
                  <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z" />
                </svg>
              </button>
              {listing.isFavorite && (
                <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-md text-xs font-medium">
                  Guest favorite
                </div>
              )}
            </div>
            <div className="mt-2">
              <div className="flex justify-between">
                <h3 className="font-medium">{listing.location}</h3>
                <div className="flex items-center gap-1">
                  <svg viewBox="0 0 32 32" className="h-4 w-4 fill-current">
                    <path d="M15.094 1.579l-4.124 8.885-9.86 1.27a1 1 0 0 0-.542 1.736l7.293 6.565-1.965 9.852a1 1 0 0 0 1.483 1.061L16 25.951l8.625 4.997a1 1 0 0 0 1.482-1.06l-1.965-9.853 7.293-6.565a1 1 0 0 0-.541-1.735l-9.86-1.271-4.127-8.885a1 1 0 0 0-1.814 0z" />
                  </svg>
                  <span>{listing.rating}</span>
                </div>
              </div>
              <p className="text-muted-foreground">{listing.subtitle}</p>
              <p className="text-muted-foreground">{listing.dates}</p>
              <p className="mt-2">
                <span className="font-medium">${listing.price}</span> total
                before taxes
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Listings;

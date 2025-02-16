"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import loadingAnimation from "./loading-animation.json";

export default function LoadingAnimation() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="w-96 h-96 mx-auto">
      <Lottie animationData={loadingAnimation} loop={true} />
    </div>
  );
}

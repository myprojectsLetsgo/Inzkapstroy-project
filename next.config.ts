import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Убираем output: "export" - это блокирует middleware и API
  images: {
    unoptimized: true, // Оставляем для изображений
  },
  // trailingSlash: true, // Тоже убираем (не нужно для серверного режима)
};

export default nextConfig;

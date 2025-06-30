"use client";

import NavMain from "@/components/navMain";
import NavMainMobile from "@/components/navMainMobile";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  return (
    <ProtectedRoute>
      {children}
      {!isMobile && (
        <div className='fixed bottom-3 left-1/2 -translate-x-1/2'>
          <NavMain />
        </div>
      )}
      {isMobile && (
        <div className='fixed bottom-3 right-10'>
          <NavMainMobile />
        </div>
      )}
    </ProtectedRoute>
  );
}

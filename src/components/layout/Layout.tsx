import { ReactNode, useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ProfileCompletionModal from "@/components/modals/ProfileCompletionModal";
import { getCachedUserProfile } from "@/utils/profileValidation";
import { supabase } from "@/integrations/supabase/client";

interface LayoutProps {
  children: ReactNode;
  hideNavbar?: boolean;
  hideFooter?: boolean;
}

const Layout = ({ children, hideNavbar = false, hideFooter = false }: LayoutProps) => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const handleOpenModal = () => {
      // Refresh current user data if available
      supabase.auth.getUser().then(({ data: { user } }) => {
        const meta = user?.user_metadata || {};
        const cached = getCachedUserProfile();
        setProfileData({
          name: meta.full_name || meta.name || cached?.name || "",
          location: meta.location || cached?.location || "",
          bio: meta.bio || cached?.bio || "",
          interests: meta.interests || cached?.interests || [],
          availability: meta.availability || cached?.availability || [],
        });
        setProfileModalOpen(true);
      });
    };

    window.addEventListener("outgo-open-profile-completion", handleOpenModal);
    return () => {
      window.removeEventListener("outgo-open-profile-completion", handleOpenModal);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}
      <main className={`flex-1 ${!hideNavbar ? "pt-16 lg:pt-20" : ""}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}

      <ProfileCompletionModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        initialData={profileData}
        onProfileUpdated={(updated) => {
          setProfileData(updated);
        }}
      />
    </div>
  );
};

export default Layout;

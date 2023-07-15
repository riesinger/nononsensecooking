import { mdiChefHat, mdiMenu, mdiPotSteamOutline } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";

const MenuContent = ({ t }) => (
  <nav className="flex items-center gap-8 flex-wrap max-w-full">
    <Link
      className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 flex items-cennter gap-2"
      href="/r"
      prefetch={false}
    >
      <Icon path={mdiPotSteamOutline} size={1} />
      <span>{t("link.allrecipes")}</span>
    </Link>
    <SearchBar placeholder={t("searchbar.placeholder")} />
  </nav>
);

const Header = () => {
  const { t } = useTranslation("header");
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    router.events.on("routeChangeStart", closeMenu);

    return () => {
      router.events.off("routeChangeStart", closeMenu);
    };
  }, [router]);

  return (
    <header
      className="px-8 py-4 m-0 w-full flex items-center justify-between flex-wrap
    gap-6 relative"
    >
      <Link
        className="flex items-center max-w-full cursor-pointer text-neutral-900 dark:text-neutral-100 gap-3"
        href="/"
      >
        <div className="bg-brand w-12 h-12 rounded-md flex items-center justify-center">
          <Icon
            className="text-neutral-100"
            path={mdiChefHat}
            size={1.5}
            rotate={10}
          />
        </div>
        <h1 className="text-2xl m-0 font-medium tracking-tight hidden md:block">
          NoNonsenseCooking
        </h1>
      </Link>
      <button
        className="outline-none appearance-none cursor-pointer bg-transparent border-none text-neutral-900 dark:text-neutral-100 w-12 h-12 md:hidden"
        onClick={toggleMenu}
      >
        <Icon path={mdiMenu} size={1} className="ml-3" />
      </button>
      <div className="hidden md:block">
        <MenuContent t={t} />
      </div>
      <div
        className={clsx(
          "absolute top-full z-10 left-0 right-0 w-full shadow-lg bg-neutral-100 dark:bg-neutral-900 p-8 transition md:hidden",
          menuOpen && "visible pointer-events-auto opacity-100 scale-100",
          !menuOpen && "invisible pointer-events-none opacity-0 scale-95"
        )}
      >
        <MenuContent t={t} />
      </div>
    </header>
  );
};

export default Header;

import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import {
  mdiChefHat,
  mdiLogout,
  mdiMenu,
  mdiPlus,
  mdiPotSteamOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import PocketBase from "pocketbase";
import { Fragment, useEffect, useState } from "react";
import SearchBar from "./SearchBar";

function StyledLink(
  props: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
    LinkProps & {
      children?: React.ReactNode;
    } & React.RefAttributes<HTMLAnchorElement>
) {
  return (
    <Link
      className="dark:text-zinc-100 hover:dark:text-zinc-50 text-zinc-900 hover:text-zinc-950 transition-color flex items-center gap-2"
      {...props}
    />
  );
}

function AccountMenu({ userInitials }: { userInitials: string }) {
  return (
    <HeadlessMenu as="div" className="relative inline-block text-left">
      <HeadlessMenu.Button className="inline-flex w-10 h-10 justify-center rounded-full border-2 border-white items-center shadow-inset bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
        {userInitials}
      </HeadlessMenu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 -translate-y-4"
        enterTo="transform opacity-100 translate-y-0"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <HeadlessMenu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <HeadlessMenu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-violet-500 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <Icon size={0.75} path={mdiLogout} />
                  Sign out
                </button>
              )}
            </HeadlessMenu.Item>
          </div>
        </HeadlessMenu.Items>
      </Transition>
    </HeadlessMenu>
  );
}
const Header = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_HOST);

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
    <header className="py-6 px-8 m-0 w-full flex items-center justify-between flex-wrap gap-6 relative">
      <Link
        className="flex items-center cursor-pointer text-zinc-900 dark:text-zinc-100 gap-6"
        href="/"
        passHref
      >
        <div className="w-12 h-12 rounded-md flex items-center justify-center text-white from-indigo-800 to-blue-500 bg-gradient-to-tr">
          <Icon path={mdiChefHat} size={1} rotate={7.5} />
        </div>
        <h1 className="hidden md:inline-block text-xl font-medium tracking-wide">
          NoNonsenseCooking
        </h1>
      </Link>
      <button
        className="outline-none appearance-none cursor-pointer bg-transparent border-none text-zinc-100 width-6 height-6 lg:hidden rounded-md focus:ring-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 ring-zinc-900 dark:ring-zinc-100 p-3"
        onClick={toggleMenu}
      >
        <Icon path={mdiMenu} size={1} />
      </button>
      <div
        className={clsx(
          "absolute z-20 top-full left-0 right-0 w-full shadow bg-text-zinc-100 dark:bg-zinc-900 p-8  origin-top transition",
          !menuOpen && "invisible pointer-events-none -translate-y-6 opacity-0",
          menuOpen && "visible pointer-events-auto translate-y-0 opacity-100",
          "lg:static lg:visible lg:pointer-events-auto lg:p-0 lg:opacity-100 lg:translate-y-0 lg:shadow-none lg:w-auto lg:top-initial"
        )}
      >
        <nav className="flex items-start gap-8 wrap flex-col lg:items-center lg:flex-row">
          <StyledLink href="/r/new" passHref prefetch={false}>
            <Icon path={mdiPlus} size={1} />
            <span>{t("header.link.newrecipe")}</span>
          </StyledLink>
          <StyledLink href="/r" passHref prefetch={false}>
            <Icon path={mdiPotSteamOutline} size={1} />
            <span>{t("header.link.allrecipes")}</span>
          </StyledLink>
          <SearchBar placeholder={t("header.searchbar.placeholder")} />
          {false && pb.authStore.isValid && (
            <AccountMenu userInitials={pb.authStore.model.email.slice(0, 2)} />
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

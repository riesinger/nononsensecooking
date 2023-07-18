import { mdiMagnify } from "@mdi/js";
import Icon from "@mdi/react";
import debounce from "lodash/debounce";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { RecipeInIndex } from "../models/Recipe";
import IconForDiet from "./IconForDiet";

interface Props {
  placeholder: string;
}

const SearchBar = ({ placeholder }: Props) => {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // This eslint rule seems to not be able to pickup the dependency on searchTerm
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchSearchResults = useCallback(
    debounce(fetchSearchResults, 250, {
      maxWait: 1500,
    }),
    [],
  );

  useEffect(() => {
    function handler() {
      setSearchResults([]);
      debouncedFetchSearchResults.cancel();
    }
    router.events.on("routeChangeStart", handler);
    return () => {
      router.events.off("routeChangeStart", handler);
    };
  }, [debouncedFetchSearchResults, router]);

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
    // TODO: Debouncing
    // TODO: Error handling
    const searchTerm = encodeURIComponent(event.target.value);
    console.log("Search term", searchTerm);

    debouncedFetchSearchResults(searchTerm);
  }

  async function fetchSearchResults(searchTerm: string) {
    if (searchTerm === "") {
      setSearchResults([]);
      return;
    }
    console.log("Fetching search results for", searchTerm);
    const results = await (
      await fetch(`/api/search?query=${searchTerm}`, {
        headers: {
          "Accept-Language": router.locale,
        },
      })
    ).json();
    setSearchResults(results);
  }

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
    setSearchResults([]);
  }

  return (
    <form
      className="relative min-w-[20ch] rounded bg-neutral-50 dark:bg-neutral-800 ring-1 ring-neutral-950/20 dark:ring-neutral-50/20 pl-2 flex items-center group shadow"
      action={`${router.locale}/search`}
      method="GET"
      onSubmit={onSearch}
    >
      <button
        type="submit"
        value="Suchen"
        className="w-8 h-8 text-neutral-900 dark:text-neutral-100 flex justify-center items-center"
      >
        <Icon path={mdiMagnify} size={0.75} className="m-0" />
      </button>
      <input
        className="bg-transparent appearance-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500 border-none text-neutral-900 rounded dark:text-neutral-100"
        placeholder={placeholder}
        name="query"
        onChange={onChange}
        autoComplete="off"
      />
      {searchResults.length > 0 ? (
        <div className="bg-neutral-50 dark:bg-neutral-800 absolute z-10 top-12 right-0 min-w-full rounded py-2 px-4 shadow-lg">
          <ul className="list-none p-0 m-0">
            {searchResults.map(({ item }: { item: RecipeInIndex }) => (
              <li className="my-4" key={item.slug}>
                <Link
                  href={`/r/${item.slug}`}
                  key={item.id}
                  className="flex items-center gap-2 text-neutral-800 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-100"
                >
                  <IconForDiet diet={item.diet} />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </form>
  );
};

export default SearchBar;

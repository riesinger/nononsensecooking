import { mdiMagnify } from "@mdi/js";
import Icon from "@mdi/react";
import debounce from "lodash/debounce";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import Input from "./Input";
import SearchResult from "./SearchResult";

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
    []
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
    console.log("Searching for", searchTerm);
    const results = await (
      await fetch(`/api/search?query=${searchTerm}`, {
        headers: {
          "Accept-Language": router.locale,
        },
      })
    ).json();
    console.log("Search results", results);
    setSearchResults(results);
  }

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
    setSearchResults([]);
  }

  return (
    <form
      action={`${router.locale}/search`}
      method="GET"
      onSubmit={onSearch}
      className="relative"
    >
      <Input
        leftDecoration={
          <Icon
            className="text-zinc-600 dark:text-zinc-300"
            size={1}
            path={mdiMagnify}
          />
        }
        type="text"
        placeholder={placeholder}
        name="query"
        onChange={onChange}
        autoComplete="off"
      />
      {searchResults.length > 0 ? (
        <div className="bg-zinc-300 dark:bg-zinc-800 py-4 px-4 absolute z-10 top-12 right-0 min-w-full rounded-md">
          <ul className="list-none p-0 m-0 space-y-4">
            {searchResults.map((item) => (
              <SearchResult
                key={item.id}
                slug={item.slug}
                name={item.name}
                diet={item.diet}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </form>
  );
};

export default SearchBar;

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
import styled from "styled-components";
import SearchResult from "./SearchResult";

const StyledForm = styled.form`
  position: relative;
  width: 40ch;
  max-width: 100%;
  height: 3rem;
`;

const SearchInput = styled.input`
  font-family: var(--font-stack);
  font-size: var(--font-size-base);
  background: var(--color-background-alt);
  border-radius: var(--rounded);
  border: none;
  padding: 0.75rem 1rem;
  appearance: none;
  color: var(--color-text-primary);
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  height: 3rem;
`;

const SearchButton = styled.button`
  background: var(--color-primary);
  position: absolute;
  right: 0;
  height: 3rem;
  width: 3rem;
  appearance: none;
  cursor: pointer;
  border-radius: var(--rounded);
  outline: none;
  border: none;
  color: hsla(var(--palette-gray-00), 100%);
`;

const SearchResultsSheet = styled.div`
  background: var(--color-background-alt-solid);
  padding: 0.5rem 1rem;
  position: absolute;
  z-index: 10;
  top: 3rem;
  right: 0%;
  min-width: 100%;
  border-radius: var(--rounded);
`;

const SearchResultsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

interface Props {
  placeholder: string;
}

const SearchBar = ({ placeholder }: Props) => {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
  }, []);

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
    // TODO: Debouncing
    // TODO: Error handling
    const searchTerm = encodeURIComponent(event.target.value);
    console.log("Search term", searchTerm);

    debouncedFetchSearchResults(searchTerm);
  }

  async function fetchSearchResults(searchTerm: string) {
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
    <StyledForm
      action={`${router.locale}/search`}
      method="GET"
      onSubmit={onSearch}
    >
      <SearchInput
        placeholder={placeholder}
        name="query"
        onChange={onChange}
        autoComplete="off"
      />
      <SearchButton type="submit" value="Suchen">
        <Icon path={mdiMagnify} size={1} />
      </SearchButton>
      {searchResults.length > 0 ? (
        <SearchResultsSheet>
          <SearchResultsList>
            {searchResults.map((r) => (
              <SearchResult
                key={r.item.id}
                slug={r.item.fullSlug}
                name={r.item.name}
                diet={r.item.diet}
              />
            ))}
          </SearchResultsList>
        </SearchResultsSheet>
      ) : null}
    </StyledForm>
  );
};

export default SearchBar;

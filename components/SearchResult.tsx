import { SlimRecipe } from "../models/Recipe";
import IconForDiet from "./IconForDiet";
import Link from "./Link";

interface Props {
  name: string;
  slug: string;
  diet: SlimRecipe["diet"];
}

function getHref(slug: string) {
  return `/r/${slug}`;
}

const SearchResult = ({ slug, name, diet }: Props) => (
  <li>
    <Link className="flex items-center gap-2" ghost href={getHref(slug)}>
      <IconForDiet diet={diet} />
      <span>{name}</span>
    </Link>
  </li>
);

export default SearchResult;

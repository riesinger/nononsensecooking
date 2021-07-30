# NoNonsense.cooking

NoNonsenseCooking is a modern website for curated recipes trying to cut out all of the unnecessary bloat of typical cooking websites.

## Contributing

Do you want to add your favorite recipe? It's quite easy!

First, fork this repository and clone it: `gh repo fork riesinger/nononsensecooking`. Then, install all the dependencies with `npm install` and run the script `npm run new-recipe`. This will create an empty recipe YAML file in the `recipes` directory. Edit the file to contain your recipe. You can take the other recipes as an inspiration on how to fill out the YAML file.
If you have an image for your recipe, place a 1600x1040px version of it in the `public/img/recipes` directory. Make sure to minify it for brevity 😉

To run the service locally, run `npm start dev` and head to `http://localhost:3000`. You should be able to see your recipe in the "All Recipes" section or via the search. Note that you need to restart your dev server when you add a new recipe. Also, the search is using the "recipe index", which you can generate using `npm run generate-recipe-index`.

_Please don't copy recipes from the internet or cookbooks. Also, only use images you took yourself._


## License

This content of this repository is covered under two licenses.

The recipes and images are licensed under a [Creative Commons Attibution 4.0 license (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). This applies to everything in the `./recipes` and `./public/img/recipes` directories.
You can find a copy of the license in the `LICENSE-recipes` file.

The source code for the site is licensed under the MIT License.
You can find a copy of the license in the `LICENSE-code` file.

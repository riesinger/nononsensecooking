package models

type RecipeUpdate map[string]Update

type Update struct {
	Message string
}

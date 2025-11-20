# Recipes Feature

This feature module contains all recipe-related functionality.

## Structure

- `components/` - Recipe UI components
  - `RecipesManager.tsx` - Main recipes management component
  - `RecipesCreateForm.tsx` - Form for creating new recipes
  - `RecipesTable.tsx` - Table displaying recipe list
  - `BasicInfo.tsx` - Basic recipe information form fields
  - `DirectionsEditor.tsx` - Recipe directions editor
  - `UnitsModel.tsx` - Units modal/popup
  - `ingredients/` - Ingredient-related components
    - `IngredientsEditor.tsx` - Main ingredients editor
    - `IngredientRow.tsx` - Single ingredient row
    - `IngredientsList.tsx` - List of ingredients
    - `FoodReferencesSearch.tsx` - Food references search component
    - `FoodReferencesResults.tsx` - Search results display

- `hooks/` - React hooks
  - `useRecipes.ts` - Main recipes hook (list, create)
  - `useUnit.ts` - Units data hook
  - `useFoodReferences.ts` - Food references search hook

- `schema/` - Zod validation schemas
  - `recipeSchema.ts` - Recipe validation schema

- `services/` - API services
  - `recipesService.ts` - Recipe, units, and food references API calls

## Usage

```typescript
import { useRecipes, RecipesManager } from '@/features/recipes';
```

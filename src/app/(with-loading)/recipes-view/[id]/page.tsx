'use client';

import { useParams } from 'next/navigation';
import RecipesViewDetails from '@/features/recipes-view/RecipesViewDetails';

export default function RecipeViewDetailPage() {
    const params = useParams();
    const recipeId = params?.id as string;

    return <RecipesViewDetails recipeId={recipeId} />;
}

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  canonical?: string;
}

const defaultMeta = {
  title: 'BIOWELL - Your Digital Health & Wellness Coach',
  description: 'Transform your health with AI-powered nutrition tracking, personalized supplement recommendations, and expert wellness guidance. Start your journey to optimal health today.',
  keywords: [
    'health', 'wellness', 'nutrition', 'supplements', 'fitness', 'AI health coach',
    'personalized nutrition', 'health tracking', 'wellness app', 'digital health'
  ],
  image: '/og-image.jpg',
  url: 'https://biowell.ai',
  type: 'website' as const,
  author: 'BIOWELL Team'
};

export function SEO({
  title,
  description = defaultMeta.description,
  keywords = defaultMeta.keywords,
  image = defaultMeta.image,
  url = defaultMeta.url,
  type = defaultMeta.type,
  author = defaultMeta.author,
  publishedTime,
  modifiedTime,
  tags,
  structuredData
}: Readonly<{
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  structuredData?: object;
}>)

// Page-specific SEO components
export function HomeSEO() {
  return (
    <SEO
      title="Home"
      description="Your AI-powered digital health coach. Get personalized nutrition advice, supplement recommendations, and wellness guidance tailored to your unique needs."
      keywords={[...defaultMeta.keywords, 'home', 'start', 'begin health journey']}
    />
  );
}

export function SupplementsSEO() {
  return (
    <SEO
      title="Supplements"
      description="Discover science-backed supplement recommendations tailored to your health goals. Shop premium vitamins, minerals, and nutraceuticals with evidence-based guidance."
      keywords={[...defaultMeta.keywords, 'supplements', 'vitamins', 'minerals', 'nutraceuticals', 'evidence-based']}
      url="/supplements"
    />
  );
}

export function NutritionSEO() {
  return (
    <SEO
      title="Nutrition"
      description="Track your nutrition with AI-powered food analysis. Get personalized meal plans, recipes, and dietary recommendations based on your health goals."
      keywords={[...defaultMeta.keywords, 'nutrition tracking', 'meal plans', 'recipes', 'dietary advice']}
      url="/nutrition"
    />
  );
}

export function FitnessSEO() {
  return (
    <SEO
      title="Fitness"
      description="Achieve your fitness goals with personalized workout plans, progress tracking, and expert guidance. From strength training to cardio, we've got you covered."
      keywords={[...defaultMeta.keywords, 'fitness tracking', 'workout plans', 'exercise', 'strength training']}
      url="/fitness"
    />
  );
}

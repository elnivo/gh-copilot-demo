import { computed, ref } from 'vue'

import { en } from './en'
import { fr } from './fr'

export const translations = {
  en,
  fr,
}

export type Language = keyof typeof translations

export const availableLanguages: Language[] = ['en', 'fr']

export const currentLanguage = ref<Language>('en')

export const setLanguage = (language: Language): void => {
  currentLanguage.value = language
}

export const useTranslations = () => computed(() => translations[currentLanguage.value])
import { afterEach, describe, expect, it } from 'vitest'

import { currentLanguage, setLanguage, useTranslations } from './index'

describe('translations', () => {
  afterEach(() => {
    setLanguage('en')
  })

  it('defaults to English', () => {
    const messages = useTranslations()

    expect(currentLanguage.value).toBe('en')
    expect(messages.value.headerTitle).toBe('Album Collection')
    expect(messages.value.languageLabel).toBe('Language')
  })

  it('switches to French messages', () => {
    const messages = useTranslations()

    setLanguage('fr')

    expect(currentLanguage.value).toBe('fr')
    expect(messages.value.headerTitle).toBe('Collection d\'albums')
    expect(messages.value.retryButton).toBe('Reessayer')
  })
})
<template>
  <div class="app">
    <header class="header">
      <div class="header-copy">
        <h1>🎵 {{ messages.headerTitle }}</h1>
        <p>{{ messages.headerSubtitle }}</p>
      </div>

      <label class="language-picker" for="language-select">
        <span>{{ messages.languageLabel }}</span>
        <select id="language-select" v-model="selectedLanguage">
          <option
            v-for="language in availableLanguages"
            :key="language"
            :value="language"
          >
            {{ messages.languageOptions[language] }}
          </option>
        </select>
      </label>
    </header>

    <main class="main">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>{{ messages.loadingAlbums }}</p>
      </div>

      <div v-else-if="hasError" class="error">
        <p>{{ messages.errorLoadingAlbums }}</p>
        <button @click="fetchAlbums" class="retry-btn">{{ messages.retryButton }}</button>
      </div>

      <div v-else class="albums-grid">
        <AlbumCard 
          v-for="album in albums" 
          :key="album.id" 
          :album="album" 
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import AlbumCard from './components/AlbumCard.vue'
import type { Album } from './types/album'
import { availableLanguages, currentLanguage, setLanguage, useTranslations, type Language } from './i18n'

const albums = ref<Album[]>([])
const loading = ref<boolean>(true)
const hasError = ref<boolean>(false)
const messages = useTranslations()

const selectedLanguage = computed<Language>({
  get: () => currentLanguage.value,
  set: (language) => setLanguage(language),
})

const fetchAlbums = async (): Promise<void> => {
  try {
    loading.value = true
    hasError.value = false
    const response = await axios.get<Album[]>('/albums')
    albums.value = response.data
  } catch (err) {
    hasError.value = true
    console.error('Error fetching albums:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAlbums()
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  padding: 2rem;
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 3rem;
  color: white;
}

.header-copy {
  text-align: center;
  flex: 1;
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.language-picker {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  min-width: 10rem;
  font-weight: 600;
}

.language-picker select {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  backdrop-filter: blur(8px);
}

.language-picker select option {
  color: #1f2937;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 4rem;
  color: white;
}

.error p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.retry-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: white;
  color: #667eea;
}

.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-copy {
    text-align: center;
  }
  
  .header h1 {
    font-size: 2rem;
  }

  .language-picker {
    align-self: center;
    width: min(100%, 16rem);
  }
  
  .albums-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>

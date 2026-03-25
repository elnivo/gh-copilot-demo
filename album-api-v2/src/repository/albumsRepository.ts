import { seedAlbums } from '../data/albums.js'
import type { Album, AlbumWriteRequest, Artist } from '../types.js'

const cloneArtist = (artist: Artist): Artist => ({ ...artist })

const cloneAlbum = (album: Album): Album => ({
  ...album,
  artist: cloneArtist(album.artist),
})

export class AlbumsRepository {
  private albums: Album[]

  constructor(initialAlbums: Album[] = seedAlbums) {
    this.albums = initialAlbums.map(cloneAlbum)
  }

  list(): Album[] {
    return this.albums.map(cloneAlbum)
  }

  getById(id: number): Album | undefined {
    const album = this.albums.find((entry) => entry.id === id)
    return album ? cloneAlbum(album) : undefined
  }

  create(request: AlbumWriteRequest): Album {
    const nextId = this.albums.length === 0 ? 1 : Math.max(...this.albums.map((album) => album.id)) + 1
    const album: Album = { id: nextId, ...request, artist: cloneArtist(request.artist) }

    this.albums.push(album)
    return cloneAlbum(album)
  }

  update(id: number, request: AlbumWriteRequest): Album | undefined {
    const albumIndex = this.albums.findIndex((entry) => entry.id === id)

    if (albumIndex === -1) {
      return undefined
    }

    const album: Album = { id, ...request, artist: cloneArtist(request.artist) }
    this.albums[albumIndex] = album
    return cloneAlbum(album)
  }

  delete(id: number): boolean {
    const albumIndex = this.albums.findIndex((entry) => entry.id === id)

    if (albumIndex === -1) {
      return false
    }

    this.albums.splice(albumIndex, 1)
    return true
  }
}
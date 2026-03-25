import cors from 'cors'
import express, { type Request, type Response } from 'express'

import { AlbumsRepository } from './repository/albumsRepository.js'
import type { AlbumWriteRequest, Artist } from './types.js'

const rootMessage = 'Hit the /albums endpoint to retrieve a list of albums!'

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0

const isArtist = (value: unknown): value is Artist => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const artist = value as Record<string, unknown>
  return (
    isNonEmptyString(artist.name) &&
    isNonEmptyString(artist.birthdate) &&
    isNonEmptyString(artist.birthPlace)
  )
}

const parseAlbumWriteRequest = (value: unknown): AlbumWriteRequest | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const body = value as Record<string, unknown>
  const year = typeof body.year === 'number' ? body.year : Number(body.year)
  const price = typeof body.price === 'number' ? body.price : Number(body.price)

  if (!isNonEmptyString(body.title) || !isArtist(body.artist) || !Number.isInteger(year) || !Number.isFinite(price) || !isNonEmptyString(body.image_url)) {
    return null
  }

  return {
    title: body.title,
    artist: body.artist,
    year,
    price,
    image_url: body.image_url,
  }
}

const parseId = (value: string): number | null => {
  const parsed = Number.parseInt(value, 10)
  return Number.isInteger(parsed) ? parsed : null
}

const getRouteId = (request: Request): number | null => {
  const { id } = request.params
  return typeof id === 'string' ? parseId(id) : null
}

export const createApp = (repository = new AlbumsRepository()) => {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.get('/', (_request: Request, response: Response) => {
    response.status(200).send(rootMessage)
  })

  app.get('/albums', (_request: Request, response: Response) => {
    response.status(200).json(repository.list())
  })

  app.get('/albums/:id', (request: Request, response: Response) => {
    const id = getRouteId(request)

    if (id === null) {
      response.sendStatus(404)
      return
    }

    const album = repository.getById(id)

    if (!album) {
      response.sendStatus(404)
      return
    }

    response.status(200).json(album)
  })

  app.post('/albums', (request: Request, response: Response) => {
    const albumWriteRequest = parseAlbumWriteRequest(request.body)

    if (!albumWriteRequest) {
      response.status(400).json({ message: 'Invalid album payload.' })
      return
    }

    const album = repository.create(albumWriteRequest)
    response.location(`/albums/${album.id}`).status(201).json(album)
  })

  app.put('/albums/:id', (request: Request, response: Response) => {
    const id = getRouteId(request)

    if (id === null) {
      response.sendStatus(404)
      return
    }

    const albumWriteRequest = parseAlbumWriteRequest(request.body)

    if (!albumWriteRequest) {
      response.status(400).json({ message: 'Invalid album payload.' })
      return
    }

    const album = repository.update(id, albumWriteRequest)

    if (!album) {
      response.sendStatus(404)
      return
    }

    response.status(200).json(album)
  })

  app.delete('/albums/:id', (request: Request, response: Response) => {
    const id = getRouteId(request)

    if (id === null) {
      response.sendStatus(404)
      return
    }

    const deleted = repository.delete(id)

    if (!deleted) {
      response.sendStatus(404)
      return
    }

    response.sendStatus(204)
  })

  return app
}

export { rootMessage }
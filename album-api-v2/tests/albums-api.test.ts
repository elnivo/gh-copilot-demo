import request from 'supertest'
import { describe, expect, it } from 'vitest'

import { createApp, rootMessage } from '../src/app.js'

describe('album-api-v2', () => {
  it('returns the root helper message', async () => {
    const app = createApp()

    const response = await request(app).get('/')

    expect(response.status).toBe(200)
    expect(response.text).toBe(rootMessage)
  })

  it('lists the seeded albums', async () => {
    const app = createApp()

    const response = await request(app).get('/albums')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(6)
    expect(response.body[0]).toMatchObject({
      id: 1,
      title: 'You, Me and an App Id',
      year: 2020,
      price: 10.99,
      image_url: 'https://aka.ms/albums-daprlogo',
      artist: {
        name: 'Daprize',
        birthdate: '1990-04-12',
        birthPlace: 'Seattle, USA',
      },
    })
  })

  it('gets an album by id', async () => {
    const app = createApp()

    const response = await request(app).get('/albums/2')

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      id: 2,
      title: 'Seven Revision Army',
    })
  })

  it('returns 404 for a missing album id', async () => {
    const app = createApp()

    const response = await request(app).get('/albums/9999')

    expect(response.status).toBe(404)
  })

  it('creates an album', async () => {
    const app = createApp()

    const response = await request(app)
      .post('/albums')
      .send({
        title: 'Cloud Native Rhapsody',
        artist: {
          name: 'Service Meshuggah',
          birthdate: '1995-08-09',
          birthPlace: 'Chicago, USA',
        },
        year: 2024,
        price: 15.99,
        image_url: 'https://aka.ms/albums-rhapsody',
      })

    expect(response.status).toBe(201)
    expect(response.headers.location).toBe('/albums/7')
    expect(response.body).toMatchObject({
      id: 7,
      title: 'Cloud Native Rhapsody',
      year: 2024,
    })
  })

  it('updates an album', async () => {
    const app = createApp()

    const response = await request(app)
      .put('/albums/3')
      .send({
        title: 'Scale It Further',
        artist: {
          name: 'KEDA Club',
          birthdate: '1992-02-15',
          birthPlace: 'Austin, USA',
        },
        year: 2025,
        price: 16.49,
        image_url: 'https://aka.ms/albums-kedalogo-v2',
      })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      id: 3,
      title: 'Scale It Further',
      year: 2025,
      price: 16.49,
    })
  })

  it('returns 404 when updating a missing album', async () => {
    const app = createApp()

    const response = await request(app)
      .put('/albums/9999')
      .send({
        title: 'Missing Album',
        artist: {
          name: 'Nobody',
          birthdate: '2000-01-01',
          birthPlace: 'Nowhere',
        },
        year: 2024,
        price: 9.99,
        image_url: 'https://aka.ms/albums-missing',
      })

    expect(response.status).toBe(404)
  })

  it('deletes an album', async () => {
    const app = createApp()

    const deleteResponse = await request(app).delete('/albums/4')
    const getResponse = await request(app).get('/albums/4')

    expect(deleteResponse.status).toBe(204)
    expect(getResponse.status).toBe(404)
  })

  it('returns 404 when deleting a missing album', async () => {
    const app = createApp()

    const response = await request(app).delete('/albums/9999')

    expect(response.status).toBe(404)
  })
})
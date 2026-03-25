## Plan: album-api-v2 rewrite

Create a new TypeScript Node API in a dedicated album-api-v2 project that preserves the Vue app contract for GET /albums, supports CRUD over the same in-memory seed data as the existing DotNet API, runs on port 3000, and includes automated tests that are executed as part of verification.

**Goal**
Replace the existing DotNet albums API with a Node.js + TypeScript implementation for album management, without changing the Vue frontend contract that already exists.

**Scope**
- Included:
  - New Node.js API project named album-api-v2
  - TypeScript implementation
  - In-memory data store only
  - Same six sample albums as the current DotNet API
  - CRUD routes for albums
  - Compatibility for the existing Vue app call to GET /albums
  - Automated tests
  - Verification by running tests and building the app
- Excluded:
  - Database integration
  - Persistence across restarts
  - Migration of DotNet-only search and sorted endpoints
  - Unrelated frontend changes

**API Contract**
1. Keep these routes:
   - GET /
   - GET /albums
   - GET /albums/:id
   - POST /albums
   - PUT /albums/:id
   - DELETE /albums/:id

2. Preserve the response and request shape expected by the current frontend:
   - Album fields:
     - id
     - title
     - artist
     - year
     - price
     - image_url
   - Artist fields:
     - name
     - birthdate
     - birthPlace

3. Preserve HTTP semantics:
   - GET list: 200
   - GET by id: 200
   - GET missing id: 404
   - POST create: 201 with Location header
   - PUT update: 200
   - PUT missing id: 404
   - DELETE success: 204
   - DELETE missing id: 404

4. Preserve the root helper endpoint behavior:
   - GET / should return the same message as the current API so local behavior remains familiar

**Implementation Phases**

### Phase 1: Project setup
1. Create a new project folder at /home/lni/ws/ws_copilot/gh-copilot-demo/album-api-v2.
2. Add the Node.js project manifest and TypeScript configuration.
3. Add scripts for:
   - dev
   - build
   - start
   - test
4. Choose a minimal server framework suitable for CRUD and in-memory state.
5. Configure the production start path so the built application binds to port 3000 by default.

**Dependencies**
- No blockers before this phase.
- This phase enables all remaining phases.

### Phase 2: Domain and seed data
1. Define TypeScript models or interfaces for:
   - Artist
   - Album
   - Album write request
2. Recreate the exact same six sample albums from the current DotNet API.
3. Preserve all seed values exactly:
   - IDs
   - Titles
   - Artist names
   - Artist birthdates
   - Artist birth places
   - Years
   - Prices
   - Image URLs
4. Put the seed data behind a repository or service abstraction so route handlers do not manage array state directly.
5. Ensure test runs can create a fresh store instance so tests remain isolated.

**Dependencies**
- Depends on Phase 1.

### Phase 3: In-memory album store
1. Implement list behavior for all albums.
2. Implement get by id behavior.
3. Implement create behavior with next-id allocation.
4. Implement update behavior by id.
5. Implement delete behavior by id.
6. Ensure the store mutates only in memory and resets on process restart.
7. Keep the logic simple and deterministic so tests can validate state transitions cleanly.

**Dependencies**
- Depends on Phase 2.

### Phase 4: HTTP routes
1. Add GET / returning the same helper message as the current DotNet API.
2. Add GET /albums returning the full album list.
3. Add GET /albums/:id returning one album or 404.
4. Add POST /albums creating an album from the write payload and returning 201.
5. Add PUT /albums/:id updating an existing album or returning 404.
6. Add DELETE /albums/:id removing an album and returning 204 or 404.
7. Add basic validation for:
   - numeric id parsing
   - required body fields
   - valid object shape for artist
8. Enable CORS so the Vue app running through Vite can call the API on port 3000.
9. Keep route paths aligned with the existing frontend and proxy configuration.

**Dependencies**
- Depends on Phase 3.

### Phase 5: Frontend compatibility verification
1. Confirm the Vue app still expects GET /albums and no route prefix such as /api.
2. Confirm the album payload field names match the existing frontend type definitions.
3. Confirm the API host remains reachable at localhost:3000 so the current Vite proxy keeps working.
4. Leave the Vue app unchanged unless testing proves a contract mismatch exists.

**Dependencies**
- Depends on Phase 4.

### Phase 6: Automated tests
1. Add tests for the in-memory API behavior at the HTTP level, not just the store level.
2. Cover at minimum:
   - GET / returns expected helper message
   - GET /albums returns all seeded albums
   - GET /albums/:id returns the correct album
   - GET /albums/:id returns 404 for a missing id
   - POST /albums creates a new album and returns 201
   - PUT /albums/:id updates an existing album
   - PUT /albums/:id returns 404 when missing
   - DELETE /albums/:id returns 204
   - DELETE /albums/:id returns 404 when missing
3. Ensure each test uses a fresh in-memory store so test order does not affect results.
4. Prefer HTTP-level tests because they verify status codes, headers, and payloads together.

**Dependencies**
- Depends on Phase 4.
- Can be prepared in parallel with late Phase 4 route wiring if the app factory and store injection are designed early.

### Phase 7: Build and runtime verification
1. Run the new test suite and confirm all tests pass.
2. Build the new album-api-v2 application successfully.
3. Start the built application and verify it listens on port 3000.
4. Manually verify GET /albums returns the expected payload shape for the Vue app.
5. Optionally run the Vue app against the new API to confirm the album list loads without frontend changes.

**Dependencies**
- Depends on Phase 6.

**Relevant Files**
- AlbumController.cs — current route behavior and status code reference
- Album.cs — current album shape
- Artist.cs — current artist shape
- AlbumWriteRequest.cs — current POST and PUT payload shape
- launchSettings.json — existing port 3000 convention
- AlbumControllerTests.cs — existing API behavior reference
- App.vue — current GET /albums usage
- album.ts — frontend contract that must remain compatible
- vite.config.ts — dev proxy targeting localhost:3000

**Architecture Notes**
- The API should separate concerns into:
  - app or server bootstrap
  - route handlers
  - album repository or service
  - shared domain types
  - seed data
- The store should be injectable or resettable for tests.
- Route behavior should be verified through HTTP requests rather than only by unit-testing internal functions.
- Keep the implementation minimal and focused on the user requirement rather than reproducing the full DotNet API surface.

**Verification Checklist**
1. Test suite passes for all CRUD endpoints and the root endpoint.
2. Build succeeds for the new TypeScript API.
3. The built app starts on port 3000.
4. GET /albums returns the same shape the Vue app already expects.
5. The sample data matches the current DotNet API exactly.

**Decisions**
- The rewrite will include CRUD plus GET / compatibility for the Vue app.
- The rewrite will not include the DotNet-only search or sorted endpoints.
- Data remains in memory only.
- The frontend contract is preserved rather than redesigned.

**Risks and Mitigations**
1. Risk: field name mismatch between Node serialization and Vue types
   Mitigation: define explicit TypeScript response shapes and test exact JSON fields

2. Risk: test state leakage due to in-memory mutation
   Mitigation: instantiate a fresh store per test

3. Risk: port conflict with the existing DotNet API still present in the workspace
   Mitigation: ensure local validation starts only one API on port 3000 at a time

**Expected Outcome**
After implementation, the workspace will contain a new album-api-v2 TypeScript Node API that:
- exposes CRUD routes for albums
- serves the same sample data as the existing DotNet API
- works with the current Vue frontend on port 3000
- passes automated tests
- builds and starts successfully
using albums_api.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace albums_api.Controllers
{
    [Route("albums")]
    [ApiController]
    public class AlbumController : ControllerBase
    {
        // GET: api/album
        [HttpGet]
        public IActionResult Get()
        {
            var albums = Album.GetAll();

            return Ok(albums);
        }

        // GET api/<AlbumController>/5
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            // here we would normally get the album from a database, but for this example we'll just return a dummy album
            var album = Album.GetById(id);
            if (album == null)
            {
                return NotFound();
            }

            return Ok(album);

        }

        [HttpGet("search")]
        public IActionResult SearchByYear([FromQuery] int year)
        {
            var albums = Album.SearchByYear(year);
            return Ok(albums);
        }
        
        // function that retrieves albums and sorts them by title, artist or price
        [HttpGet("sorted")]
        public IActionResult GetSorted(string sortBy)
        {
            var albums = Album.GetAll();

            switch (sortBy.ToLowerInvariant())
            {
                case "title":
                    albums = albums.OrderBy(a => a.Title).ToList();
                    break;
                case "artist":
                    albums = albums.OrderBy(a => a.Artist.Name).ToList();
                    break;
                case "price":
                    albums = albums.OrderBy(a => a.Price).ToList();
                    break;
                default:
                    return BadRequest("Invalid sort parameter. Use 'title', 'artist', or 'price'.");
            }

            return Ok(albums);
        }

        [HttpPost]
        public IActionResult Create([FromBody] AlbumWriteRequest request)
        {
            var album = Album.Create(request);
            return CreatedAtAction(nameof(Get), new { id = album.Id }, album);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] AlbumWriteRequest request)
        {
            var updatedAlbum = Album.Update(id, request);
            if (updatedAlbum == null)
            {
                return NotFound();
            }

            return Ok(updatedAlbum);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var removed = Album.Delete(id);
            if (!removed)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}


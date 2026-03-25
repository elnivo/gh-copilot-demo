using albums_api.Controllers;
using albums_api.Models;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace albums_api.Tests;

public class AlbumControllerTests
{
    private readonly AlbumController controller = new();

    [Fact]
    public void Get_ReturnsAllAlbumsWithStructuredArtist()
    {
        var result = controller.Get();

        var okResult = Assert.IsType<OkObjectResult>(result);
        var albums = Assert.IsAssignableFrom<List<Album>>(okResult.Value);

        Assert.NotEmpty(albums);
        Assert.All(albums, album =>
        {
            Assert.NotNull(album.Artist);
            Assert.False(string.IsNullOrWhiteSpace(album.Artist.Name));
        });
    }

    [Fact]
    public void Get_MissingId_ReturnsNotFound()
    {
        var result = controller.Get(int.MaxValue);

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public void SearchByYear_ReturnsAlbumsOnlyFromRequestedYear()
    {
        const int year = 2021;

        var result = controller.SearchByYear(year);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var albums = Assert.IsAssignableFrom<List<Album>>(okResult.Value);

        Assert.NotEmpty(albums);
        Assert.All(albums, album => Assert.Equal(year, album.Year));
    }

    [Fact]
    public void GetSorted_ByArtist_ReturnsAlbumsOrderedByArtistName()
    {
        var result = controller.GetSorted("artist");

        var okResult = Assert.IsType<OkObjectResult>(result);
        var albums = Assert.IsAssignableFrom<List<Album>>(okResult.Value);

        var artistNames = albums.Select(album => album.Artist.Name).ToList();
        var expectedNames = artistNames.OrderBy(name => name, StringComparer.Ordinal).ToList();

        Assert.Equal(expectedNames, artistNames);
    }

    [Fact]
    public void GetSorted_InvalidField_ReturnsBadRequest()
    {
        var result = controller.GetSorted("duration");

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Invalid sort parameter. Use 'title', 'artist', or 'price'.", badRequest.Value);
    }
}
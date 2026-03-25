namespace albums_api.Models
{
    public record AlbumWriteRequest(
        string Title,
        string Artist,
        int Year,
        double Price,
        string Image_url);
}
namespace albums_api.Models
{
    public record Album(int Id, string Title, string Artist, int Year, double Price, string Image_url)
    {
        private static readonly object SyncRoot = new();
        private static readonly List<Album> Albums = new()
        {
            new Album(1, "You, Me and an App Id", "Daprize", 2020, 10.99, "https://aka.ms/albums-daprlogo"),
            new Album(2, "Seven Revision Army", "The Blue-Green Stripes", 2021, 13.99, "https://aka.ms/albums-containerappslogo"),
            new Album(3, "Scale It Up", "KEDA Club", 2022, 13.99, "https://aka.ms/albums-kedalogo"),
            new Album(4, "Lost in Translation", "MegaDNS", 2020, 12.99, "https://aka.ms/albums-envoylogo"),
            new Album(5, "Lock Down Your Love", "V is for VNET", 2021, 12.99, "https://aka.ms/albums-vnetlogo"),
            new Album(6, "Sweet Container O' Mine", "Guns N Probeses", 2022, 14.99, "https://aka.ms/albums-containerappslogo")
        };

        public static List<Album> GetAll()
        {
            lock (SyncRoot)
            {
                return Albums.ToList();
            }
        }

        public static Album? GetById(int id)
        {
            lock (SyncRoot)
            {
                return Albums.FirstOrDefault(a => a.Id == id);
            }
        }

        public static List<Album> SearchByYear(int year)
        {
            lock (SyncRoot)
            {
                return Albums.Where(a => a.Year == year).ToList();
            }
        }

        public static Album Create(AlbumWriteRequest request)
        {
            lock (SyncRoot)
            {
                var nextId = Albums.Count == 0 ? 1 : Albums.Max(a => a.Id) + 1;
                var album = new Album(nextId, request.Title, request.Artist, request.Year, request.Price, request.Image_url);
                Albums.Add(album);
                return album;
            }
        }

        public static Album? Update(int id, AlbumWriteRequest request)
        {
            lock (SyncRoot)
            {
                var index = Albums.FindIndex(a => a.Id == id);
                if (index < 0)
                {
                    return null;
                }

                var updatedAlbum = new Album(id, request.Title, request.Artist, request.Year, request.Price, request.Image_url);
                Albums[index] = updatedAlbum;
                return updatedAlbum;
            }
        }

        public static bool Delete(int id)
        {
            lock (SyncRoot)
            {
                var index = Albums.FindIndex(a => a.Id == id);
                if (index < 0)
                {
                    return false;
                }

                Albums.RemoveAt(index);
                return true;
            }
        }
    }
}

namespace albums_api.Models
{
    public record Album(int Id, string Title, Artist Artist, int Year, double Price, string Image_url)
    {
        private static readonly object SyncRoot = new();
        private static readonly List<Album> Albums = new()
        {
            new Album(1, "You, Me and an App Id", new Artist("Daprize", new DateOnly(1990, 4, 12), "Seattle, USA"), 2020, 10.99, "https://aka.ms/albums-daprlogo"),
            new Album(2, "Seven Revision Army", new Artist("The Blue-Green Stripes", new DateOnly(1988, 9, 23), "Portland, USA"), 2021, 13.99, "https://aka.ms/albums-containerappslogo"),
            new Album(3, "Scale It Up", new Artist("KEDA Club", new DateOnly(1992, 2, 15), "Austin, USA"), 2022, 13.99, "https://aka.ms/albums-kedalogo"),
            new Album(4, "Lost in Translation", new Artist("MegaDNS", new DateOnly(1986, 11, 7), "Dublin, Ireland"), 2020, 12.99, "https://aka.ms/albums-envoylogo"),
            new Album(5, "Lock Down Your Love", new Artist("V is for VNET", new DateOnly(1991, 6, 30), "London, UK"), 2021, 12.99, "https://aka.ms/albums-vnetlogo"),
            new Album(6, "Sweet Container O' Mine", new Artist("Guns N Probeses", new DateOnly(1989, 1, 19), "Los Angeles, USA"), 2022, 14.99, "https://aka.ms/albums-containerappslogo")
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

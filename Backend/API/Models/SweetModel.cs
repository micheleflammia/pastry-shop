namespace API.Models;

public class SweetModel
{
    private decimal _prezzo = 0;

    public string id { get; set; }
    public string nome { get; set; }
    public DateOnly data { get; set; }
    public int quantita { get; set; }
    public string[] ingredienti { get; set; }

    public decimal prezzo
    {
        get
        {
            //Console.WriteLine($"GET {_prezzo}");
            return _prezzo;
        }
        set
        {


            var giorniTrascorsi = DateOnly.FromDateTime(DateTime.Now).DayNumber - data.DayNumber;
            Console.WriteLine($"SET {giorniTrascorsi} {_prezzo} {value}");
            if (giorniTrascorsi == 1)
            {
                _prezzo = value * 0.8m;
            }
            else if (giorniTrascorsi == 2)
            {
                _prezzo = value * 0.2m;
            }
            else
            {
                _prezzo = value;
            }
        }
    }

   

    public SweetModel(string id, string nome, decimal prezzo, DateOnly data, int quantita, string[] ingredienti)
    {

        this.id = id;
        this.nome = nome;
        this.data = data;

        this.quantita = quantita;
        this.ingredienti = ingredienti;

        _prezzo = prezzo;

    }
}

public class NewSweetModel
{
    public required string nome { get; set; }

    public required decimal prezzo { get; set; }

    public required DateOnly data { get; set; }

    public required int quantita { get; set; }

    public required string[] ingredienti { get; set; }
}


public class UpdateSweetModel
{
    public required string nome { get; set; }
    public required decimal prezzo { get; set; }
    public required DateOnly data { get; set; }
    public required int quantita { get; set; }
    public required string[] ingredienti { get; set; }
}

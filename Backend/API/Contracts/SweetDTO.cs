namespace API.Contracts;
public class SweetModelDTO
{
    public string ?id { get; set; }
    public string ?nome { get; set; }
    public decimal prezzo {get; set;}
    public DateOnly data { get; set; }
    public int quantita { get; set; }
    public string[] ?ingredienti { get; set; }
       
}
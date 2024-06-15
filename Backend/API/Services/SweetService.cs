using API.Models;
using API.Contracts;

namespace API.Services;
public class SweetService
{
    public decimal calcPrice(SweetModel model)
    {
       var giorniTrascorsi = DateOnly.FromDateTime(DateTime.Now).DayNumber - model.data.DayNumber;

        if (giorniTrascorsi == 1)
        {
            return model.prezzo * 0.8m;
        }
        else if (giorniTrascorsi == 2)
        {
            return model.prezzo * 0.2m;
        }
        else
        {
            return model.prezzo;
        }
    }

    public SweetModelDTO ConvertToDTO(SweetModel sweet)
    {
        return new SweetModelDTO
        {
            id = sweet.id,
            nome = sweet.nome,
            data = sweet.data,
            quantita = sweet.quantita,
            ingredienti = sweet.ingredienti,
            prezzo = calcPrice(sweet)
        };
       
    }

    public List<SweetModelDTO> ConvertToDTOS(List<SweetModel> sweets)
    {
        return sweets.Select(sweet => ConvertToDTO(sweet)).ToList();
    }
}
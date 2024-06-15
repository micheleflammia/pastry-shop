using Microsoft.AspNetCore.Mvc;

using API.Models;
using API.Services;
using API.Contracts;

namespace API.Controllers;

[Route("sweets")]
[ApiController]
public class SweetController : ControllerBase
{ 
    private JsonFileService _jsonFile;
    private SweetService _sweetService;
    private List<SweetModel> _sweets;

    public SweetController(JsonFileService jsonFile, SweetService sweetService)
    {
        _jsonFile = jsonFile;
        _sweetService = sweetService;
       _sweets = jsonFile.ReadFromFile<SweetModel>(TableNames.Dolci);
    }

    [HttpGet]
    public IActionResult GetAll(bool available)
    {
        List<SweetModel> allData = _sweets;

        if(available){
            var nowDate = DateOnly.FromDateTime(DateTime.Now);

            allData = _sweets
            .Where(s => s.quantita >= 1 && (nowDate.DayNumber - s.data.DayNumber) < 3 )
            .ToList();
        }
        else
        {
            allData = _sweets;
        }

        List<SweetModelDTO> data = _sweetService.ConvertToDTOS(allData);

        return Ok(data);
    }

    [HttpGet("{id}")]
    public IActionResult GetOne(string id)
    {
        var exists = _sweets.FirstOrDefault(d => d.id == id);
        
        if(exists == null){
            return NotFound();
        }

        SweetModelDTO data = _sweetService.ConvertToDTO(exists);

        return Ok(data);
    }

    

    [HttpPost]
    public IActionResult Create(NewSweetModel newSweet)
    {
        string newId = Guid.NewGuid().ToString();
        
        SweetModel newModel = new SweetModel(
            newId,
            newSweet.nome,
            newSweet.prezzo,
            newSweet.data,
            newSweet.quantita,
            newSweet.ingredienti
        );

        _sweets.Add(newModel);

        _jsonFile.WriteToFile(_sweets, TableNames.Dolci);

        SweetModelDTO data = _sweetService.ConvertToDTO(newModel);

        return CreatedAtAction(nameof(GetAll), data);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        var exists = _sweets.FirstOrDefault(d => d.id == id);
        
        if(exists == null){
            return NotFound();
        }

        _sweets.Remove(exists);

        _jsonFile.WriteToFile(_sweets, TableNames.Dolci);

        return NoContent();
    }


    [HttpPut("{id}")]
    public IActionResult Update(string id, UpdateSweetModel updateModel)
    {
        var exists = _sweets.FirstOrDefault(d => d.id == id);

        if (exists == null)
        {
            return NotFound();
        }
        
        exists.nome = updateModel.nome;
        exists.data = updateModel.data;
        exists.prezzo = updateModel.prezzo;
        exists.quantita = updateModel.quantita;
        exists.ingredienti = updateModel.ingredienti;
        
        _jsonFile.WriteToFile(_sweets, TableNames.Dolci);

        SweetModelDTO data = _sweetService.ConvertToDTO(exists);

        return Ok(data);
    }
}

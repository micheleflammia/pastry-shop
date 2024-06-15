using System.IO;
using System.Text.Json;

namespace API.Services;

public class JsonFileService
{
    private string _filePath;

    public JsonFileService(string filePath)
    {
        if (!File.Exists(filePath))
        {
            throw new FileNotFoundException("JSON FILE NOT FOUND");
        }

        _filePath = filePath;
    }



    public List<T> ReadFromFile<T>(string table)
    {
        var jsonData = File.ReadAllText(_filePath);
        var jsonObject = JsonSerializer.Deserialize<JsonElement>(jsonData);

        if (jsonObject.TryGetProperty(table, out JsonElement nomeElement))
        {

            List<T> result = JsonSerializer.Deserialize<List<T>>(nomeElement.GetRawText()) ?? new List<T>();

            return result;
        }
        else
        {
            throw new InvalidOperationException("LA TABELLA NON ESISTE NEL FILE JSON");
        }

    }

    public void WriteToFile<T>(T data, string table)
    {
        var jsonData = File.ReadAllText(_filePath);
        var jsonObject = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(jsonData) ?? new Dictionary<string, JsonElement>();

        jsonObject[table] = JsonSerializer.SerializeToElement(data);

        var updatedJson = JsonSerializer.Serialize(jsonObject, new JsonSerializerOptions { WriteIndented = true });

        File.WriteAllText(_filePath, updatedJson);
    }
}
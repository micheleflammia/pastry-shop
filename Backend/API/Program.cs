using API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var filePath = Path.Combine(builder.Environment.ContentRootPath, "db.json");

builder.Services.AddSingleton(new JsonFileService(filePath));
builder.Services.AddSingleton(new SweetService());


builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowAllOrigins");

app.MapControllers();

app.Run();
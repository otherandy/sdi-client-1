const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

interface IpData {
  ip: string;
}

interface LocationData {
  lat: number;
  lon: number;
}

interface WeatherData {
  current: {
    temperature_2m: number;
  };
}

export default function Submit() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const title = form.querySelector("input") as HTMLInputElement;
    const description = form.querySelector("textarea") as HTMLTextAreaElement;

    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const { ip } = (await ipResponse.json()) as IpData;

    const locationResponse = await fetch(`https://ip-api.com/json/${ip}`);
    const { lat, lon } = (await locationResponse.json()) as LocationData;

    const weather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`
    );
    const weatherData = (await weather.json()) as WeatherData;
    const { temperature_2m } = weatherData.current;

    const content = {
      title: title.value,
      description: description.value,
      temperature: temperature_2m,
    };

    try {
      await fetch(`${serverUrl}/content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" id="title" placeholder="Title" />
      <textarea id="content" placeholder="Content" />
      <button type="submit" className="submit">
        Submit
      </button>
    </form>
  );
}

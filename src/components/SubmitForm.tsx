import { useState } from "react";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const title = form.querySelector("input") as HTMLInputElement;
    const description = form.querySelector("textarea") as HTMLTextAreaElement;

    setLoading(true);

    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResponse.json();

    const locationResponse = await fetch(serverUrl + "/location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ipData),
    });
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

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" id="title" placeholder="Title" />
      <textarea id="content" placeholder="Content" />
      <button type="submit" className="submit">
        {!loading ? (
          "Submit"
        ) : (
          <svg
            className="spinner"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              style={{
                opacity: 0.25,
              }}
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              style={{
                opacity: 0.75,
              }}
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
      </button>
    </form>
  );
}

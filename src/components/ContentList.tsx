import { useEffect, useState } from "react";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

interface Content {
  _id: string;
  title: string;
  description: string;
  temperature: number;
}

export default function ContentList() {
  const [content, setContent] = useState([]);

  const fetchContent = async () => {
    try {
      const res = await fetch(`${serverUrl}/content`);
      const data = await res.json();
      setContent(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchContent();
  });

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${serverUrl}/content/${id}`, { method: "DELETE" });
      fetchContent();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="content">
      {content.length === 0 && (
        <div>
          <p>No content available</p>
          <p>Please try refreshing the page</p>
        </div>
      )}
      {content.map((item: Content, index) => (
        <div key={item._id} className="box">
          <small className="index">{index + 1}</small>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          {item.temperature ? (
            <p>
              {item.temperature}
              <small>&nbsp;°C</small>
            </p>
          ) : null}
          <a
            title="Delete"
            className="delete"
            onClick={() => handleDelete(item._id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M18.3 5.71a1 1 0 0 0-1.42 0L12 10.59 7.11 5.7a1 1 0 0 0-1.42 1.42L10.59 12l-4.9 4.89a1 1 0 1 0 1.42 1.42L12 13.41l4.89 4.9a1 1 0 0 0 1.42-1.42L13.41 12l4.9-4.89a1 1 0 0 0 0-1.42z" />
            </svg>
          </a>
        </div>
      ))}
    </div>
  );
}

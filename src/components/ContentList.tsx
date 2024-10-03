import { useEffect, useState } from "react";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

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

  return (
    <div>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {content.map((item: any) => (
        <div key={item._id}>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}

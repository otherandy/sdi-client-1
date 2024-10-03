const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

export default function Submit() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const title = form.querySelector("input") as HTMLInputElement;
    const description = form.querySelector("textarea") as HTMLTextAreaElement;
    const content = {
      title: title.value,
      description: description.value,
    };

    try {
      console.log(serverUrl);
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
      <input type="text" placeholder="Title" />
      <textarea placeholder="Content" />
      <button type="submit">Submit</button>
    </form>
  );
}

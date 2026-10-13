import { useState } from "react";

export default function BookForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !author.trim()) return;

    setLoading(true);

    try {
      await onAdd({
        title: title.trim(),
        author: author.trim(),
      });

      setTitle("");
      setAuthor("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <h2 className="mb-5 text-xl font-bold text-slate-800">
        Add a New Book
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Book title"
          maxLength={200}
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author name"
          maxLength={120}
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <button
        disabled={loading}
        className="mt-4 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Adding..." : "+ Add Book"}
      </button>
    </form>
  );
}
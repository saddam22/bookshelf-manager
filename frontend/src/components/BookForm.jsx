import { useEffect, useState } from "react";

export default function BookForm({ onAdd, initialBook = null, onCancel }) {
  const [title, setTitle] = useState(initialBook?.title || "");
  const [author, setAuthor] = useState(initialBook?.author || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(initialBook?.title || "");
    setAuthor(initialBook?.author || "");
    setError("");
  }, [initialBook]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      setError("Book title and author are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onAdd({ title: title.trim(), author: author.trim() });
      if (!initialBook) { setTitle(""); setAuthor(""); }
    } catch (err) {
      setError(err.message || "Unable to save this book.");
    } finally { setLoading(false); }
  }

  return <form className="book-form" onSubmit={handleSubmit}>
    <label>Book title<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Atomic Habits" maxLength={200} required /></label>
    <label>Author name<input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g. James Clear" maxLength={120} required /></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="form-actions"><button type="submit" disabled={loading}>{loading ? "Saving…" : initialBook ? "Save Changes" : "+ Add Book"}</button>{onCancel && <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>}</div>
  </form>;
}

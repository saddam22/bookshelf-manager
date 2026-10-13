import { useCallback, useEffect, useState } from "react";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";

const API_URL = "http://localhost:5000/books";

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBooks = useCallback(async () => {
    try {
      setError("");

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load books");
      }

      setBooks(data);
    } catch (err) {
      setError(err.message || "Cannot connect to backend");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  async function addBook(bookData) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add book");
    }

    setBooks((current) => [data, ...current]);
    setError("");
  }

  async function markAsRead(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update book");
      }

      setBooks((current) =>
        current.map((book) => (book.id === id ? data : book))
      );
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteBook(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete book");
      }

      setBooks((current) => current.filter((book) => book.id !== id));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  const readCount = books.filter((book) => book.status === "read").length;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-5 sm:px-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white">
            📚
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
              BookShelf Manager
            </h1>
            <p className="text-sm text-slate-500">
              Your personal reading space
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Your Library
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Every book, one place.
          </h2>
          <p className="mt-3 text-slate-600">
            Organize your books and keep track of your reading progress.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total Books" value={books.length} />
          <StatCard label="Books Read" value={readCount} />
          <StatCard label="Unread Books" value={books.length - readCount} />
        </section>

        <BookForm onAdd={addBook} />

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900">My Books</h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
              {books.length} books
            </span>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
              <button
                onClick={loadBooks}
                className="ml-3 font-bold underline"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <p className="rounded-xl bg-white p-8 text-center text-slate-500">
              Loading your books...
            </p>
          ) : (
            <BookList
              books={books}
              onRead={markAsRead}
              onDelete={deleteBook}
            />
          )}
        </section>

        <footer className="border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          BookShelf Manager · MERN Stack Practical Project
        </footer>
      </div>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}
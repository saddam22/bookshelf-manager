import { useCallback, useEffect, useMemo, useState } from "react";
import BookForm from "./components/BookForm";
import "./App.css";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/books`;

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const loadBooks = useCallback(async () => {
    try {
      setError("");
      const response = await fetch(API_URL);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load books");
      setBooks(data);
    } catch (err) {
      setError(err.message || "Cannot connect to backend");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBooks(); }, [loadBooks]);

  async function addBook(bookData) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to add book");
    setBooks((current) => [data, ...current]);
    setError("");
    setShowForm(false);
    setEditingBook(null);
  }

  async function updateBook(bookData) {
    const id = editingBook?.id || editingBook?._id;
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update book");
    setBooks((current) => current.map((book) => (book.id || book._id) === id ? data : book));
    setError("");
    setShowForm(false);
    setEditingBook(null);
  }

  async function markAsRead(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "PUT" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update book");
      setBooks((current) => current.map((book) => book.id === id ? data : book));
      setError("");
    } catch (err) { setError(err.message); }
  }

  async function deleteBook(id) {
    if (!window.confirm("এই বইটি মুছে ফেলতে চান?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete book");
      setBooks((current) => current.filter((book) => book.id !== id));
      setError("");
    } catch (err) { setError(err.message); }
  }

  const readCount = books.filter((b) => b.status === "read").length;
  const categories = [...new Set(books.map((b) => b.category).filter(Boolean))];
  const filteredBooks = useMemo(() => books.filter((book) => {
    const q = query.toLowerCase().trim();
    const matchesQuery = !q || `${book.title || ""} ${book.author || ""}`.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || book.status === statusFilter;
    const matchesCategory = category === "all" || book.category === category;
    return matchesQuery && matchesStatus && matchesCategory;
  }), [books, query, statusFilter, category]);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="Bookworm home"><span className="brand-mark">B</span><span>Bookworm</span></a>
        <nav className="nav-menu">
          <button className="nav-item"><span>⌂</span>Home</button>
          <button className="nav-item active"><span>▣</span>Library</button>
          <button className="nav-item" onClick={() => alert("Community feature coming soon")}><span>♧</span>Community</button>
          <button className="nav-item" onClick={() => alert("AI Integration feature coming soon")}><span>ϟ</span>AI Integration <span className="nav-chevron">⌄</span></button>
          <button className="nav-item" onClick={() => alert("Settings feature coming soon")}><span>⚙</span>Settings</button>
          <button className="nav-item" onClick={() => alert("Help feature coming soon")}><span>ⓘ</span>Help</button>
        </nav>
        <div className="profile">
          <div className="avatar">S</div>
          <div className="profile-text"><strong>Bookworm Reader</strong><small>My personal library</small></div>
          <span className="profile-exit">↗</span>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <label className="search-box"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search books by title or author..." /></label>
          <button className="filter-button" onClick={() => setStatusFilter(statusFilter === "all" ? "unread" : statusFilter === "unread" ? "read" : "all")}>☷ <span>Filter</span></button>
          <button className="notification" aria-label="Notifications" onClick={() => alert("You're all caught up!")}>♧<i /></button>
        </header>

        <div className="library-content">
          <div className="heading-row">
            <h1>Library <span>({books.length})</span></h1>
            <div className="controls">
              <div className="status-tabs">
                <button className={statusFilter === "all" ? "selected" : ""} onClick={() => setStatusFilter("all")}>All Books</button>
                <button className={statusFilter === "read" ? "selected" : ""} onClick={() => setStatusFilter("read")}>Read</button>
                <button className={statusFilter === "unread" ? "selected" : ""} onClick={() => setStatusFilter("unread")}>Unread</button>
              </div>
              <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
                <option value="all">All Categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="summary-line"><span>{filteredBooks.length} books in your collection</span><span>{readCount} read · {books.length - readCount} unread</span></div>
          {error && <div className="error-banner" role="alert">{error}<button onClick={loadBooks}>Retry</button></div>}

          {loading ? <div className="empty-state">Loading your library…</div> : (
            <div className="book-grid">
              {filteredBooks.map((book) => {
                const isRead = book.status === "read";
                const cover = book.coverUrl || book.imageUrl || book.cover || book.image;
                return <article className="book-card" key={book.id || book._id}>
                  <div className="cover-stage">
                    {cover ? <img className="book-cover" src={cover} alt={`${book.title} cover`} /> : <div className={`cover-placeholder cover-${(book.title || "book").length % 5}`}><span>{book.title || "BOOK"}</span><small>{book.author || "BOOKWORM EDITION"}</small></div>}
                    <button className="card-menu" aria-label="Delete book" title="Delete book" onClick={() => deleteBook(book.id || book._id)}>⋮</button>
                  </div>
                  <div className="book-info">
                    <h2 title={book.title}>{book.title}</h2>
                    <p>{book.author || "Unknown author"}</p>
                    <span className={`status-pill ${isRead ? "read" : ""}`}>{isRead ? "Read" : "Unread"}</span>
                    <div className="card-actions">
                      <button className="icon-button" title="Edit book" onClick={() => { setEditingBook(book); setShowForm(true); }}>✎</button>
                      <button className="icon-button delete-icon" title="Delete book" onClick={() => deleteBook(book.id || book._id)}>♜</button>
                      <button className={`read-button ${isRead ? "done" : ""}`} onClick={() => !isRead && markAsRead(book.id || book._id)}>{isRead ? "Read Book" : "Mark as Read"}</button>
                    </div>
                  </div>
                </article>;
              })}
              <button className="add-card" onClick={() => { setEditingBook(null); setShowForm(true); }}><span className="plus">+</span><strong>Add New Book</strong><small>Add a new book to<br /> your library</small></button>
            </div>
          )}
          {!loading && filteredBooks.length === 0 && <div className="empty-state">No books found. Try another search or add a new book.</div>}
          <footer className="footer-note">Bookworm · Your personal reading space</footer>
        </div>
      </section>

      {showForm && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) { setShowForm(false); setEditingBook(null); } }}>
        <div className="book-modal"><button className="modal-close" onClick={() => { setShowForm(false); setEditingBook(null); }} aria-label="Close">×</button><h2>{editingBook ? "Edit book" : "Add a new book"}</h2><p className="modal-subtitle">{editingBook ? "Update your book details." : "Add a title to your personal library."}</p><BookForm key={editingBook?.id || editingBook?._id || "new-book"} initialBook={editingBook} onAdd={editingBook ? updateBook : addBook} onCancel={() => { setShowForm(false); setEditingBook(null); }} /></div>
      </div>}
    </main>
  );
}

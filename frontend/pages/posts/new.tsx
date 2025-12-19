import { useState } from "react";
import { useRouter } from "next/router";

export default function NewPost() {
  const [posterName, setPosterName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!posterName.trim() || !content.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Post created:", {
        posterName: posterName.trim(),
        content: content.trim(),
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      });
      alert("Post created successfully!");
      router.push("/");
    }, 1000);
  }

  return (
    <>
      <h1>Create New Post</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="posterName" className="form-label">
            Your Name
          </label>
          <input
            type="text"
            className="form-control"
            id="posterName"
            maxLength={100}
            required
            value={posterName}
            onChange={(e) => setPosterName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <textarea
            className="form-control"
            id="content"
            rows={5}
            required
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </button>
          <a href="/" className="btn btn-secondary">
            Cancel
          </a>
        </div>
      </form>
    </>
  );
}
import { useState } from "react";
import { useRouter } from "next/router";

export default function NewPost() {
  const [posterName, setPosterName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!posterName.trim() || !content.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          posterName: posterName.trim(),
          content: content.trim(),
        }),
      });

      if (response.ok) {
        alert("Post created successfully!");
        router.push("/");
      } else {
        alert("Failed to create post");
        setIsSubmitting(false);
      }
    } catch (error) {
      alert("Error creating post");
      setIsSubmitting(false);
    }
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
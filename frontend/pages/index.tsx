import { useEffect, useState } from "react";

interface Post {
  id: string;
  posterName: string;
  content: string;
  replyToId?: string;
  createdAt: string;
  updatedAt: string;
  replies: Post[];
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPosts() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/posts");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleDelete(id: string) {
    if (confirm("Are you sure?")) {
      try {
        const response = await fetch(`http://localhost:3000/posts/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
          alert("Deleted successfully.");
        } else {
          alert("Failed to delete post");
        }
      } catch (err) {
        alert("Error deleting post");
      }
    }
  }

  return (
    <>
      <h1>My Posts</h1>

      <a href="/posts/new" className="btn btn-primary mb-3">
        Create New Post
      </a>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          <h4>Error</h4>
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={loadPosts}
          >
            Try Again
          </button>
        </div>
      ) : posts.length > 0 ? (
        <div>
          {posts.filter(post => !post.replyToId).map((post) => (
            <div key={post.id} className="post mb-4 p-3 border rounded">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="mb-0">
                  <strong>{post.posterName}</strong>
                </h5>
                <small className="text-muted">{post.createdAt}</small>
              </div>

              <p className="mb-2">
                <a href={`/posts/${post.id}`} className="text-dark text-decoration-none">
                  {post.content}
                </a>
              </p>

              <div className="mt-3">
                <a href={`/posts/${post.id}`} className="btn btn-sm btn-info me-2">
                  View
                </a>
                <a href={`/posts/${post.id}/reply`} className="btn btn-sm btn-success me-2">
                  Reply
                </a>
                <a href={`/posts/${post.id}/edit`} className="btn btn-sm btn-warning me-2">
                  Edit
                </a>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </button>
              </div>

              {post.replies && post.replies.length > 0 && (
                <div className="mt-3 ms-3 border-start border-3 ps-3">
                  <h6 className="text-muted mb-3">Replies ({post.replies.length}):</h6>
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="mb-2 p-2 bg-light rounded">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong className="small">{reply.posterName}</strong>
                        <small className="text-muted">{reply.createdAt}</small>
                      </div>
                      <p className="mb-0 small">
                        <a href={`/posts/${reply.id}`} className="text-dark text-decoration-none">
                          {reply.content}
                        </a>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          <h4>No posts yet</h4>
          <p>Be the first to create a post!</p>
          <a href="/posts/new" className="btn btn-primary">
            Create First Post
          </a>
        </div>
      )}
    </>
  );
}
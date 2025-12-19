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

const hardcodedPosts: Post[] = [
  {
    id: "1",
    posterName: "John Doe",
    content: "This is my first post! Welcome to our platform.",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    replies: [
      {
        id: "2",
        posterName: "Jane Smith",
        content: "Welcome! Great to have you here.",
        replyToId: "1",
        createdAt: "2024-01-15T11:00:00Z",
        updatedAt: "2024-01-15T11:00:00Z",
        replies: []
      }
    ]
  },
  {
    id: "3",
    posterName: "Alice Johnson",
    content: "Just finished reading an amazing book about React development. Highly recommend it to anyone learning frontend!",
    createdAt: "2024-01-16T14:20:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
    replies: []
  },
  {
    id: "4",
    posterName: "Bob Wilson",
    content: "Having trouble with TypeScript generics. Any good resources to share?",
    createdAt: "2024-01-17T09:15:00Z",
    updatedAt: "2024-01-17T09:15:00Z",
    replies: [
      {
        id: "5",
        posterName: "Carol Brown",
        content: "Check out the official TypeScript handbook. It has great examples!",
        replyToId: "4",
        createdAt: "2024-01-17T10:30:00Z",
        updatedAt: "2024-01-17T10:30:00Z",
        replies: []
      }
    ]
  }
];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function loadPosts() {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setPosts(hardcodedPosts);
      setLoading(false);
    }, 500);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  function handleDelete(id: string) {
    if (confirm("Are you sure?")) {
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      alert("Deleted successfully.");
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
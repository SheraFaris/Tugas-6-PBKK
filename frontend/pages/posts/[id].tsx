import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Post {
  id: string;
  posterName: string;
  content: string;
  replyToId?: string;
  replies: Post[];
  createdAt: string;
  updatedAt: string;
  replyTo?: Post;
}

export default function PostDetails() {
  const [post, setPost] = useState<Post | null>(null);
  const [replyToPost, setReplyToPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id: postId } = router.query;

  useEffect(() => {
    if (!postId) return;

    async function loadPost() {
      setLoading(true);

      try {
        const response = await fetch(`http://localhost:3000/posts/${postId}`);
        
        if (response.ok) {
          const foundPost = await response.json();
          setPost(foundPost);

          if (foundPost.replyToId) {
            setReplyToPost(foundPost.replyTo || null);
          }
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error loading post:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [postId, router]);

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`http://localhost:3000/posts/${postId}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          alert("Post deleted successfully");
          router.push("/");
        } else {
          alert("Failed to delete post");
        }
      } catch (error) {
        alert("Error deleting post");
      }
    }
  }


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Post Details</h1>
        <div>
          <a href={`/posts/${post.id}/edit`} className="btn btn-warning me-2">
            Edit
          </a>
          <a href="/" className="btn btn-secondary">
            Back to Posts
          </a>
        </div>
      </div>

      {replyToPost && (
        <div className="mb-4 p-3 bg-light border-start border-4 border-primary">
          <div className="small text-muted mb-2">This is a reply to:</div>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <strong>{replyToPost.posterName}</strong>
            <small className="text-muted">{replyToPost.createdAt}</small>
          </div>
          <div className="mb-2">{replyToPost.content}</div>
          <a
            href={`/posts/${replyToPost.id}`}
            className="btn btn-sm btn-outline-primary"
          >
            View Original Post
          </a>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h5 className="mb-0">
              <strong>{post.posterName}</strong>
            </h5>
            <small className="text-muted">{post.createdAt}</small>
          </div>
          <p className="card-text">{post.content}</p>
          <div className="mt-3">
            <small className="text-muted">
              <strong>ID:</strong> {post.id}
              <br />
              <strong>Created:</strong> {post.createdAt}
              <br />
              <strong>Updated:</strong> {post.updatedAt}
            </small>
          </div>
        </div>
      </div>

      <div className="mt-3 d-flex gap-2">
        <a href={`/posts/${post.id}/reply`} className="btn btn-primary">
          Reply
        </a>
        <button type="button" className="btn btn-danger" onClick={handleDelete}>
          Delete Post
        </button>
      </div>

      {post.replies.length > 0 && (
        <div className="mt-4">
          <h4>Replies ({post.replies.length})</h4>
          {post.replies.map((reply) => (
            <div key={reply.id} className="card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <strong>{reply.posterName}</strong>
                  <small className="text-muted">{reply.createdAt}</small>
                </div>
                <p className="card-text">{reply.content}</p>
                <a
                  href={`/posts/${reply.id}`}
                  className="btn btn-sm btn-outline-primary"
                >
                  View Reply
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

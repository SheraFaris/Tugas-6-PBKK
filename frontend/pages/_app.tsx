import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/">
            My Posts
          </a>
          <div className="navbar-nav">
            <a className="nav-link" href="/">
              All Posts
            </a>
            <a className="nav-link" href="/posts/new">
              New Post
            </a>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        <Component {...pageProps} />
      </div>
    </>
  );
}

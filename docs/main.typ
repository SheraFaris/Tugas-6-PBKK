#set page(paper: "a4", margin: (x: 2cm, y: 2cm))
#set text(font: "New Computer Modern", size: 11pt)
#set par(justify: true, leading: 0.65em)
#set heading(numbering: "1.")

#align(center)[
  #text(size: 18pt, weight: "bold")[
    Template Engine vs Client-Side Rendering
  ]
  #v(0.5em)
  #text(size: 14pt)[
    A Comparison of EJS and ReactJS
  ]
  #v(0.5em)
  #text(size: 12pt)[
    Tugas 6 - PBKK
  ]
  #v(0.5em)
  #text(size: 11pt)[
    December 19, 2025
  ]
]

#v(1em)

= Introduction

This document provides a comprehensive comparison between template engines (specifically EJS - Embedded JavaScript) and client-side rendering frameworks (specifically ReactJS). Both approaches are used for building web applications, but they differ fundamentally in how they render content and handle user interactions.

= Implementation Overview

In this project, we implemented a posts management application using:

- *Backend:* NestJS with Prisma ORM and SQLite database
- *Frontend:* Next.js with React (Client-Side Rendering approach)
- *API:* RESTful endpoints for CRUD operations

== Backend Implementation

The backend was implemented with the following components:

=== Posts Controller (`posts.controller.ts`)
The controller defines RESTful endpoints:
- `GET /posts` - Retrieve all top-level posts with nested replies
- `GET /posts/:id` - Retrieve a specific post by ID
- `GET /posts/:id/replies` - Retrieve all replies for a specific post
- `POST /posts` - Create a new post or reply
- `PUT /posts/:id` - Update an existing post
- `DELETE /posts/:id` - Delete a post and its replies (cascade)

=== Posts Service (`posts.service.ts`)
The service layer handles all database operations using Prisma:
- Fetching posts with nested relationships (replies)
- Creating new posts with validation for parent posts
- Updating post content
- Deleting posts with proper error handling
- Structured error handling using custom Prisma error handler

== Frontend Implementation

The frontend was transformed from using hard-coded data to consuming the backend API:

=== Home Page (`pages/index.tsx`)
- Fetches all posts from `GET /posts` endpoint
- Displays posts with nested replies
- Implements delete functionality via `DELETE /posts/:id`
- Real-time state updates using React hooks

=== Post Details Page (`pages/posts/[id].tsx`)
- Fetches individual post data from `GET /posts/:id`
- Displays the post with all its replies
- Shows parent post if the current post is a reply
- Implements delete functionality

=== Create Post Page (`pages/posts/new.tsx`)
- Form for creating new posts
- Submits data to `POST /posts` endpoint
- Validates input before submission

=== Edit Post Page (`pages/posts/[id]/edit.tsx`)
- Fetches existing post data
- Updates post content via `PUT /posts/:id`
- Already implemented with API calls

=== Reply Page (`pages/posts/[id]/reply.tsx`)
- Creates a reply to an existing post
- Links reply to parent via `replyToId` field
- Already implemented with API calls

= Template Engine (EJS) vs Client-Side Rendering (ReactJS)

== Template Engine - EJS

=== How It Works
Template engines like EJS render HTML on the server side. The server processes the template, injects data, and sends complete HTML to the browser.

```javascript
// Example EJS workflow
app.get('/posts', async (req, res) => {
  const posts = await fetchPostsFromDB();
  res.render('posts', { posts }); // Server renders HTML
});
```

=== Characteristics
- *Server-Side Rendering (SSR):* HTML is generated on the server
- *Simple Syntax:* Embedded JavaScript in HTML templates
- *Page Reloads:* Each navigation typically requires a full page reload
- *Less JavaScript:* Minimal client-side JavaScript needed
- *SEO-Friendly:* Search engines easily index pre-rendered content

=== Advantages
+ *Better Initial Load Performance:* Users see content faster as HTML is pre-rendered
+ *SEO Benefits:* Content is immediately available for search engine crawlers
+ *Lower Client Requirements:* Works on devices with limited JavaScript support
+ *Simpler Deployment:* No build process for client-side code
+ *Reduced Bandwidth:* Less JavaScript needs to be downloaded

=== Disadvantages
- *Server Load:* Every request requires server processing
- *Poor Interactivity:* Page reloads disrupt user experience
- *Limited State Management:* Difficult to maintain application state
- *Slower Navigation:* Each page change requires server round-trip
- *Less Dynamic:* Updates require full page reloads

== Client-Side Rendering - ReactJS

=== How It Works
React applications render content in the browser. The server sends minimal HTML and JavaScript bundles that render the UI client-side.

```javascript
// Example React workflow
function Posts() {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);
  
  return <div>{posts.map(post => <Post key={post.id} {...post} />)}</div>;
}
```

=== Characteristics
- *Client-Side Rendering (CSR):* HTML is generated in the browser
- *Component-Based:* UI is built from reusable components
- *Single Page Application (SPA):* No full page reloads
- *Rich Interactivity:* Smooth, app-like user experience
- *State Management:* Built-in tools for managing application state

=== Advantages
+ *Superior User Experience:* Fast, smooth interactions without page reloads
+ *Rich Interactivity:* Complex UI interactions and animations
+ *Reduced Server Load:* Server only sends data (JSON), not HTML
+ *Better State Management:* Easy to maintain complex application state
+ *Modular Architecture:* Reusable components improve maintainability
+ *Optimistic Updates:* UI can update before server confirmation

=== Disadvantages
- *Initial Load Time:* Larger JavaScript bundle takes time to download and parse
- *SEO Challenges:* Content not immediately available (though solvable with SSR/SSG)
- *Browser Requirements:* Requires modern browser with JavaScript enabled
- *Complexity:* Steeper learning curve and more complex tooling
- *Memory Usage:* Client-side state management uses more browser memory

= Comparison Summary

#table(
  columns: (auto, 1fr, 1fr),
  align: (center, left, left),
  [*Aspect*], [*Template Engine (EJS)*], [*Client-Side Rendering (ReactJS)*],
  
  [*Rendering Location*], 
  [Server-side], 
  [Client-side (browser)],
  
  [*Initial Load Speed*], 
  [Fast - HTML is pre-rendered], 
  [Slower - JavaScript must load and execute],
  
  [*Navigation Speed*], 
  [Slow - Full page reloads], 
  [Fast - No page reloads],
  
  [*SEO*], 
  [Excellent - Content immediately available], 
  [Requires additional setup (SSR/SSG)],
  
  [*User Experience*], 
  [Basic - Page refreshes], 
  [Excellent - Smooth, app-like],
  
  [*Server Load*], 
  [High - Server renders every request], 
  [Low - Server only sends data],
  
  [*Interactivity*], 
  [Limited], 
  [Rich and dynamic],
  
  [*State Management*], 
  [Difficult], 
  [Built-in solutions],
  
  [*Development Complexity*], 
  [Simple and straightforward], 
  [Complex, requires build tools],
  
  [*Scalability*], 
  [Server-dependent], 
  [Better - CDN cacheable assets],
  
  [*Offline Support*], 
  [None], 
  [Possible with Service Workers],
)

= Which One Is Better?

== The Answer: It Depends

Neither approach is universally "better" - the choice depends on your specific requirements:

== Choose Template Engine (EJS) When:

+ *SEO is Critical:* Content-heavy websites, blogs, news sites
+ *Simple Requirements:* Basic CRUD applications without complex interactions
+ *Target Audience:* Users with older devices or limited JavaScript support
+ *Development Team:* Team more comfortable with traditional server-side development
+ *Budget Constraints:* Simpler development and deployment requirements

*Example Use Cases:*
- Marketing websites
- Documentation sites
- Traditional web applications
- Admin panels with basic functionality

== Choose Client-Side Rendering (ReactJS) When:

+ *Rich Interactivity:* Applications requiring complex user interactions
+ *Single Page Application:* Apps where page reloads would disrupt workflow
+ *Real-Time Updates:* Applications with live data updates
+ *Modern User Experience:* Apps competing with native applications
+ *API-First Architecture:* Decoupled frontend and backend

*Example Use Cases:*
- Social media platforms
- Dashboard and analytics tools
- Real-time collaboration tools
- E-commerce applications with dynamic filtering
- Our posts management application

== Hybrid Approach - Best of Both Worlds

Modern frameworks like Next.js (which we used) offer a hybrid approach:
- *Server-Side Rendering (SSR):* Initial page load is server-rendered for SEO
- *Client-Side Rendering:* Subsequent navigation uses client-side rendering
- *Static Site Generation (SSG):* Pre-render pages at build time
- *Incremental Static Regeneration:* Update static pages without rebuilding

This hybrid approach combines the benefits of both methods.

= Why ReactJS Was Chosen for This Project

For our posts management application, *ReactJS (via Next.js) is the better choice* for the following reasons:

== User Experience Requirements
+ Users need to navigate between posts without page reloads
+ Real-time updates when creating, editing, or deleting posts
+ Smooth transitions and animations enhance usability
+ Nested replies require dynamic expanding/collapsing

== Application Characteristics
+ *Interactive by Nature:* Posts application requires frequent user interactions
+ *State Management:* Need to track posts, replies, loading states, errors
+ *Optimistic Updates:* Can update UI immediately while waiting for server
+ *Component Reusability:* Post components can be reused for replies

== Technical Benefits
+ *API Separation:* Clean separation between frontend and backend
+ *Scalability:* Can deploy frontend and backend independently
+ *Modern Development:* Better developer experience with hot reloading
+ *Future Extensibility:* Easy to add features like real-time notifications

== Performance Considerations
+ *After Initial Load:* Navigation is instantaneous
+ *Reduced Server Load:* Server only handles API requests, not HTML rendering
+ *Caching:* API responses can be cached, static assets served via CDN
+ *Progressive Enhancement:* Can add service workers for offline support

= Conclusion

Both template engines and client-side rendering have their place in modern web development:

- *Template Engines (EJS)* excel at delivering content quickly with excellent SEO, ideal for content-heavy, server-rendered applications with simpler interactivity needs.

- *Client-Side Rendering (ReactJS)* provides superior user experience with rich interactivity, perfect for dynamic applications requiring frequent user interactions.

For our posts management application, *ReactJS is the clear winner* because:
+ The application is inherently interactive
+ User experience benefits greatly from SPA architecture
+ Real-time updates and smooth navigation are essential
+ The component-based architecture improves maintainability
+ Modern web development practices favor decoupled architecture

However, by using Next.js, we maintain the flexibility to add server-side rendering or static generation in the future if SEO becomes a priority, giving us the best of both worlds.

The key takeaway is to *choose the technology that best fits your project requirements* rather than following trends blindly. Understanding the trade-offs allows you to make informed decisions that benefit both users and developers.

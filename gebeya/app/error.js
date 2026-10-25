'use client';
export default function ErrorPage({ reset }) {
  return (
    <div className="card narrow">
      <h1>The lights flickered</h1>
      <p>Something went wrong, or that action was refused.</p>
      <button className="btn" onClick={reset}>Try again</button>
    </div>
  );
}

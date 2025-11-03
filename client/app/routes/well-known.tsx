// This route handles Chrome DevTools .well-known requests
// Returns 404 to prevent console errors
export async function loader() {
  return new Response(null, { status: 404 });
}

export default function WellKnown() {
  return null;
}

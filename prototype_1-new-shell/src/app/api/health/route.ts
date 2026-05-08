export async function GET() {
  try {
    // Add any health checks here (database, external APIs, etc.)
    // For now, just return healthy

    return Response.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        status: "unhealthy",
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}

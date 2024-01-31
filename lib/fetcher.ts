class SWRError extends Error {
  status?: number
  constructor(message: string, status?: number, errorOpts?: ErrorOptions) {
    super(message, errorOpts)
    this.status = status
  }
}

export async function fetchJson<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    ...init,
  })

  if (!res.ok) {
    // Attach extra info to the error object.
    const error = new SWRError(
      "An error occurred while fetching the data.",
      res.status
    )

    console.trace(error)
    try {
      console.error(await res.text())
    } catch (e) {
      console.error("Unable to parse error info")
    }
    throw error
  }

  return res.json()
}

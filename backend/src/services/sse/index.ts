import { Request, Response } from 'express';

// How often to send a heartbeat to every client. Keeps intermediaries (NAT,
// proxies, Brave's background-tab throttler) from timing out an idle stream,
// and gives the client watchdog something to observe.
const HEARTBEAT_INTERVAL_MS = 15000;
// Tells the browser how long to wait before its native reconnect attempt.
const CLIENT_RETRY_MS = 3000;

class SSEManager {
  private clients: { [id: string]: Response } = {};
  private clientIdCounter = 0;
  private heartbeat: NodeJS.Timeout | null = null;

  constructor() {}

  public init(req: Request, res: Response) {
    req.socket.setKeepAlive(true);
    // Flush small heartbeat/update writes immediately instead of buffering them.
    req.socket.setNoDelay(true);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      // Prevent reverse proxies (e.g. nginx) from buffering the event stream.
      'X-Accel-Buffering': 'no'
    });
    // Push the headers out now so the browser registers the open connection.
    res.flushHeaders();

    res.write(`retry: ${CLIENT_RETRY_MS}\n\n`);
    res.write(`data: ${JSON.stringify({ status: 'Connected' })}\n\n`);

    const clientId = this.clientIdCounter++;
    this.clients[clientId] = res;

    // A connection can die cleanly (close) or error out; prune on either.
    const cleanup = () => this.removeClient(clientId);
    req.on('close', cleanup);
    res.on('error', cleanup);

    this.startHeartbeat();

    return clientId;
  }

  public sendUpdate<T>(data: SSEUpdate<T>) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    for (const clientId in this.clients) {
      this.writeToClient(clientId, payload);
    }
  }

  public sendUpdateToClient<T>(clientId: string, data: SSEUpdate<T>) {
    this.writeToClient(clientId, `data: ${JSON.stringify(data)}\n\n`);
  }

  private writeToClient(clientId: string, payload: string) {
    const client = this.clients[clientId];
    if (!client) return;
    // Socket already finished/destroyed -> drop it without attempting a write.
    if (client.writableEnded || client.destroyed) {
      this.removeClient(clientId);
      return;
    }
    try {
      client.write(payload);
    } catch {
      // Write failed -> the connection is broken, prune the client.
      this.removeClient(clientId);
    }
  }

  private removeClient(clientId: string | number) {
    const client = this.clients[clientId];
    if (!client) return;
    delete this.clients[clientId];
    try {
      client.end();
    } catch {
      // already closed
    }
    if (Object.keys(this.clients).length === 0) {
      this.stopHeartbeat();
    }
  }

  private startHeartbeat() {
    if (this.heartbeat) return;
    this.heartbeat = setInterval(() => {
      for (const clientId in this.clients) {
        // Named SSE event: does not trigger the client's `onmessage` data
        // handler, but is observable via addEventListener('ping', ...) so the
        // client watchdog can confirm the connection is alive.
        this.writeToClient(clientId, `event: ping\ndata: ${Date.now()}\n\n`);
      }
    }, HEARTBEAT_INTERVAL_MS);
    // Don't keep the process alive solely for the heartbeat.
    this.heartbeat.unref();
  }

  private stopHeartbeat() {
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
      this.heartbeat = null;
    }
  }
}

type SSEUpdate<T> = {
  update: {
    type: string;
    data: T;
    timestamp: string;
  };
};

export default new SSEManager();

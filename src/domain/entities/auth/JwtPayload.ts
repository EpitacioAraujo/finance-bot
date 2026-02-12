export class JwtPayload {
  // Session ID
  sessionId: string;

  constructor(props: { sessionId: string }) {
    this.sessionId = props.sessionId;
  }
}

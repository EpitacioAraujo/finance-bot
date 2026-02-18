export class JwtPayload {
  // sub: user id (ULID)
  sub: string;
  // sid: session id (ULID)
  sid: string;
  // did: device id (ULID)
  did: string;
  // tv: token version (global invalidation)
  tv: number;
  // jti: token id (ULID)
  jti: string;

  constructor(props: {
    sub: string;
    sid: string;
    did: string;
    tv: number;
    jti: string;
  }) {
    this.sub = props.sub;
    this.sid = props.sid;
    this.did = props.did;
    this.tv = props.tv;
    this.jti = props.jti;
  }
}

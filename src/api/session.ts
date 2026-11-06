let accessToken: string | null = null
let onSessionExpired: (() => void) | null = null

export const getAccessToken = () => accessToken

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function setSessionExpiredHandler(handler: () => void) {
  onSessionExpired = handler
}

export function notifySessionExpired() {
  onSessionExpired?.()
}

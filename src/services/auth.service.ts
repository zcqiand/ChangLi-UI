import { UserManager, WebStorageStateStore, User } from "oidc-client"

export default class AuthService {
  private userManager: UserManager

  constructor() {
    const settings: any = {
      authority: `${import.meta.env.VITE_IDENTITYSERVER_APP_URL}`,
      client_id: `${import.meta.env.VITE_CLIENT_ID}`,
      redirect_uri: `${import.meta.env.VITE_APP_URL}/#/callback`,
      automaticSilentRenew: true,
      silent_redirect_uri: `${import.meta.env.VITE_APP_URL}/#/silent-callback`,
      response_type: `${import.meta.env.VITE_GRANT_TYPE}`,
      scope: "openid offline_access",
      userStore: new WebStorageStateStore({ store: window.localStorage })
    }

    this.userManager = new UserManager(settings)
  }

  public getUser(): Promise<User | null> {
    return this.userManager.getUser()
  }

  public login(): Promise<void> {
    return this.userManager.signinRedirect()
  }

  public callback(): Promise<User | undefined> {
    return this.userManager.signinCallback()
  }

  public silentCallback(): Promise<User | undefined> {
    return this.userManager.signinSilentCallback()
  }

  public logout(): Promise<void> {
    return this.userManager.signoutRedirect()
  }

  public getAccessToken(): Promise<string> {
    return this.userManager.getUser().then((data: any) => {
      return data.access_token
    })
  }
}

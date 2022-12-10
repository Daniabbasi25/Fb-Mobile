import {AuthData} from '../models/AuthData';
import {FBBaseError} from '../common/FBBaseError';
import axiosClient, {isFBAppError, isFBBackendError, isFBGenericError} from '../network/axiosClient';
import QueryString from 'query-string';
import {FBUser, FBUserMapper} from '../models/User';
import {
  analyticsEmailLogin,
  analyticsRegistration,
  analyticsResetPassword,
  analyticsSetLocale,
  analyticsSetTC,
  analyticsSocialLogin,
} from '../analytics';
import {FBLocale} from '../redux/user/reducer';

class UserRepositoryError extends FBBaseError {
}

interface LoginResponse {
  user: FBUser,
  authData: AuthData
}

interface BaseUserRepository {
}

interface BaseNotAuthenticatedUserRepository extends BaseUserRepository {
  resetPassword(params: { email: string }): Promise<boolean>;

  loginSocial(params: FacebookLoginSocialParams | GoogleLoginSocialParams): Promise<LoginResponse>;

  loginApple(params: { appleUid: string; appleAuthCode: string; name: string; }): Promise<LoginResponse>;

  login(params: { email: string, password: string }): Promise<LoginResponse>;
}

interface BaseLoginSocialParams {
  email: string;
  firstName: string | null;
  lastName: string | null;
  locale: FBLocale;
}

interface FacebookLoginSocialParams extends BaseLoginSocialParams {
  fbToken: string;
}

interface GoogleLoginSocialParams extends BaseLoginSocialParams {
  googleToken: string;
}

class NotAuthenticatedUserRepository implements BaseNotAuthenticatedUserRepository {
  async resetPassword(params: { email: string, locale: FBLocale }): Promise<boolean> {
    const url = '/user/reset-password';
    try {
      analyticsResetPassword({step: 'initiated'});

      const result: { success: boolean } = await axiosClient.post(
        url,
        QueryString.stringify({
          email: params.email,
          locale: params.locale
        }),
      );

      analyticsResetPassword({step: 'completed', data: {email: params.email}});

      return result.success;
    } catch (e) {

      if (isFBGenericError(e) || isFBAppError(e)) {
        analyticsResetPassword({
          step: 'failed',
          data: {
            email: params.email,
            errorCode: e.status,
          },
        });
      } else if (isFBBackendError(e)) {
        analyticsResetPassword({
          step: 'failed',
          data: {
            email: params.email,
            errorCode: e.status,
            errorString: e.message,
          },
        });
      }

      throw e;
    }
  }

  async loginSocial(params: FacebookLoginSocialParams | GoogleLoginSocialParams): Promise<LoginResponse> {
    const url = '/user/login-social';
    const isFbLogin = 'fbToken' in params;

    try {

      const result: { user: any, token: string } = await axiosClient.post(
        url,
        QueryString.stringify(params),
      );

      const authData: AuthData = {userToken: result.token};
      const user: FBUser = new FBUserMapper().fromApi(result.user);

      analyticsSocialLogin({
        type: isFbLogin ? 'fb' : 'google',
        step: 'completed',
        data: {userId: user.id, email: user.email},
      });

      const userRepository = new UserRepository({authData: authData});
      await userRepository.updateLocale({locale: params.locale});
      analyticsSetLocale({email: user.email, userId: user.id, locale: params.locale});

      return {
        user, authData,
      };
    } catch (e) {
      if (isFBGenericError(e) || isFBAppError(e)) {
        analyticsSocialLogin({
          type: isFbLogin ? 'fb' : 'google',
          step: 'failed',
          data: {errorCode: e.status},
        });
      } else if (isFBBackendError(e)) {
        analyticsSocialLogin({
          type: isFbLogin ? 'fb' : 'google',
          step: 'failed',
          data: {
            errorCode: e.status,
            errorString: e.message,
          },
        });
      }

      throw e;
    }
  }

  async loginApple(params: { appleUid: string; appleAuthCode: string; name: string; locale: FBLocale }): Promise<LoginResponse> {
    const url = '/user/apple-auth';
    try {
      const result: { user: any, token: string } = await axiosClient.post(
        url,
        QueryString.stringify({
          appleUid: params.appleUid,
          appleAuthCode: params.appleAuthCode,
          name: params.name,
        }),
      );

      const authData: AuthData = {userToken: result.token};
      const user: FBUser = new FBUserMapper().fromApi(result.user);

      analyticsSocialLogin({type: 'apple', step: 'completed', data: {userId: user.id, email: user.email}});

      const userRepository = new UserRepository({authData: authData});
      await userRepository.updateLocale({locale: params.locale});
      analyticsSetLocale({email: user.email, userId: user.id, locale: params.locale});

      return {
        user, authData,
      };
    } catch (e) {
      if (isFBGenericError(e) || isFBAppError(e)) {
        analyticsSocialLogin({
          type: 'apple',
          step: 'failed',
          data: {errorCode: e.status}
        });
      } else if (isFBBackendError(e)) {
        analyticsSocialLogin({
          type: 'apple',
          step: 'failed',
          data: {
            errorCode: e.status,
            errorString: e.message,
          },
        });
      }
      
      throw e;
    }
  }

  async login(params: { email: string, password: string; locale: FBLocale }): Promise<LoginResponse> {
    const url = '/user/login';
    try {
      analyticsEmailLogin({email: params.email, step: 'initiated'});

      const result: { user: any, token: string } = await axiosClient.post(
        url,
        QueryString.stringify({
          email: params.email,
          password: params.password,
          locale: params.locale,
        }),
      );

      const authData: AuthData = {userToken: result.token};
      const user: FBUser = new FBUserMapper().fromApi(result.user);

      analyticsEmailLogin({email: user.email, step: 'completed', data: {userId: user.id}});

      const userRepository = new UserRepository({authData: authData});
      await userRepository.updateLocale({locale: params.locale});
      analyticsSetLocale({email: user.email, userId: user.id, locale: params.locale});

      return {
        user, authData,
      };
    } catch (e) {
      if (isFBGenericError(e) || isFBAppError(e)) {
        analyticsEmailLogin({
          email: params.email,
          step: 'failed',
          data: {
            errorCode: e.status,
          },
        });
      } else if (isFBBackendError(e)) {
        analyticsEmailLogin({
          email: params.email,
          step: 'failed',
          data: {
            errorCode: e.status,
            errorString: e.message,
          },
        });
      }

      throw e;
    }
  }

  async register(params: { email: string; firstName: string; lastName: string; password: string; locale: FBLocale}): Promise<boolean> {
    const url = '/user/register';
    try {
      analyticsRegistration({email: params.email, step: 'initiated'});

      const result: { userId: number } = await axiosClient.post(
        url,
        QueryString.stringify({
          email: params.email,
          firstName: params.firstName,
          lastName: params.lastName,
          password: params.password,
          registrationToken: null,
          locale: params.locale
        }),
      );

      analyticsRegistration({email: params.email, step: 'completed', data: {userId: result.userId}});
      return true;
    } catch (e) {
      if (isFBGenericError(e) || isFBAppError(e)) {
        analyticsRegistration({
          email: params.email,
          step: 'failed',
          data: { errorCode: e.status }
        });
      } else if (isFBBackendError(e)) {
        analyticsRegistration({
          email: params.email,
          step: 'failed',
          data: {
            errorCode: e.status,
            errorString: e.message,
          },
        });
      }
      
      throw e;
    }
  }
}

interface BaseAuthenticatedUserRepository extends BaseNotAuthenticatedUserRepository {
  updateUser(params: Partial<FBUser>): Promise<boolean>;

  acceptTC(params: {}): Promise<boolean>;

  setFcmToken(params: { fcmToken: string }): Promise<boolean>;

  updateLocale(params: { locale: FBLocale }): Promise<boolean>;

  checkMe(params: {}): Promise<FBUser>;
}

class UserRepository extends NotAuthenticatedUserRepository implements BaseAuthenticatedUserRepository {
  private authData: AuthData;

  constructor(params: {
    authData: AuthData
  }) {
    super();
    this.authData = params.authData;
  }

  async checkMe(params: {}): Promise<FBUser> {
    const url = '/user/me';
    
    const result: { success: boolean, data: any } = await axiosClient.get(
      url,
      {
        headers: {
          'x-access-token': this.authData.userToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    
    return new FBUserMapper().fromApi(result.data);
  }

  async updateLocale(params: { locale: FBLocale }): Promise<boolean> {
    const url = '/user/language';
    
    const result: { success: boolean } = await axiosClient.put(
      url,
      QueryString.stringify({
        locale: params.locale,
      }),
      {
        headers: {
          'x-access-token': this.authData.userToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return result.success;
  }

  async updateUser(params: Partial<FBUser>): Promise<boolean> {
    const url = '/user/me';
    
    const result: { success: boolean } = await axiosClient.put(
      url,
      QueryString.stringify({
        firstName: params.firstName,
        lastName: params.lastName,
        phoneNumber: params.phoneNumber,
      }),
      {
        headers: {
          'x-access-token': this.authData.userToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return result.success;
  }

  async acceptTC(params: { userId: number; email: string; }): Promise<boolean> {
    const url = '/user/accept-tc';
    
    const result: { success: boolean } = await axiosClient.patch(
      url,
      undefined,
      {
        headers: {
          'x-access-token': this.authData.userToken,
        },
      },
    );
    
    return result.success;
  }

  async setFcmToken(params: { fcmToken: string }): Promise<boolean> {
    const url = '/user/device-id';
    
    const result: { success: boolean } = await axiosClient.post(
      url,
      QueryString.stringify({
        deviceId: params.fcmToken,
      }),
      {
        headers: {
          'x-access-token': this.authData.userToken,
        },
      },
    );

    return result.success;
  }

  async updatePassword(params: { newPassword: string }): Promise<boolean> {
    const url = '/user/update-password-logged';
    
    const result: { success: boolean } = await axiosClient.put(
      url,
      QueryString.stringify({
        newPass: params.newPassword,
      }),
      {
        headers: {
          'x-access-token': this.authData.userToken,
        },
      },
    );

    return result.success;
  }
}

export {
  NotAuthenticatedUserRepository,
  UserRepository,
  UserRepositoryError,
};

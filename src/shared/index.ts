import * as bcrypt from 'bcrypt';
export const ApiConsumesFromUrl = 'application/x-www-form-urlencoded';
export const ApiConsumesFromData = 'multipart/form-data';
// hash pass and compare pass
export const hashedPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const checkIsMatchPassword = (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// key authentication
export const JWT_AUTH = {
  ALGORITHM: 'HS512',
  EXPIRES_IN: '1d',
  SESSION_KEY:
    'cbd3f46c2644ba8e4a7e12ec81c38e48fe6daa8f6ad2d7ffc3466e9b1282a8317649bcbed5e69951c3253998ba571959ab0de9e5dce8445c64859c1cd2e97531',
};

export const AUTH_MESSAGE = {
  USER_EXIST: 'Người dùng đã tồn tại!',
  NOT_FOUND: 'Tài khoản không tồn tại!',
  EXIST: 'Username đã tồn tại!',
  CONFIRM_PASSWORD: 'Mật khẩu phải trùng nhau!',
  WRONG_PASSWORD: 'Sai mật khẩu!',
  SUBMITTED: 'Xác thực tài khoản thành công!',
  ROLE: 'Người dùng không đủ quyền hạn!',
  UNAUTHORIZED: 'Bạn cần đăng nhập để sử dụng tính năng này!',
  WRONG: 'Tài khoản hoặc mật khẩu không chính xác!',
  EMAIL_EXIST: 'Email đã tồn tại!',
  PHONE_EXIST: 'Phone đã tồn tại!',
  TOKEN: {
    EXPIRED: 'Yêu cầu đã hết hạn!',
  },
};

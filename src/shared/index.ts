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

export const changeToSlug = (text: string, date?: Date): string => {
  //Đổi chữ hoa thành chữ thường
  let slug = text.toLowerCase();

  //Đổi ký tự có dấu thành không dấu
  slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  slug = slug.replace(/đ/gi, 'd');
  //Xóa các ký tự đặt biệt
  slug = slug.replace(
    /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
    '',
  );
  //Đổi khoảng trắng thành ký tự gạch ngang
  slug = slug.replace(/ /gi, '-');
  //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
  //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
  slug = slug.replace(/\-\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-/gi, '-');
  slug = slug.replace(/\-\-/gi, '-');
  //Xóa các ký tự gạch ngang ở đầu và cuối
  slug = '@' + slug + '@';
  slug = slug.replace(/\@\-|\-\@|\@/gi, '');
  //In slug ra text box có id “slug”
  const time = date ? date.getTime() : '';
  return `${slug}${time}`;
};

export type ApiResponse = {
  success: boolean;
};

export type ApiMessageResponse = ApiResponse & {
  message: string;
};

export type ApiErrorResponse = ApiMessageResponse & {
  success: false;
  type: 'error';
};

export type ApiSuccessResponse = ApiMessageResponse & {
  success: true;
  type: 'success';
};

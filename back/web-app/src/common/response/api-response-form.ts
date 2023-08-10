export class ApiResponseForm {
  static ok(data: any = {}) {
    return {
      data: data,
      resStatus: {
        code : '0000',
        message: '',
      },
    }
  }

  static redirect(data: any = {}) {
    return {
      data: data,
      resStatus: {
        code : '0002',
        message: '',
      },
    }
  }

  static bad(message: string = '', data: any = {}) {
    return {
      data: data,
      resStatus: {
        code : '0001',
        message: message,
      },
    }
  }
}
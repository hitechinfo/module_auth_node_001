const systemMessage = {
    search : {
        targetMissing: 'Target is missing',
        incorrectKey: 'Incorrect target key : '
    },
    createUser : {
      invalidEmailFormat: '이메일 형식이 아닙니다.',
      invalidPasswordFormat: '올바른 비밀번호 형식이 아닙니다.'
    },
    login : {
      invalidInfo: '입력정보를 확인해주세요'
    },
    token : {
      tokenRequired: 'token is required!',
      tokenExpired: 'TokenExpiredError : 토큰이 만료되었습니다.',
      tokenInvalidInfo: 'JsonWebTokenError : 토큰이 유효하지 않습니다.',
      tokenDisagreement: '토큰이 서로 일치 하지 않습니다.'
    },
    analysis : {
      error: '자소서 분석중 오류가 발생하였습니다.'
    },
    delete : {
      success: '성공적으로 삭제하였습니다.'
    }
}

module.exports = systemMessage;

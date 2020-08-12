class Auth {
    static data = {};
    static token = {};

    constructor() {
        Auth.data = localStorage.getItem('user')
            ? JSON.parse(localStorage.getItem('user'))
            : {};
        Auth.token = localStorage.getItem('token')
            ? JSON.parse(localStorage.getItem('token'))
            : {};
    }

    User() {}

    UserId() {
        return Auth.data ? Auth.data.user_id : null;
    }

    UserType() {
        return Auth.data ? Auth.data.user_type : null;
    }

    Token() {
        return Auth.token ? Auth.token : null;
    }
}

export default () => new Auth();

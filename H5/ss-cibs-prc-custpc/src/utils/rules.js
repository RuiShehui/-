import i18n from '@/i18n';
export function telephone(rule, value, callback) {
    let regExp = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/
    if (!value || value.length === 0) {
        callback(new Error(i18n.t('COMMON.PLEASE_INPUT_SOMETHING', {
            input: i18n.t('AUTHORIZE.AUTH_MOBILE')
        })))

    }
    else {
        if (!regExp.test(value)) {
            callback(new Error(i18n.t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: i18n.t('AUTHORIZE.AUTH_MOBILE')
            })))
        }
        else {
            callback()
        }
    }
}
export function email(rule, value, callback) {
    let regExp = /^[a-zA-Z_0-9-]+@[a-zA-Z_0-9-]+(\.[a-zA-Z_0-9-]+)+$/
    if (!value || value.length === 0) {
        callback(new Error(i18n.t('COMMON.PLEASE_INPUT_SOMETHING', {
            input: i18n.t('USER_MANAGEMENT.USER_EMAIL')
        })))
    }
    else {
        if (!regExp.test(value)) {
            callback(new Error(i18n.t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: i18n.t('USER_MANAGEMENT.USER_EMAIL')
            })))
        }
        else {
            callback()
        }
    }
}
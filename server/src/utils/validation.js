class ValidationUtils{
    static isEmpty(val){
        if(val == null || val == undefined) return true;
        if(typeof val === 'string' && val.trim() === '') return true;
        if(typeof val === 'object' && Object.keys(val).length === 0) return true;
        return false;
    }

    static isValidEmail(email){
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regex.test(email);
    }

    static isValidPassword(password){
        if(typeof password === 'string' && password.trim().length >= 4) return true;
        return false;
    }

    static isValidStringLength(str, min, max){
        if(typeof str === 'string' && str.trim().length >= min && str.trim().length <= max) return true;
        return false;
    }

    static isValidNumberRangeValue(num, min, max){
        if(isNaN(num)) return false;
        return +num >= min && +num <= max;
    }
}

module.exports = ValidationUtils;
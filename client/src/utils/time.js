class TimeUtils{
    static ten(val){
        return val > 10 ? val : '0' + val;
    }

    static getLocalTime(time){
        const d = new Date(time);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
        
    }
}

export default TimeUtils;
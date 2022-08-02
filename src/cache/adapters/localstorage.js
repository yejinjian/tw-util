import {formatTime,prefix} from "../utils";

export default {
    type:"local",
    check(){
        return window && window.localStorage;
    },
    get(key){
        try{
            const ret = JSON.parse(localStorage.getItem(prefix+key));
            if (ret) {
                const {v, t} = ret;
                const now = Date.now();
                if (!t || t > now) return v;
                this.delete(key);
            }
        }catch (e){
            console.error('数据没找到');
        }
        return;
    },
    set(key,value,opts={}){
        if(value){
            let data = {v: value};
            const {expires} = opts;
            if (expires) data.t = formatTime(expires).getTime();
            return localStorage.setItem(prefix+key, JSON.stringify(data))
        }else {
            return localStorage.removeItem(prefix+key);
        }
    },
    clear(key,opts){
        let i = 0;
        while (true){
            const lKey = localStorage.key(i++);
            if(!lKey) break;
            if(!lKey.startsWith(prefix)) continue;
            if(!key || lKey.indexOf(key)>-1) localStorage.removeItem(lKey);
        }
        return true;
    },
    delete(key,opts){
        this.set(key,null, opts);
    }
}

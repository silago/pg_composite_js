var fromJsArrayToPG = function (arr) {
    var result = '(\"{';
    for (var i = 0; i < arr.length; i++) {
        if (i) result+=','; //if not first
        if (arr[i]==null) {

        } else if (!arr[i]) {
            result+='NULL';
        } else {
            result+=       "\"\"" + arr[i].replace('\\','\\\\\\\\','g').replace('\"','\\\\\"\"','g') + "\"\"";
        } 
    }
    result+='}\")';
    return result;
}


var parseFromPgToArray = function(value) {
    if (!value) {
        return [""];
    }
    if (!value) return value;
    var result = [];
    var fields = [];
    var i = 0;
    do i++; while (i<value.length && value[i]!='{');
    var start_i = i+1; //ert(i);

    if (i>=value.length) {
      return;
    }
    i++;

    var t = 0;
    fields[t] = "";
    var quotes = 0;
    while (value[i] == '"' && quotes <2 && value) {
        quotes ++;
        i++;
    }    

    var prev_i = 0;
    while (true && value[i]) {
        if (prev_i == i) {
            console.log('bad value on: '+value);
            break;
        }
        prev_i = i;
        var inside = false;
        if (quotes == 0) {
            if (value[i]!=',' && (value[i]!='}' )) {
                fields[t]+=value[i];
                inside=true;
            }
        } else {
           if (value[i]+value[i+1]+value[i+2]=='\\""') {
                i+=2;
                fields[t]+='\"';
                inside=true;
            } else
            if (value[i]+value[i+1]+value[i+2]+value[i+3]=='\\\\""') {
                fields[t]+='\"';
                i+=3;
                inside=true;
            } else
            if (value[i]+value[i+1]+value[i+2]+value[i+3]=='\\\\\\\\') {
                fields[t]+='\\';
                i+=3;
                inside = true;
            } else if (value[i]!='"') {
                fields[t]+=value[i];
                inside = true;
            }
        }
        //if (inside) alert(i); break;
         if (!inside) {
            while(value[i]=='"') {
                quotes--;
                i++;
            }

            if (value[i] == '}' ) {
              break;
            }
            i++;
            t++;
            fields[t]='';
            while( value[i]=='"' && quotes < 2) {
                quotes++;
                i++;
            }
        } else {
            i++;
        }
        if (i>=value.length) {
            console.error('not pg composite');
            return;
        }
    }
    for (var i=0; i<fields.length; i++) {
        if (fields[i]=='NULL') {
            fields[i]=null;
        }
    }
    return fields;
}

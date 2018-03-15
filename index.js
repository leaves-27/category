var fs = require("fs");
var endData = {
  "One": [
    "汽车品类", 
    "电动车品类", 
    "3C数码品类"
  ],
  "Two": [],
  "Three":  []
}

var CsvToJSON = {
  init:function(){
    var files = ["car","bike","3C"];
    this.files = files;
    var _self = this;
    var newFiles = []
    for(var i=0;i<files.length;i++){
      // (function(i){
      //   _self.read(files[i],function(data){
      //     var newData = _self.processer(data,files[i]);
      //     newFiles.push(newData);
      //   })
      // })(i);
      var data = _self.read(files[i]);
      var newData = _self.processer(data,files[i]);
      newFiles.push(JSON.parse(newData));
    }


    for(var j=0;j<newFiles.length;j++){
      endData["Two"].push(newFiles[j].brand);
      endData["Three"].push(newFiles[j].type);
      _self.write("end-data",JSON.stringify(endData));
    }
  },
  unique(array){
    var temp = []; //一个新的临时数组
    for(var i = 0; i < array.length; i++){
      if(temp.indexOf(array[i]) == -1){
        temp.push(array[i]);
      }
    }
    return temp;
  },
  getProductType(data,fileName){
    var _this = this;
    var types = [];
    var rows = data.split(/\s+/);
    var json = {};
    var brands = this.getProductBrand(data,fileName);

    for(var j in brands){
      json[brands[j]] = [];
      for(var i in rows){
        var cols = rows[i].split(",");

        if(fileName==_this.files[2]){
          if(brands[j]==cols[0]){
            json[brands[j]].push(cols[1]);
          }
        }else{
          if(brands[j]==cols[1]){
            json[brands[j]].push(cols[2]);
          }
        }
      }
    }

    for(var k in json){
      types.push(json[k]);
    }

    return types;
  },
  getProductBrand(data,fileName){
    var _this = this;
    var rows = data.split(/\s+/);
    var brands = [];
    for(var i in rows){
      var cols = rows[i].split(",");
      
      if(fileName==_this.files[2]){
        if(cols[0]){
          brands.push(cols[0])
        };
      }else{
        if(cols[1]){
          brands.push(cols[1])
        };
      }
    }

    brands.splice(0,1);
    return this.unique(brands);
  },
  processer:function(data,fileName){
    return JSON.stringify({
      "brand" : this.getProductBrand(data,fileName),
      "type" : this.getProductType(data,fileName)
    });
  },
  read:function(name,callback){
    var url = __dirname + '/csv/'+name+'.csv';

    var data = fs.readFileSync(url, {flag: 'r+', encoding: 'utf8'});
    return data;
    // fs.readFile(url, {flag: 'r+', encoding: 'utf8'}, function (err, data) {
    //   if(err) {
    //    console.error(err);
    //    return;
    //   }
    //   callback(data);
    // });
  },
  write:function(name,data){
    var url = __dirname + "/json/"+ name +".json";
    fs.open(url, 'w', '777', function (err, fd) {
      fs.writeFile(url, data, {flag: 'w+', encoding: 'utf8'}, function (err) {
        if(err) {
          console.error(err);
        }else{
          fs.close(fd)
        }
      });
    });
    
  }
}

CsvToJSON.init();
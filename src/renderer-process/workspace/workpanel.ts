//$(function () {
//    $('#myList a:last-child').tab('show');

import { Stats } from "fs";

//});
let mysql = require('mysql');
let fs = require('fs');
let osenv = require('osenv');
// 引入 aysnc模块
let async = require('async');
// 引入path模块
let path = require('path');
class FileClass{
  fileName: string;
  path: string | Buffer | URL;
  type: string;
  size:Number;
  constructor(fileName: string, path: string | Buffer | URL,type: string,size:Number)
  {
    this.fileName = fileName;
    this.path = path;
    this.type = type;
    this.size = size;
  }
}
function connectionDB(){
    let connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '123qwe', // or the original password : 'apaswword'
        database : 'komodohstauto'
    });
}
function getUsersHomeFolder() {
    return osenv.home();
}
/**
 * 获取目录第一步
 */
function getFilesInFolder(folderPath:string | Buffer | URL) {
  console.log('Folder is '+folderPath);
  fs.readdir(folderPath, function(err:Error,files:Array<File>){
    if (err) {
      console.log('Folder is not load.'+err.message);
      return;
      }
      inspectAndDescribeFiles(folderPath, files, displayFiles);
  });
}
function inspectAndDescribeFiles(folderPath:string | Buffer | URL, files:Array<File>, displayFiles:Function){
  async.map(files, function(file:File, asyncCB:Function){
  let resolveFilePath = path.resolve(folderPath, file);
  inspectAndDescribeFile(resolveFilePath, asyncCB);
  }, displayFiles);
}
function inspectAndDescribeFile(filePath:string | Buffer | URL, displayFiles:Function) {
  let result = new FileClass(path.basename(filePath), filePath,'',0);
  fs.stat(filePath, (err:Error, stat:Stats) => {
    if (err) {
      displayFiles(err);
    } else {
      if (stat.isFile()) { // 判断是否是文件
        result.type = 'file';
        result.size = stat.size;
      }
      if (stat.isDirectory()) { // 判断是否是目录
        result.type = 'directory';
        result.size = stat.size;
      }
      displayFiles(err, result);
    }
  });
}
function displayFiles(err:Error,files:Array<FileClass>) {
    if (err) {
      return alert('sorry, we could not display your files');
    }
    files.forEach(displayFile);
}

function displayFile(file:FileClass) {
  console.log(file.fileName +' ' + file.type+' '+file.size);
  //let mainArea = document.getElementById('main-area');
  //let template = document.querySelector('#item-template');
  // 创建模板实列的副本
  //let clone = document.importNode(template.content, true);
  
  // 加入文件名及对应的图标
  //clone.querySelector('img').src = `images/${file.type}.svg`;
  //clone.querySelector('.filename').innerText = file.name;
  //mainArea.appendChild(clone);
}

getFilesInFolder(getUsersHomeFolder());
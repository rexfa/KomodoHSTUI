"use strict";
/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
// $(function () {
//    $('#myList a:last-child').tab('show');
Object.defineProperty(exports, "__esModule", { value: true });
// });
// import mysql = require('mysql');
const fs = require("fs");
const osenv = require("osenv");
// 引入 aysnc模块
const async = require("async");
// 引入path模块
const path = require("path");
const drivelist = require("drivelist");
/**
 * 文件类
 */
class FileClass {
    /**
     *
     * @param {string} fileName 文件名
     * @param {string | Buffer | URL} path 路径
     * @param {string} type 类型
     * @param {number} size 大小
     */
    constructor(fileName, path, type, size) {
        this.fileName = fileName;
        this.path = path;
        this.type = type;
        this.size = size;
    }
}
/*
function connectionDB() {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123qwe', // or the original password : 'apaswword'
    database: 'komodohstauto',
  });
}*/
/**
 * @return {string} 返回当前用户目录
 */
function getUsersHomeFolder() {
    //console.log('Home is '+osenv.home());
    return osenv.home();
}
/**
 * 获取目录第一步,需要制定目录全路径名称
 * @param {string | Buffer | URL} folderPath 目录
 */
function getFilesInFolder(folderPath) {
    console.log('Folder is ' + folderPath);
    removeAllFileAndDir();
    const lbCurrentdisk = document.getElementById('hstautoworkpanel-storepanel-currentdisk');
    lbCurrentdisk.innerHTML = folderPath;
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.log('Folder is not load.' + err.message);
            return;
        }
        //console.log('Folders files length is '+files.length);
        inspectAndDescribeFiles(folderPath, files);
    });
}
/**
 * 异步读取文件和目录
 * @param {string | Buffer | URL} folderPath 目录
 * @param {string[]} files 文件数组
 */
function inspectAndDescribeFiles(folderPath, files) {
    async.map(files, function (file) {
        const resolveFilePath = path.resolve(folderPath, file); // 返回相对当前路径呃绝对路径
        console.log('Get Path Folders is ' + resolveFilePath);
        inspectAndDescribeFile(resolveFilePath);
    }, displayFiles);
}
/**
 * 检擦文件和目录
 * @param {string | Buffer | URL} filePath 目录
 */
function inspectAndDescribeFile(filePath) {
    const result = new FileClass(path.basename(filePath), filePath, '', 0);
    fs.stat(filePath, (err, stat) => {
        if (err) {
            console.log(err);
        }
        else {
            //console.log('stat get isFile '+stat.isFile());
            if (stat.isFile()) { // 判断是否是文件
                result.type = 'file';
                result.size = stat.size;
            }
            if (stat.isDirectory()) { // 判断是否是目录
                result.type = 'directory';
                result.size = stat.size;
            }
            displayFile(result);
        }
    });
}
// eslint-disable-next-line valid-jsdoc
/**
 * 显示
 * @param {Error} err 错误
 * @param {Array<FileClass>} files 文件数组
 */
function displayFiles(err, files) {
    if (err) {
        return alert('sorry, we could not display your files');
    }
    files.forEach(displayFile);
}
/**
 * 显示文件
 * @param {FileClass} file 类
 */
function displayFile(file) {
    //console.log(file.fileName +' ' + file.type+' '+file.size);
    const mainArea = document.getElementById('hstautoworkpanel-store-items');
    const template = document.getElementById('store-item-template');
    // 创建模板实列的副本
    const clone = document.importNode(template, true);
    clone.classList.remove('is-templete');
    // 加入文件名及对应的图标
    clone.querySelector('img').src = `../assets/img/${file.type}.svg`;
    clone.querySelector('.filename').innerHTML = function () {
        if (file.fileName.length > 15)
            return file.fileName.substr(0, 12) + '...';
        else
            return file.fileName;
    }();
    clone.id = 'storeid-' + file.type + '-' + file.fileName;
    if (file.type == 'directory') {
        clone.addEventListener('click', function () {
            alert('d ' + file.fileName);
        });
    }
    else {
        clone.addEventListener('click', function () {
            alert('f ' + file.fileName);
        });
    }
    mainArea.appendChild(clone);
}
/**
 * 删除所有显示
 */
function removeAllFileAndDir() {
    const mainArea = document.getElementById('hstautoworkpanel-store-items');
    // let template = document.getElementById('store-item-template');
    // 这种方式略显粗暴
    mainArea.innerHTML = '';
    // mainArea.appendChild(template);
    // console.log(mainArea.childNodes.length);
    // while(mainArea.childNodes.length>1){
    //  mainArea.removeChild(mainArea.lastElementChild);
    // }
}
/**
 * 移除所有显示的盘符
 */
function removeAllDisks() {
    const disksdiv = document.getElementById('hstautoworkpanel-store-disks');
    disksdiv.innerHTML = '';
}
/**
 * 获取所有驱动器
 */
async function getDriversInfo() {
    removeAllDisks();
    // var current_disk = __dirname.substr(0,2).toLowerCase();
    const disksdiv = document.getElementById('hstautoworkpanel-store-disks');
    const template = document.getElementById('store-disk-template');
    const drives = await drivelist.list();
    drives.forEach(function (driver) {
        // 创建模板实列的副本
        driver.mountpoints.forEach(function (mountpoint) {
            const clone = document.importNode(template, true);
            clone.classList.remove('is-templete');
            clone.id = 'diskid-' + mountpoint.path;
            clone.querySelector('.diskname').innerHTML = mountpoint.path;
            disksdiv.appendChild(clone);
        });
    });
    // let diskinfo = require('diskinfo');
    /*
    diskinfo.getDrives(function(err:Error, aDrives:any) {
      //遍历所有磁盘信息
      for (var i = 0; i < aDrives.length; i++) {
          // 创建模板实列的副本
          let clone = document.importNode(template, true);
          clone.classList.remove('is-templete');
          clone.id='diskid-'+aDrives[i].mounted;
          clone.querySelector('.diskname').innerHTML=aDrives[i].mounted;
          disksdiv.appendChild(clone);
        //只获取当前磁盘信息
        // if( aDrives[i].mounted.toLowerCase() == current_disk ){
        //   //盘符号
        //   var mounted = 'mounted ' + aDrives[i].mounted;
        //   //总量
        //   var total  = 'total ' + (aDrives[i].blocks /1024 /1024 /1024).toFixed(0) + "gb";
        //   //已使用
        //   var used = 'used ' + (aDrives[i].used /1024 /1024 /1024).toFixed(0) + "gb";
        //   //可用
        //   var available = 'available ' + (aDrives[i].available /1024 /1024 /1024).toFixed(0) + "gb";
        //   //使用率
        //   var capacity = 'capacity ' + aDrives[i].capacity;
        //   console.log(mounted+"\r\n"+total+"\r\n"+used+"\r\n"+available+"\r\n"+capacity);
        // }
      }
    });*/
}
document.getElementById('hstautoworkpanel-storepanel-refresh').addEventListener('click', function (event) {
    getFilesInFolder(getUsersHomeFolder());
    // getDriversInfo();
});
getFilesInFolder(getUsersHomeFolder());
getDriversInfo();
//# sourceMappingURL=workpanel.js.map
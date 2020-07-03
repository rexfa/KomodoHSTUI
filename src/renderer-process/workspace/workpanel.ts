/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
// $(function () {
//    $('#myList a:last-child').tab('show');

import {Stats} from 'fs';

// });
import mysql = require('mysql');
import fs = require('fs');

import osenv = require('osenv');
// 引入 aysnc模块
import async = require('async');
// 引入path模块
import path = require('path');
import drivelist = require('drivelist');
/**
 * 文件类
 */
class FileClass {
  fileName: string;
  path: string | Buffer | URL;
  type: string;
  size:number;
  /**
   *
   * @param {string} fileName 文件名
   * @param {string | Buffer | URL} path 路径
   * @param {string} type 类型
   * @param {number} size 大小
   */
  constructor(fileName: string, path: string | Buffer | URL, type: string, size:number) {
    this.fileName = fileName;
    this.path = path;
    this.type = type;
    this.size = size;
  }
}
let selectedFiles:FileClass[];
/**
 * 连接数据库
 * @return {mysql.Connectio} 返回数据库连接
 */
function connectionDB():mysql.Connection {
  const dbConnection:mysql.Connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123qwe', // or the original password : 'apaswword'
    database: 'komodohstauto',
  });
  return dbConnection;
}
/**
 * @return {string} 返回当前用户目录
 */
function getUsersHomeFolder():string {
  //console.log('Home is '+osenv.home());
  return osenv.home();
}

/**
 * 获取目录第一步,需要制定目录全路径名称
 * @param {string | Buffer | URL} folderPath 目录
 */
function getFilesInFolder(folderPath:string | Buffer | URL) {
  console.log('Folder is '+folderPath);
  removeAllFileAndDir();
  const lbCurrentdisk = document.getElementById('hstautoworkpanel-storepanel-currentdisk');
  lbCurrentdisk.innerHTML = folderPath as string;
  // fs.readdir(folderPath, (err, files)=> {
  //   if (err) {
  //     console.log('Folder is not load.'+err.message);
  //     return;
  //   }
  //   //console.log('Folders files length is '+files.length);
  //   inspectAndDescribeFiles(folderPath, files);
  // });
  try {
    const subDirsAndFiles:string[] = fs.readdirSync(folderPath as string); // 换成同步方法
    inspectAndDescribeFiles(folderPath, subDirsAndFiles);
  } catch (err) {
    console.log('fs err is '+err);
    getDriversInfo();
    if (folderPath!=getUsersHomeFolder()) {
      getFilesInFolder(getUsersHomeFolder());
    } else {
      return;
    }
  }
}
/**
 * 异步读取文件和目录
 * @param {string | Buffer | URL} folderPath 目录
 * @param {string[]} files 文件数组
 */
function inspectAndDescribeFiles(folderPath:string | Buffer | URL, files:string[]) {
  async.map(files, function(file) {
    const resolveFilePath = path.resolve(folderPath as string, file);// 返回相对当前路径呃绝对路径
    console.log('Get Path Folders is '+resolveFilePath);
    inspectAndDescribeFile(resolveFilePath);
  }, displayFiles);
}
/**
 * 检擦文件和目录
 * @param {string | Buffer | URL} filePath 目录
 */
function inspectAndDescribeFile(filePath:string | Buffer | URL) {
  const result = new FileClass(path.basename(filePath as string), filePath, '', 0);
  fs.stat(filePath, (err:Error, stat:Stats) => {
    if (err) {
      console.log('Stat info: '+err);
    } else {
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
function displayFiles(err:Error, files:Array<FileClass>) :void{
  if (err) {
    return alert('sorry, we could not display your files');
  }
  files.forEach(displayFile);
}
/**
 * 显示文件
 * @param {FileClass} file 类
 */
function displayFile(file:FileClass) {
  console.log(file.fileName +' ' + file.type+' '+file.size); // 第一次启动时候,刷新按钮使用后往往不执行这一步,增加安全警告豁免试一下
  const mainArea = document.getElementById('hstautoworkpanel-store-items');
  const template = document.getElementById('store-item-template');
  // 创建模板实列的副本
  const clone = document.importNode(template, true);
  clone.classList.remove('is-templete');
  // 加入文件名及对应的图标
  clone.querySelector<'img'>('img').src = `../assets/img/${file.type}.svg`;
  clone.querySelector('.filename').innerHTML = function():string {
    if (file.fileName.length>15) return file.fileName.substr(0, 12)+'...'; else return file.fileName;
  }();
  const cloneDivCheckbox = clone.querySelector('.hstautoworkpanel-section-floatcheckbox');
  const cloneCheckbox:any = clone.querySelector('.hstautoworkpanel-floatcheckbox');
  const cloneImg = clone.querySelector('.icon');
  clone.id='storeid-'+file.type+'-'+file.fileName;
  if (file.type=='directory') {
    cloneDivCheckbox.classList.remove('is-shown');
    cloneImg.addEventListener('click', function() {
      // alert('d '+file.path);
      getFilesInFolder(file.path);
    });
  } else {
    cloneDivCheckbox.id='checkbox-'+file.path;
    cloneCheckbox.value = file.path as string;
    cloneImg.addEventListener('click', function() {
      // alert('f '+file.fileName);
      clickCheckbox(cloneCheckbox);
    });
    cloneCheckbox.addEventListener('onChanged', function() {
      constructSelectFileList();
    });
  }
  mainArea.appendChild(clone);
}
/**
 * 删除所有显示
 */
function removeAllFileAndDir():void {
  const mainArea = document.getElementById('hstautoworkpanel-store-items');
  while (mainArea.lastChild) {
    mainArea.removeChild(mainArea.lastChild);
  }
  // 这种方式略显粗暴
  //mainArea.innerHTML='';
}
/**
 * 移除所有显示的盘符
 */
function removeAllDisks():void {
  const disksdiv = document.getElementById('hstautoworkpanel-store-disks');
  //disksdiv.removeAllChild();  // 不用这个为了兼容性
  while (disksdiv.lastChild) {
    disksdiv.removeChild(disksdiv.lastChild);
  }
  //disksdiv.innerHTML=''; // 过于暴力
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
  drives.forEach(function(driver) {
    // 创建模板实列的副本
    driver.mountpoints.forEach(function(mountpoint) {
      const clone = document.importNode(template, true);
      clone.classList.remove('is-templete');
      clone.id='diskid-'+mountpoint.path;
      if (driver.isUSB) {
        clone.classList.add('is-usb');
      } else {
        clone.classList.add('is-flexed');
      }
      clone.querySelector('.diskname').innerHTML=mountpoint.path;
      clone.addEventListener('click', function() {
        getFilesInFolder(mountpoint.path);
      });
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
/**
 *
 * @param {string} filePath 路径
 */
function addTaskFileList(filePath:string) {
  selectedFiles.forEach(function(file) {
    if (file.path==filePath) {
      return;
    }
  });
  const newfile = new FileClass(path.basename(filePath as string), filePath, '', 0);
  selectedFiles.push(newfile);
}
/**
 * 重新构建选定文件列表
 */
function constructSelectFileList() {
  selectedFiles = new Array<FileClass>();
  const checkboxs = document.querySelectorAll('.hstautoworkpanel-floatcheckbox');
  checkboxs.forEach(function(cb:any) {
    if (cb.checked) {
      const newfile = new FileClass(path.basename(cb.value), cb.value, '', 0);
      selectedFiles.push(newfile);
    }
  });
  document.getElementById('hstautoworkpanel-storepanel-selectcount').innerHTML='' + selectedFiles.length;
}
/**
 * 改变checkbox
 * @param {any} cloneCheckbox checkbox
 */
function clickCheckbox(cloneCheckbox:any) {
  cloneCheckbox.checked = (!cloneCheckbox.checked);
  constructSelectFileList();
}
/**
 * 将选定文件加入工作列表
 */
function addFileListToTaskList() {
  console.log('test');
  const sql = 'insert into book set ?';
  const data = {
    taskname: '图书名称',
    filename: '图书作者',
    filehash: '图书分类',
    hashmethod: '图书简述',
    workstate: '',
    workmethod: '',
    createdon: '',
    dealon: '',
    completedon: '',
    reportfile: '',
    suggestions: '',
    lastdownloadon: '',
    downloadcount: '',
  };
  const connection = connectionDB();
  if (selectedFiles.length>0) {
    selectedFiles.forEach(function(file:FileClass) {
      connection.query(sql, data, function(error, results, fields) {
        if (error) throw error;
        if (results.affectedRows == 1) {
          console.log('插入成功');
        }
        //执行插入成功返回的results
        // OkPacket {
        //   fieldCount: 0,
        //   affectedRows: 1,
        //   insertId: 7,
        //   serverStatus: 2,
        //   warningCount: 0,
        //   message: '',
        //   protocol41: true,
        //   changedRows: 0
        // }
      });
    });
    connection.end();
  }
}
document.getElementById('hstautoworkpanel-storepanel-refresh').addEventListener('click', function(event:MouseEvent) {
  getFilesInFolder(getUsersHomeFolder());
  getDriversInfo();
});
document.getElementById('hstautoworkpanel-storepanel-addTask').addEventListener('click', function(event:MouseEvent) {
  addFileListToTaskList();
});
getFilesInFolder(getUsersHomeFolder());
getDriversInfo();

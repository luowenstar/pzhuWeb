import axios from 'src/http/axios';
import qs from 'qs';

const Base = {
  qiniuToken: '/qiniutoken', // 获取七牛云的上传证书
  getadminInfo: '/back/getadminInfo', // 获取管理员的信息
  getUserInfo: '/back/getUserInfo', // 获取用户信息
  adminLogin: '/back/adminLogin', // 管理员后台登录
  userReviewPass: '/back/userReviewPass', // 用户审核通过
  userRefuseJoin: '/back/userRefuseJoin', // 拒绝用户加入
  deleteUser: '/back/deleteUser', // 删除成员信息
  getAddUserInfo: '/back/getAddUserInfo', // 获取添加和修改成员的信息
  updateUserInfo: '/back/updateUserInfo', // 更新用户信息
  addUserInfo: '/back/addUserInfo', // 添加成员信息
  searchUsers: '/back/searchUsers', // 搜索用户
  resetPassword: '/back/resetPassword', // 重置密码
  // 文章管理模块的接口
  getArticleInfo: '/back/getArticleInfo', // 获取文章信息
  istop: '/back/istop', // 文章是否置顶
  deleteArticle: '/back/deleteArticle', // 是否确认删除该文章
  onSerachArticle: '/back/onSerachArticle', // 搜索文章
  delArticleTag: '/back/delArticleTag', // 删除文章
  addArticleTag: '/back/addArticleTag', // 添加技术标签
  getArticleEdit: '/back/getArticleEdit', // 获取文章编辑界面的初始化信息
  // 资源模块管理模块接口
  getResourceInfo: '/back/getResourceInfo', // 获取资源信息
  delResource: '/back/delResource', // 删除资源信息
  addResourceTag: '/back/addResourceTag', // 添加资源类别
  delResourceTag: '/back/delResourceTag', // 删除资源类别
  onSerachResource: '/back/onSerachResource', // 搜索资源信息
  // 成果管理模块的接口
  getAchievementInfo: '/back/getAchievementInfo', // 获取成果信息
  delAchievement: '/back/delAchievement', // 删除成果信息
  addAchievementTag: '/back/addAchievementTag', // 添加成果类别
  delAchievementTag: '/back/delAchievementTag', // 添加成果信息
  onSerachAchievement: '/back/onSerachAchievement', // 搜索成果
  isShow: '/back/isShow', // 是否展示成果
  // 后台文章编辑的接口
  getMediaItems: '/back/getMediaItems', // 获取编辑器媒体库的初始内容
  removeMedia: '/back/removeMedia', // 删除编辑媒体库的文件
  uploadMedia: '/back/uploadMedia', // 上传媒体资源
  uploadBackArticle: '/back/uploadBackArticle', // 上传后台文章编辑内容
  // 后台相册管理接口
  getAlbums: '/album/getAlbums',
  createAlbumType: '/back/album/createAlbumType',
  getAlbumTypes: '/album/getAlbumTypes',
  delAlbumType: '/album/delAlbumType',
  getPhotosByAlbumId: '/album/getPhotosByAlbumId',
  delPhotos: '/album/delPhotos',
  updatePhotos: '/album/updatePhotos',
  updateAlbumCover: '/album/updateAlbumCover',
  createAlbum: '/album/createAlbum',
  updateAlbum: '/album/updateAlbum',
  delAlbum: '/album/delAlbum',
  // 主页配置
  getHomeInfo: '/home/getHomeInfo',
  updateHomeInfo: '/home/updateHomeInfo',
};

export interface IRes {
  status: any;
  data?: { [propName: string]: any } & Array<any>;
  success?: number;
  message?: string;
}

const Get = function(url: string) {
  return new Promise<IRes>((resolve, reject) => {
    axios
      .get(url)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
};
const get = (url, params) => {
  return new Promise<IRes>((resolve, reject) => {
    axios
      .get(`${url}?${qs.stringify(params)}`)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
};

const Post = function(url: string, params: { [key: string]: any }) {
  return new Promise<IRes>((resolve, reject) => {
    axios
      .post(url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
};

export { Base, Get, get, Post };

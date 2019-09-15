import React, { Component } from 'react';
import { Button, Modal, Form, Input, Tooltip, Icon, AutoComplete, message, Cascader, Spin, DatePicker } from 'antd';
import moment from 'moment';
// 引入七牛云
import * as qiniu from 'qiniu-js'
import qiniuAPI from '../../api/qiniu'
// 引入编辑器组件
import BraftEditor from '../../components/braftEditor'
import ArticleAPI from '../../api/article'
import './index.scss'
class ArticleEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: undefined,
      userid: undefined,
      initMenu: [],
      initTechnology: [],
      menu: [],
      technology: [],
      postlink: '',
      date: new Date(),
      editorState: '',// 文章内容
      context: '',// 解析后的文章内容
      raw: '',
      base64: '',//上传封面图得到的base64格式
      file: '',//图片上传源文件格式
      loading: false,// 文章修改中
      filePostfix: '',// 上传文件图片的后缀名
    };
  }
  componentDidMount() {
    this.setState({
      id: this.props.params.id || null
    }, () => {
      this.getArticleEdit()
    })
  }
  getArticleEdit = () => {
    let params = {
      id: this.state.id
    }
    ArticleAPI.getArticleEdit(params).then(res => {
      if (res.success) {
        this.initMenuAndTec(res.data.menu, res.data.technology);
        this.initArticleInfo(res.data.article);
      } else {
        message.warning('修改的文章不存在')
        this.props.router.push('/back/article');
      }
    }).catch(err => {
      console.log(err)
      this.props.router.push('/back/article');
    })
  }
  // 初始化文章类别和技术标签
  initMenuAndTec = (menu, technology) => {
    const initMenu = menu.map(item => {
      return {
        label: item.name,
        value: item.id
      }
    })
    const initTechnology = technology.map(item => {
      return {
        label: item.name,
        value: item.id
      }
    })
    this.setState({
      initMenu,
      initTechnology
    })
  }
  // 初始化文章的信息
  initArticleInfo = (data) => {
    let { setFieldsValue } = this.props.form;
    setFieldsValue({
      'title': data[0].title,
      "keywords": data[0].keywords,
      'created_at': moment(data[0].created_at, 'YYYY-MM-DD')
    })
    this.setState({
      postlink: data[0].postlink,
      menu: [data[0].menuid],
      technology: [data[0].technologyid],
      date: data[0].created_at,
      editorState: data[0].raw,
      userid: data[0].userid
    })
  }
  // 修改文章日期
  handleChangeDate = (data, dataString) => {
    this.setState({
      data: dataString
    })
  }
  // 获取编辑器的内容
  getBraftContext = (data) => {
    this.setState({
      context: data.context,
      raw: data.raw
    })
  }
  // 获取本地文章封面图
  uploadCover = (e) => {
    let file = e.target.files
    const { size, type, name } = file[0];
    if (type !== "image/jpeg" && type !== 'image/png') {
      message.warning('请上传类型为 png 或 jpg 的图片 ')
      return;
    };
    if (size > (1024 * 1024)) {
      message.warning('请上传小于1M的图片');
      return;
    }
    let arry = name.split('.')
    let postfix = arry[arry.length - 1]
    const that = this;
    let reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = function (e) {
      that.setState({
        postlink: this.result,
        file: file[0],
        filePostfix: postfix,
      })
    }
  }
  dataURLtoBlob = (dataurl) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };
  // 上传封面图片到七牛云
  uploadCoverToQiniu = () => {
    const fileBase64 = this.state.postlink;
    const postfix = this.state.filePostfix;
    const blob = this.dataURLtoBlob(fileBase64)
    return new Promise((resolve, reject) => {
      qiniuAPI.getToken().then(res => {
        let token = res.data;
        // let key = this.state.userid + Date.now() + `.${postfix}`;
        let key = "test123" + Date.now() + `.${postfix}`
        let config = {
          useCdnDomain: true, //是否使用 cdn 加速域名
          region: qiniu.region.z2 //选择上传域名 华南
        }
        let putExtra = {
          fname: Date.now(),
          params: {},
          mimeType: ["image/png", "image/jpeg"]
        }
        let observable = qiniu.upload(blob, key, token, putExtra, config)
        let observer = {
          next(res) {
            // that.setState({
            //   progress: Math.floor(res.total.percent)
            // })
          },
          error(err) {
            reject(err)
          },
          complete(res) {
            resolve(res)
          }
        }
        observable.subscribe(observer)
        // subscription.unsubscribe(); //取消上传
      })
    })


  }
  // 发布修改后的文章
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fileValue) => {
      if (!err) {
        this.uploadCoverToQiniu().then(res => {
          const values = {
            ...fileValue,
            'created_at': fileValue['created_at'].format('YYYY-MM-DD'),
            context: this.state.context,
            raw: this.state.raw,
            key: res.key,
            id:this.state.id,
            userid:this.state.userid
          }
          // 编辑后的文章资源可以发布后台
          console.log(values)
        }).catch(err => {
          console.log(err)
          message.warning('修改失败');
          this.setState({
            loading: false
          })
        })
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const braftEditorConfig = {
      articleid: this.state.id,
      editorState: this.state.editorState
    }
    return (
      <div className='revise-article'>
        <Spin tip='文章发布中...' spinning={this.state.loading} >
          <div className='container' >
            <div className='title'>
              <span>文章编辑</span>
            </div>
            <div className='header'>
              <div className='form-edit'>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                  <Form.Item label="文章标题">
                    {getFieldDecorator('title', {
                      rules: [
                        {
                          required: true,
                          message: '请输入文章标题',
                          whitespace: true
                        }
                      ]
                    })(<Input placeholder="请输入文章标题" />)}
                  </Form.Item>
                  <Form.Item label="关键字">
                    {getFieldDecorator('keywords', {
                      rules: [
                        {
                          required: true,
                          message: '请输入与关键字',
                          whitespace: true
                        }
                      ]
                    })(<Input placeholder="请输入与关键字" />)}
                  </Form.Item>
                  <Form.Item label="文章类别">
                    {getFieldDecorator('menuid', {
                      initialValue: this.state.menu,
                      rules: [
                        {
                          type: 'array',
                          required: true,
                          message: '请选择文章类别'
                        }
                      ]
                    })(
                      <Cascader
                        placeholder="请选择文章类别"
                        // showSearch={this.filter}
                        options={this.state.initMenu}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="技术标签">
                    {getFieldDecorator('technologyid', {
                      initialValue: this.state.technology,
                      rules: [
                        {
                          type: 'array',
                          required: true,
                          message: '请选择技术标签'
                        }
                      ]
                    })(
                      <Cascader
                        placeholder="请选择技术标签"
                        // showSearch={this.filter}
                        options={this.state.initTechnology}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="发布日期">
                    {getFieldDecorator('created_at', {
                      rules: [{ type: 'object', required: true, message: '请选择发布日期!' }],
                    })(<DatePicker />)}
                  </Form.Item>
                  <Form.Item >
                    <Button style={{ marginLeft: 35 }} type="primary" htmlType="submit">
                      确认修改
                  </Button>
                  </Form.Item>
                </Form>
              </div>
              <div className='cover-edit'>
                <div className='cover-img'>
                  <img src={this.state.postlink} alt="文章封面图" />
                </div>
                <Button ghost type='primary' >
                  <label htmlFor="uploadCover"  >
                    修改封面
                </label>
                </Button>

                <input id='uploadCover' accept=".png, .jpg, .jpeg" type="file" hidden onChange={this.uploadCover} />
              </div>
            </div>
            <div className='article-edit'>
              <BraftEditor {...braftEditorConfig} getBraftContext={this.getBraftContext} />
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

export default Form.create()(ArticleEdit);
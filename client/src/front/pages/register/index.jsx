import React, { Component } from 'react';
import { Form, Button, Input, Steps, Tooltip, Icon, Row, Col, AutoComplete } from 'antd';
import RegisterApi from '../../api/register';
import './index.scss';
import md5 from 'md5'; //MD5加密

// 自动完成
const AutoCompleteOption = AutoComplete.Option;

class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			confirmDirty: false,
			autoCompleteResult: []
		};
	}
	// 提交表单
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				values['password'] = md5(values.password);
				values['confirm'] = md5(values.confirm);
				RegisterApi.registerUser(values)
					.then((res) => {
						console.log(res.message);
					})
					.catch((error) => {
						console.log(error);
					});
			}
		});
	};
	// 密码验证
	handleConfirmBlur = (e) => {
		const value = e.target.value;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	};
	compareToFirstPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (value && value !== form.getFieldValue('password')) {
			callback('请确保两次密码输入一致');
		} else {
			callback();
		}
	};
	validateToNextPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (value && this.state.confirmDirty) {
			form.validateFields([ 'confirm' ], { force: true });
		}
		callback();
	};
	// 邮箱提示格式
	handleWebsiteChange = (value) => {
		let autoCompleteResult;
		if (!value || value.indexOf('@') >= 0) {
			autoCompleteResult = [];
		} else {
			autoCompleteResult = [ '@gmail.com', '@163.com', '@qq.com', '@aliyun.com' ].map(
				(domain) => `${value}${domain}`
			);
		}
		this.setState({ autoCompleteResult });
	};
	//发送邮箱验证码
	uploadCode = (e) => {
		e.preventDefault();
		const form = this.props.form;
		let email = form.getFieldValue('email');
		if (email === undefined) {
			form.validateFields([ 'email' ], { force: true });
			return;
		}
		let params = {
			email: email
		};
		RegisterApi.uploadCode(params)
			.then((res) => {
				console.log(res.message);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	render() {
		// 用户注册头部栏
		const Step = Steps.Step;
		const steps = [
			{
				title: '用户注册',
				iconType: 'user'
			}
		];
		const { getFieldDecorator } = this.props.form;
		// 邮箱自动补全

		const websiteOptions = this.state.autoCompleteResult.map((website) => (
			<AutoCompleteOption key={website}>{website}</AutoCompleteOption>
		));

		return (
			<div className="register-container">
				<div className="back-img">
					<img src="http://cdn.niuxingxing.com/144535sbpfgf7pfis6afhf.jpg" alt="这是注册背景图" />
				</div>
				<div className="shadow-bottom" />
				<div className="shadow-top">
					<div className="register-content">
						<div className="register-top">
							<Steps current={0}>
								{steps.map((item, index) => {
									return <Step key={index} title={item.title} icon={<Icon type={item.iconType} />} />;
								})}
							</Steps>
						</div>
						<div className="register-content">
							<div className="register-form-content">
								<Form layout="inline" onSubmit={this.handleSubmit}>
									<Form.Item label="邮箱">
										{getFieldDecorator('email', {
											rules: [ { required: true, message: '请输入邮箱' } ]
										})(
											<AutoComplete
												dataSource={websiteOptions}
												onChange={this.handleWebsiteChange}
												placeholder="请输入邮箱"
											>
												<Input />
											</AutoComplete>
										)}
									</Form.Item>
									<Form.Item label="学号">
										{getFieldDecorator('schoolId', {
											rules: [
												{
													required: true,
													message: '请输入学号',
													whitespace: true
												}
											]
										})(<Input placeholder="请输入学号" />)}
									</Form.Item>

									<Form.Item
										label={
											<span>
												姓名&nbsp;
												<Tooltip title="请不要使用昵称">
													<Icon type="question-circle-o" />
												</Tooltip>
											</span>
										}
									>
										{getFieldDecorator('name', {
											rules: [
												{
													required: true,
													message: '请输入姓名',
													whitespace: true
												}
											]
										})(<Input placeholder="请输入姓名" />)}
									</Form.Item>

									<Form.Item label="密码">
										{getFieldDecorator('password', {
											rules: [
												{
													required: true,
													message: '请输入密码'
												},
												{
													validator: this.validateToNextPassword
												}
											]
										})(<Input type="password" placeholder="请输入密码" />)}
									</Form.Item>

									<Form.Item label="确认密码">
										{getFieldDecorator('confirm', {
											rules: [
												{
													required: true,
													message: '请确认密码'
												},
												{
													validator: this.compareToFirstPassword
												}
											]
										})(
											<Input
												type="password"
												placeholder="请确认密码"
												onBlur={this.handleConfirmBlur}
											/>
										)}
									</Form.Item>

									<Form.Item label="邮箱验证" extra="我们必须确保邮箱是你本人的且是正确的">
										<Row gutter={8}>
											<Col span={16}>
												{getFieldDecorator('code', {
													rules: [
														{
															required: true,
															message: '请输入验证码',
															whitespace: true
														}
													]
												})(<Input placeholder="请输入验证码" />)}
											</Col>
											<Col span={8}>
												<Button onClick={this.uploadCode}>发送验证码</Button>
											</Col>
										</Row>
									</Form.Item>

									<Form.Item className="btn">
										<Button type="primary" htmlType="submit">
											立即注册
										</Button>
									</Form.Item>
								</Form>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
const Registers = Form.create({})(Register);

export default Registers;